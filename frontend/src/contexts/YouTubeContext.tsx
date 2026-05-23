import * as React from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { YouTubeVideo } from '../interfaces/youtube/YouTube.interface';

interface YouTubeContextType {
  videoId: string | null;
  isPlayerVisible: boolean;
  isMinimized: boolean;
  playlist: YouTubeVideo[];
  currentIndex: number;
  showPlayer: (videoId: string) => void;
  hidePlayer: () => void;
  toggleMinimize: () => void;
  setCurrentVideo: (videoId: string) => void;
  nextVideo: () => void;
  previousVideo: () => void;
  addToPlaylist: (video: YouTubeVideo) => void;
  removeFromPlaylist: (videoId: string) => void;
  setPlaylist: (playlist: YouTubeVideo[]) => void;
  updateVideoInPlaylist: (videoId: string, partial: Partial<YouTubeVideo>) => void;
}

const YouTubeContext = createContext<YouTubeContextType | undefined>(undefined);

// ── API helpers ────────────────────────────────────────────────────────────────

const API = '/api/playlist';

async function dbAdd(video: YouTubeVideo): Promise<void> {
  await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      videoId: video.id,
      title: video.title,
      thumbnail: video.thumbnail,
      duration: video.duration,
    }),
  }).catch(() => {});
}

async function dbPatch(videoId: string, partial: Partial<YouTubeVideo>): Promise<void> {
  await fetch(`${API}/${videoId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: partial.title,
      thumbnail: partial.thumbnail,
      duration: partial.duration,
    }),
  }).catch(() => {});
}

async function dbRemove(videoId: string): Promise<void> {
  await fetch(`${API}/${videoId}`, { method: 'DELETE' }).catch(() => {});
}

async function dbReplaceAll(videos: YouTubeVideo[]): Promise<void> {
  await fetch(API, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
      videos.map((v, i) => ({
        videoId: v.id,
        title: v.title,
        thumbnail: v.thumbnail,
        duration: v.duration,
        position: i,
      }))
    ),
  }).catch(() => {});
}

// ── Provider ───────────────────────────────────────────────────────────────────

export const YouTubeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [playlist, setPlaylistState] = useState<YouTubeVideo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  // Load persisted playlist from DB on mount
  useEffect(() => {
    fetch(API)
      .then(r => r.json())
      .then((items: Array<{ videoId: string; title: string; thumbnail: string; duration: string }>) => {
        if (!Array.isArray(items) || items.length === 0) return;
        const videos: YouTubeVideo[] = items.map(item => ({
          id: item.videoId,
          title: item.title,
          thumbnail: item.thumbnail,
          duration: item.duration,
        }));
        setPlaylistState(videos);
      })
      .catch(() => {});
  }, []);

  const showPlayer = useCallback((newVideoId: string) => {
    setVideoId(newVideoId);
    setIsPlayerVisible(true);
    setIsMinimized(false);

    setPlaylistState(prev => {
      const existing = prev.findIndex(v => v.id === newVideoId);
      if (existing !== -1) {
        setCurrentIndex(existing);
        return prev;
      }
      const newVideo: YouTubeVideo = {
        id: newVideoId,
        title: '',
        thumbnail: `https://img.youtube.com/vi/${newVideoId}/hqdefault.jpg`,
        duration: '',
      };
      dbAdd(newVideo);
      setCurrentIndex(prev.length);
      return [...prev, newVideo];
    });
  }, []);

  const hidePlayer = useCallback(() => {
    setIsPlayerVisible(false);
    setIsMinimized(false);
  }, []);

  const toggleMinimize = useCallback(() => setIsMinimized(p => !p), []);

  const setCurrentVideo = useCallback((newVideoId: string) => {
    setPlaylistState(prev => {
      const index = prev.findIndex(v => v.id === newVideoId);
      if (index !== -1) {
        setVideoId(newVideoId);
        setCurrentIndex(index);
      }
      return prev;
    });
  }, []);

  const nextVideo = useCallback(() => {
    setPlaylistState(prev => {
      setCurrentIndex(ci => {
        if (ci < prev.length - 1) {
          setVideoId(prev[ci + 1].id);
          return ci + 1;
        }
        return ci;
      });
      return prev;
    });
  }, []);

  const previousVideo = useCallback(() => {
    setPlaylistState(prev => {
      setCurrentIndex(ci => {
        if (ci > 0) {
          setVideoId(prev[ci - 1].id);
          return ci - 1;
        }
        return ci;
      });
      return prev;
    });
  }, []);

  const addToPlaylist = useCallback((video: YouTubeVideo) => {
    setPlaylistState(prev => {
      if (prev.some(v => v.id === video.id)) return prev;
      dbAdd(video);
      return [...prev, video];
    });
  }, []);

  const removeFromPlaylist = useCallback((removedId: string) => {
    dbRemove(removedId);
    setPlaylistState(prev => {
      const next = prev.filter(v => v.id !== removedId);
      setCurrentIndex(ci => {
        if (ci >= next.length) {
          const newIdx = Math.max(0, next.length - 1);
          if (next.length > 0) setVideoId(next[newIdx].id);
          else { setVideoId(null); setIsPlayerVisible(false); }
          return newIdx;
        }
        return ci;
      });
      return next;
    });
  }, []);

  // Replaces the entire playlist (e.g. after loading from a YouTube playlist URL)
  const setPlaylist = useCallback((newPlaylist: YouTubeVideo[]) => {
    dbReplaceAll(newPlaylist);
    setPlaylistState(newPlaylist);
    if (newPlaylist.length > 0) {
      setVideoId(newPlaylist[0].id);
      setCurrentIndex(0);
      setIsPlayerVisible(true);
    }
  }, []);

  // Updates metadata (title/thumbnail/duration) for one video after API fetch
  const updateVideoInPlaylist = useCallback((vid: string, partial: Partial<YouTubeVideo>) => {
    dbPatch(vid, partial);
    setPlaylistState(prev =>
      prev.map(v => (v.id === vid ? { ...v, ...partial } : v))
    );
  }, []);

  return (
    <YouTubeContext.Provider
      value={{
        videoId,
        isPlayerVisible,
        isMinimized,
        playlist,
        currentIndex,
        showPlayer,
        hidePlayer,
        toggleMinimize,
        setCurrentVideo,
        nextVideo,
        previousVideo,
        addToPlaylist,
        removeFromPlaylist,
        setPlaylist,
        updateVideoInPlaylist,
      }}
    >
      {children}
    </YouTubeContext.Provider>
  );
};

export const useYouTube = () => {
  const context = useContext(YouTubeContext);
  if (context === undefined) {
    throw new Error('useYouTube must be used within a YouTubeProvider');
  }
  return context;
};
