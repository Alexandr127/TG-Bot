
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import BalanceDisplay from './components/BalanceDisplay';
import AdPlayer from './components/AdPlayer';

const App: React.FC = () => {
  const [userBalance, setUserBalance] = useState<number>(0);
  const [ownerBalance, setOwnerBalance] = useState<number>(0);
  const [showReward, setShowReward] = useState<boolean>(false);

  const handleAdWatched = useCallback(() => {
    const totalEarning = 10;
    const userShare = 4;
    const ownerShare = totalEarning - userShare;

    setUserBalance(prev => prev + userShare);
    setOwnerBalance(prev => prev + ownerShare);

    setShowReward(true);
    setTimeout(() => setShowReward(false), 1500); // Animation duration
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-between p-4 font-sans max-w-md mx-auto relative overflow-hidden">
      <Header />
      <main className="w-full flex-grow flex flex-col items-center justify-center space-y-8 px-4">
        <BalanceDisplay userBalance={userBalance} ownerBalance={ownerBalance} />
        <AdPlayer onAdWatched={handleAdWatched} />
      </main>
      <footer className="w-full text-center p-4 text-xs text-gray-500">
        <p>&copy; 2024 Ad Watcher Game. All rights reserved.</p>
      </footer>
      {showReward && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-bold text-green-400 opacity-0 animate-reward" style={{ animation: 'reward-float 1.5s ease-out' }}>
          +4 Դ
        </div>
      )}
      <style>
        {`
          @keyframes reward-float {
            0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
            100% { transform: translate(-50%, -150%) scale(1.5); opacity: 0; }
          }
          .animate-reward {
            animation-name: reward-float;
            animation-duration: 1.5s;
            animation-timing-function: ease-out;
            animation-fill-mode: forwards;
          }
        `}
      </style>
    </div>
  );
};

export default App;
