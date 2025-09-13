
import React, { useState, useEffect } from 'react';
import { RocketIcon } from './icons/Icons';

interface BoostersProps {
  userBalance: number;
  onBuyBooster: (boosterId: keyof typeof BOOSTERS_CONFIG) => void;
  activeBooster: string | null;
  boosterEndTime: number | null;
}

const BOOSTERS_CONFIG = {
  '2x': {
    name: '2x Earnings',
    description: 'Doubles your earnings for 30 seconds.',
    cost: 50,
  }
};

const BoosterCard: React.FC<{
    boosterId: keyof typeof BOOSTERS_CONFIG,
    userBalance: number,
    onBuyBooster: (boosterId: keyof typeof BOOSTERS_CONFIG) => void,
    isActive: boolean,
    timeLeft: number,
}> = ({ boosterId, userBalance, onBuyBooster, isActive, timeLeft }) => {
    const booster = BOOSTERS_CONFIG[boosterId];
    const canAfford = userBalance >= booster.cost;

    return (
        <div className={`
            bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700
            flex flex-col items-center space-y-3 transition-all duration-300
            ${isActive ? 'border-cyan-400 shadow-lg shadow-cyan-500/20' : ''}
        `}>
            <div className="flex items-center space-x-3">
                <RocketIcon className={`w-6 h-6 ${isActive ? 'text-cyan-400' : 'text-gray-400'}`} />
                <h3 className="text-lg font-bold text-white">{booster.name}</h3>
            </div>
            <p className="text-sm text-gray-400 text-center">{booster.description}</p>
            <div className="w-full pt-2">
                {isActive ? (
                    <div className="text-center bg-cyan-500/20 text-cyan-300 py-2 rounded-lg font-mono text-lg">
                        {timeLeft}s remaining
                    </div>
                ) : (
                    <button
                        onClick={() => onBuyBooster(boosterId)}
                        disabled={!canAfford}
                        className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold transition-all duration-300 ease-in-out hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-700"
                    >
                        Activate for {booster.cost} <span className="font-sans">Դ</span>
                    </button>
                )}
            </div>
        </div>
    );
}


const Boosters: React.FC<BoostersProps> = ({ userBalance, onBuyBooster, activeBooster, boosterEndTime }) => {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        if (!activeBooster || !boosterEndTime) {
            setTimeLeft(0);
            return;
        }

        const intervalId = setInterval(() => {
            const remaining = Math.max(0, Math.ceil((boosterEndTime - Date.now()) / 1000));
            setTimeLeft(remaining);
            if (remaining === 0) {
                clearInterval(intervalId);
            }
        }, 1000);

        // Set initial time immediately
        const initialRemaining = Math.max(0, Math.ceil((boosterEndTime - Date.now()) / 1000));
        setTimeLeft(initialRemaining);

        return () => clearInterval(intervalId);
    }, [activeBooster, boosterEndTime]);

    return (
        <div className="w-full max-w-sm space-y-4">
            <h2 className="text-xl font-semibold text-center text-gray-300">Boosters</h2>
            <div className="grid grid-cols-1 gap-4">
                {(Object.keys(BOOSTERS_CONFIG) as Array<keyof typeof BOOSTERS_CONFIG>).map((key) => (
                    <BoosterCard
                        key={key}
                        boosterId={key}
                        userBalance={userBalance}
                        onBuyBooster={onBuyBooster}
                        isActive={activeBooster === key && timeLeft > 0}
                        timeLeft={timeLeft}
                    />
                ))}
            </div>
        </div>
    );
};

export default Boosters;
