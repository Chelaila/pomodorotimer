import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import YouTubePanel from '../youtube/YouTubePanel';

const Header: React.FC = () => {
  const { isDark, toggleDark } = useTheme();
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <>
      <header className="bg-[var(--bg-secondary)] shadow-md relative z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-[var(--text-primary)] hover:text-primary-light font-medium">
                Home
              </Link>
              <Link to="/config" className="text-[var(--text-primary)] hover:text-primary-light font-medium">
                Config
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              {/* Music queue button */}
              <button
                onClick={() => setIsPanelOpen(true)}
                title="Cola de música"
                className="text-[var(--text-primary)] hover:text-primary-light p-1 rounded"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                </svg>
              </button>

              {/* Dark mode toggle */}
              <button
                onClick={toggleDark}
                title={isDark ? 'Modo claro' : 'Modo oscuro'}
                className="text-[var(--text-primary)] hover:text-primary-light p-1 rounded"
              >
                {isDark ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <YouTubePanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
    </>
  );
};

export default Header;
