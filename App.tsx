import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import BalanceDisplay from './components/BalanceDisplay';
import AdPlayer from './components/AdPlayer';
import Boosters from './components/Boosters';

const BOOSTERS_CONFIG = {
  '2x': {
    cost: 50,
    duration: 30000, // 30 seconds
    multiplier: 2,
  }
};

const App: React.FC = () => {
  const [userBalance, setUserBalance] = useState<number>(0);
  const [ownerBalance, setOwnerBalance] = useState<number>(0);
  const [showReward, setShowReward] = useState<boolean>(false);
  const [rewardAmount, setRewardAmount] = useState<number>(0);

  const [activeBooster, setActiveBooster] = useState<string | null>(null);
  const [boosterEndTime, setBoosterEndTime] = useState<number | null>(null);

  // Effect to clear booster when time runs out
  useEffect(() => {
    if (activeBooster && boosterEndTime) {
      const remainingTime = boosterEndTime - Date.now();
      if (remainingTime <= 0) {
        setActiveBooster(null);
        setBoosterEndTime(null);
        return;
      }
      const timer = setTimeout(() => {
        setActiveBooster(null);
        setBoosterEndTime(null);
      }, remainingTime);
      return () => clearTimeout(timer);
    }
  }, [activeBooster, boosterEndTime]);

  const handleAdWatched = useCallback(() => {
    const isBoostActive = activeBooster && boosterEndTime && Date.now() < boosterEndTime;
    const booster = isBoostActive ? BOOSTERS_CONFIG[activeBooster as keyof typeof BOOSTERS_CONFIG] : null;
    const multiplier = booster ? booster.multiplier : 1;

    const baseUserShare = 4;
    const userShare = baseUserShare * multiplier;
    const totalEarning = 10;
    const ownerShare = totalEarning - baseUserShare;

    setUserBalance(prev => prev + userShare);
    setOwnerBalance(prev => prev + ownerShare);

    setRewardAmount(userShare);
    setShowReward(true);
    setTimeout(() => setShowReward(false), 1500);
  }, [activeBooster, boosterEndTime]);
  
  const handleBuyBooster = useCallback((boosterId: keyof typeof BOOSTERS_CONFIG) => {
    const booster = BOOSTERS_CONFIG[boosterId];
    if (userBalance >= booster.cost) {
      setUserBalance(prev => prev - booster.cost);
      setActiveBooster(boosterId);
      // If a booster is already active, this will just reset the timer
      setBoosterEndTime(Date.now() + booster.duration);
    }
  }, [userBalance]);


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-between p-4 font-sans max-w-md mx-auto relative overflow-hidden">
      <Header />
      <main className="w-full flex-grow flex flex-col items-center justify-center space-y-8 px-4">
        <BalanceDisplay userBalance={userBalance} ownerBalance={ownerBalance} />
        <AdPlayer onAdWatched={handleAdWatched} />
        <Boosters 
          userBalance={userBalance}
          onBuyBooster={handleBuyBooster}
          activeBooster={activeBooster}
          boosterEndTime={boosterEndTime}
        />
      </main>
      <footer className="w-full text-center p-4 text-xs text-gray-500">
        <p>&copy; 2024 Ad Watcher Game. All rights reserved.</p>
      </footer>
      {showReward && (
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-bold opacity-0 animate-reward ${rewardAmount > 4 ? 'text-yellow-400' : 'text-green-400'}`} style={{ animation: 'reward-float 1.5s ease-out' }}>
          +{rewardAmount} Դ
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