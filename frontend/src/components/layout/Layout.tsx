import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { YouTubeProvider } from '../../contexts/YouTubeContext';
import { TimerProgressProvider } from '../../contexts/TimerProgressContext';
import { ThemeProvider } from '../../contexts/ThemeContext';
import YouTubePlayer from '../youtube/YouTubePlayer';
import Header from './Header';
import Footer from './Footer';
import AnimatedFlowerBackground from './AnimatedFlowerBackground';

const Layout: React.FC = () => {
  return (
    <ThemeProvider>
      <TimerProgressProvider>
        <YouTubeProvider>
          <AnimatedFlowerBackground />
          <div className="relative min-h-screen flex flex-col" style={{ zIndex: 1 }}>
            <Header />
            <main className="flex-grow">
              <Outlet />
            </main>
            <Footer />
          </div>
          <YouTubePlayer />
        </YouTubeProvider>
      </TimerProgressProvider>
    </ThemeProvider>
  );
};

export default Layout;
