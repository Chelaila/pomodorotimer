import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useYouTube } from '../../contexts/YouTubeContext';

interface YouTubePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const extractVideoId = (input: string): string | null => {
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const match = /(?:youtu\.be\/|[?&]v=|embed\/|watch\?v=)([a-zA-Z0-9_-]{11})/.exec(trimmed);
  return match?.[1] ?? null;
};

const formatDuration = (iso: string): string => {
  const m = /PT(\d+H)?(\d+M)?(\d+S)?/.exec(iso);
  if (!m) return '';
  const h = (m[1] ?? '').replace('H', '');
  const min = (m[2] ?? '').replace('M', '');
  const sec = (m[3] ?? '').replace('S', '');
  return h ? `${h}:${min.padStart(2, '0')}:${sec.padStart(2, '0')}` : `${min || '0'}:${sec.padStart(2, '0')}`;
};

// Thumbnail with graceful fallback on 404 / load error
const Thumb: React.FC<{ src: string; className: string }> = ({ src, className }) => {
  const [broken, setBroken] = useState(false);

  useEffect(() => setBroken(false), [src]);

  if (!src || broken) {
    return (
      <div className={`${className} bg-[var(--bg-tertiary)] flex items-center justify-center`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--text-tertiary)] opacity-50" viewBox="0 0 20 20" fill="currentColor">
          <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt=""
      className={`${className} object-cover bg-[var(--bg-tertiary)]`}
      onError={() => setBroken(true)}
    />
  );
};

const YouTubePanel: React.FC<YouTubePanelProps> = ({ isOpen, onClose }) => {
  const {
    playlist,
    currentIndex,
    videoId,
    isPlayerVisible,
    showPlayer,
    addToPlaylist,
    removeFromPlaylist,
    updateVideoInPlaylist,
  } = useYouTube();

  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAdd = async () => {
    const vid = extractVideoId(inputValue);
    if (!vid) {
      setError('URL o ID inválido');
      return;
    }
    setError('');
    addToPlaylist({
      id: vid,
      title: '',
      thumbnail: `https://img.youtube.com/vi/${vid}/hqdefault.jpg`,
      duration: '',
    });
    setInputValue('');

    // Fetch real metadata if API key is available
    if (YOUTUBE_API_KEY) {
      try {
        const r = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?id=${vid}&part=snippet,contentDetails&key=${YOUTUBE_API_KEY}`
        );
        const data = await r.json();
        if (data.items?.length > 0) {
          const item = data.items[0];
          updateVideoInPlaylist(vid, {
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails?.medium?.url ?? `https://img.youtube.com/vi/${vid}/hqdefault.jpg`,
            duration: formatDuration(item.contentDetails.duration),
          });
        }
      } catch {
        // Keep thumbnail fallback if fetch fails
      }
    }
  };

  const handlePlay = (vid: string) => {
    showPlayer(vid);
    onClose();
  };

  const currentVideo = playlist[currentIndex] ?? null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-30"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in panel */}
      <div className="fixed top-0 right-0 h-full w-80 z-50 flex flex-col bg-[var(--bg-secondary)] shadow-2xl border-l border-[var(--border-light)]">

        {/* Panel header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-light)] flex-shrink-0">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-light" viewBox="0 0 20 20" fill="currentColor">
              <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
            </svg>
            <span className="font-semibold text-[var(--text-primary)]">Cola de música</span>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] p-1 rounded"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Now Playing */}
        {isPlayerVisible && videoId && currentVideo && (
          <div className="px-4 py-3 bg-primary-light/10 border-b border-[var(--border-light)] flex-shrink-0">
            <p className="text-xs font-medium text-primary-light mb-2 uppercase tracking-wide">Reproduciendo ahora</p>
            <div className="flex items-center space-x-3">
              <Thumb
                src={currentVideo.thumbnail}
                className="w-16 h-9 rounded flex-shrink-0"
              />
              <span className="text-sm text-[var(--text-primary)] line-clamp-2 leading-tight">
                {currentVideo.title || currentVideo.id}
              </span>
            </div>
          </div>
        )}

        {/* Add video input */}
        <div className="px-4 py-3 border-b border-[var(--border-light)] flex-shrink-0">
          <p className="text-xs text-[var(--text-tertiary)] mb-2">Agregar a la cola</p>
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={e => { setInputValue(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="URL o ID de YouTube..."
              className="flex-1 px-3 py-2 text-sm rounded border border-[var(--border-medium)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-primary-light"
            />
            <button
              onClick={handleAdd}
              className="px-3 py-2 bg-primary-light text-white rounded hover:opacity-90 flex-shrink-0"
              title="Agregar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>

        {/* Playlist */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 pt-3 pb-1">
            <p className="text-xs text-[var(--text-tertiary)]">
              {playlist.length === 0 ? 'La cola está vacía' : `${playlist.length} videos en cola`}
            </p>
          </div>

          {playlist.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-[var(--text-tertiary)]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <p className="text-sm">Agrega un video para empezar</p>
            </div>
          )}

          <div className="px-2 pb-4 space-y-1">
            {playlist.map((video, i) => {
              const isActive = i === currentIndex && isPlayerVisible;
              return (
                <div
                  key={video.id}
                  className={`flex items-center space-x-2 p-2 rounded-lg group transition-colors ${
                    isActive
                      ? 'bg-primary-light/10 border border-primary-light/40'
                      : 'hover:bg-[var(--bg-tertiary)] border border-transparent'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative flex-shrink-0 w-14 h-8">
                    <Thumb src={video.thumbnail} className="w-full h-full rounded" />
                    {isActive && (
                      <div className="absolute inset-0 flex items-center justify-center rounded bg-black bg-opacity-30">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Title + duration */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[var(--text-primary)] line-clamp-2 leading-tight">
                      {video.title || video.id}
                    </p>
                    {video.duration && (
                      <p className="text-xs text-[var(--text-tertiary)]">{video.duration}</p>
                    )}
                  </div>

                  {/* Actions — visible on hover */}
                  <div className="flex items-center space-x-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handlePlay(video.id)}
                      title="Reproducir"
                      className="p-1 text-primary-light hover:opacity-75 rounded"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => removeFromPlaylist(video.id)}
                      title="Quitar"
                      className="p-1 text-[var(--text-tertiary)] hover:text-red-500 rounded"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default YouTubePanel;
