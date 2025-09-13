
import React from 'react';
import { SettingsIcon } from './icons/Icons';

interface HeaderProps {
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="w-full p-4 flex justify-between items-center">
      <div className="w-8"></div> {/* Spacer */}
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
        Ad Watcher Game
      </h1>
      <button
        onClick={onOpenSettings}
        aria-label="Open settings"
        className="text-gray-400 hover:text-white transition-colors"
      >
        <SettingsIcon className="w-6 h-6" />
      </button>
    </header>
  );
};

export default Header;
