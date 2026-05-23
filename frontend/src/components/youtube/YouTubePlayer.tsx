import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useYouTube } from '../../contexts/YouTubeContext';
import { YouTubeVideo, YouTubePlayerProps } from '../../interfaces/youtube/YouTube.interface';
import PlaylistVideoCard from './PlaylistVideoCard';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ initialPlaylist = [] }) => {
  const {
    videoId,
    isPlayerVisible,
    isMinimized,
    toggleMinimize,
    hidePlayer,
    playlist,
    currentIndex,
    setCurrentVideo,
    nextVideo,
    previousVideo,
    addToPlaylist,
    setPlaylist,
    updateVideoInPlaylist,
  } = useYouTube();

  const [showPlaylist, setShowPlaylist] = useState(false);
  const [newVideoId, setNewVideoId] = useState('');
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(false);
  const [currentVideoInfo, setCurrentVideoInfo] = useState<YouTubeVideo | null>(null);
  const [ytReady, setYtReady] = useState(false);
  const playerRef = useRef<any>(null);

  // Load the YouTube IFrame API script once
  useEffect(() => {
    if (window.YT?.Player) {
      setYtReady(true);
      return;
    }
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
    window.onYouTubeIframeAPIReady = () => setYtReady(true);
  }, []);

  // Create or update the player when videoId and the YT API are both ready
  useEffect(() => {
    if (!videoId || !ytReady) return;

    if (!playerRef.current) {
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId,
        playerVars: {
          autoplay: 1,
          modestbranding: 1,
          rel: 0,
          enablejsapi: 1,
        },
        events: {
          onReady: (event: any) => event.target.playVideo(),
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.ENDED) nextVideo();
          },
        },
      });
    } else {
      playerRef.current.loadVideoById(videoId);
    }
  }, [videoId, ytReady, nextVideo]);

  // Fetch video metadata separately — does NOT block playback
  useEffect(() => {
    if (!videoId || !YOUTUBE_API_KEY) return;
    let cancelled = false;

    fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails&key=${YOUTUBE_API_KEY}`
    )
      .then(r => r.json())
      .then(data => {
        if (cancelled || !data.items?.length) return;
        const item = data.items[0];
        const info: YouTubeVideo = {
          id: videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.medium.url,
          duration: formatDuration(item.contentDetails.duration),
        };
        setCurrentVideoInfo(info);
        updateVideoInPlaylist(videoId, info);
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, [videoId, updateVideoInPlaylist]);

  // Clean up player on unmount
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, []);

  const formatDuration = (duration: string): string => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return '0:00';
    const hours = (match[1] || '').replace('H', '');
    const minutes = (match[2] || '').replace('M', '');
    const seconds = (match[3] || '').replace('S', '');
    let result = '';
    if (hours) {
      result += `${hours}:`;
      result += `${minutes.padStart(2, '0')}:`;
    } else {
      result += `${minutes || '0'}:`;
    }
    result += `${seconds.padStart(2, '0')}`;
    return result;
  };

  // Load initial playlist
  useEffect(() => {
    if (initialPlaylist.length > 0) {
      setPlaylist(initialPlaylist);
      if (initialPlaylist[0]) setCurrentVideo(initialPlaylist[0].id);
    }
  }, [initialPlaylist, setPlaylist, setCurrentVideo]);

  const handleAddVideo = async () => {
    if (!newVideoId.trim()) return;
    try {
      if (YOUTUBE_API_KEY) {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?id=${newVideoId.trim()}&part=snippet,contentDetails&key=${YOUTUBE_API_KEY}`
        );
        const data = await response.json();
        if (data.items?.length > 0) {
          const item = data.items[0];
          addToPlaylist({
            id: newVideoId.trim(),
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.medium.url,
            duration: formatDuration(item.contentDetails.duration),
          });
        }
      } else {
        addToPlaylist({ id: newVideoId.trim(), title: newVideoId.trim(), thumbnail: '', duration: '' });
      }
      setNewVideoId('');
    } catch {
      addToPlaylist({ id: newVideoId.trim(), title: newVideoId.trim(), thumbnail: '', duration: '' });
      setNewVideoId('');
    }
  };

  const handleLoadPlaylist = async () => {
    if (!playlistUrl.trim()) return;
    setIsLoadingPlaylist(true);
    try {
      const playlistId = extractPlaylistId(playlistUrl);
      if (!playlistId) throw new Error('Invalid playlist URL');

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${playlistId}&part=snippet,contentDetails&maxResults=50&key=${YOUTUBE_API_KEY}`
      );
      const data = await response.json();

      if (data.items) {
        const playlistVideos: YouTubeVideo[] = await Promise.all(
          data.items.map(async (item: any) => {
            try {
              const videoResponse = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?id=${item.contentDetails.videoId}&part=contentDetails&key=${YOUTUBE_API_KEY}`
              );
              const videoData = await videoResponse.json();
              const duration = videoData.items?.[0]?.contentDetails?.duration ?? 'PT0S';
              return {
                id: item.contentDetails.videoId,
                title: item.snippet.title,
                thumbnail: item.snippet.thumbnails?.medium?.url ?? '',
                duration: formatDuration(duration),
              };
            } catch {
              return {
                id: item.contentDetails.videoId,
                title: item.snippet.title,
                thumbnail: '',
                duration: '',
              };
            }
          })
        );
        setPlaylist(playlistVideos);
        setPlaylistUrl('');
      }
    } catch (error) {
      console.error('Error al cargar la playlist:', error);
    } finally {
      setIsLoadingPlaylist(false);
    }
  };

  const extractPlaylistId = (url: string): string | null => {
    const patterns = [
      /[?&]list=([^&]+)/,
      /\/playlist\?list=([^&]+)/,
      /\/playlist\/([^?&]+)/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match?.[1]) return match[1];
    }
    return null;
  };

  if (!isPlayerVisible || !videoId) return null;

  const Spinner = () => (
    <svg className="animate-spin h-8 w-8 text-primary-light" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  return (
    <div
      className="fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out"
      style={{ width: isMinimized ? '320px' : '480px', height: isMinimized ? '180px' : '270px' }}
    >
      <div className="bg-background-paper rounded-lg shadow-lg overflow-hidden h-full flex flex-col">
        {/* Header bar */}
        <div className="bg-primary-light p-2 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center overflow-hidden">
            <button onClick={toggleMinimize} className="text-white hover:opacity-75 mr-2 flex-shrink-0">
              {isMinimized ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 7a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 13a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            <span className="text-white text-sm truncate">
              {currentVideoInfo?.title || 'YouTube Player'}
            </span>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <button onClick={() => setShowPlaylist(!showPlaylist)} className="text-white hover:opacity-75">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
            </button>
            <button onClick={hidePlayer} className="text-white hover:opacity-75">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Player + playlist */}
        <div className="flex flex-1 overflow-hidden">
          <div className="relative flex-1">
            {/* Always render the player div so YT API can attach to it */}
            <div id="youtube-player" className="absolute top-0 left-0 w-full h-full" />
            {/* Overlay spinner only while YT API script is loading */}
            {!ytReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
                <Spinner />
              </div>
            )}
          </div>

          {showPlaylist && !isMinimized && (
            <div className="w-64 bg-background-dark overflow-y-auto flex-shrink-0">
              <div className="p-2">
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newVideoId}
                      onChange={e => setNewVideoId(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddVideo()}
                      placeholder="ID del video"
                      className="flex-1 px-2 py-1 text-sm bg-background-paper text-text-primary rounded"
                    />
                    <button onClick={handleAddVideo} className="p-1 text-white hover:opacity-75">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <form onSubmit={e => { e.preventDefault(); handleLoadPlaylist(); }} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={playlistUrl}
                      onChange={e => setPlaylistUrl(e.target.value)}
                      placeholder="URL de la playlist"
                      className="flex-1 px-2 py-1 text-sm bg-background-paper text-text-primary rounded"
                    />
                    <button type="submit" disabled={isLoadingPlaylist} className="p-1 text-white hover:opacity-75 disabled:opacity-50">
                      {isLoadingPlaylist ? <Spinner /> : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </form>
                </div>
                <h3 className="text-white font-medium mb-2">Playlist</h3>
                <div className="space-y-2">
                  {playlist.map((video: YouTubeVideo, index: number) => (
                    <PlaylistVideoCard
                      key={video.id}
                      video={video}
                      isActive={index === currentIndex}
                      onClick={() => setCurrentVideo(video.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controls bar */}
        {!isMinimized && (
          <div className="bg-background-dark p-2 flex justify-between items-center flex-shrink-0">
            <div className="flex items-center space-x-2">
              <button
                onClick={previousVideo}
                disabled={currentIndex === 0}
                className="text-text-secondary hover:text-text-primary disabled:opacity-40"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={nextVideo}
                disabled={currentIndex === playlist.length - 1}
                className="text-text-secondary hover:text-text-primary disabled:opacity-40"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="text-text-secondary text-sm">
              {currentIndex + 1} / {Math.max(playlist.length, 1)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubePlayer;
