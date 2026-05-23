import * as React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background-dark py-4 mt-auto">
      <div className="container mx-auto px-4 text-center text-text-secondary">
        <p>Desarrollado con ❤️</p>
        <p className="text-sm mt-1">© {new Date().getFullYear()} Pomodoro Timer</p>
      </div>
    </footer>
  );
};

export default Footer; 