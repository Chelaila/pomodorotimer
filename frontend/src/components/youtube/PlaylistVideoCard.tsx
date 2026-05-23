import * as React from 'react';
import { YouTubeVideo } from '../../interfaces/youtube/YouTube.interface';

interface PlaylistVideoCardProps {
  video: YouTubeVideo;
  isActive: boolean;
  onClick: () => void;
}

const PlaylistVideoCard: React.FC<PlaylistVideoCardProps> = ({ video, isActive, onClick }) => {
  return (
    <div
      className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${
        isActive ? 'bg-primary-main' : 'hover:bg-secondary-main'
      }`}
      onClick={onClick}
    >
      <img
        src={video.thumbnail}
        alt={video.title}
        className="w-16 h-9 object-cover rounded"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text-light truncate">{video.title}</p>
        <p className="text-xs text-text-secondary">{video.duration}</p>
      </div>
    </div>
  );
};

export default PlaylistVideoCard; 