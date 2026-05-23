export interface YouTubeContextType {
  videoId: string | null;
  setVideoId: (id: string | null) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
}

export interface YouTubePlayerState {
  videoId: string | null;
  isPlayerVisible: boolean;
  isMinimized: boolean;
  isDragging: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  playlist: YouTubeVideo[];
  currentIndex: number;
}

export interface YouTubePlayerProps {
  onVideoEnd?: () => void;
  onPlaylistEnd?: () => void;
  initialPlaylist?: YouTubeVideo[];
} 