
import React, { useState, useEffect, useCallback } from 'react';
import { getFunFact } from '../services/geminiService';
import { PlayIcon, InfoIcon, LoadingIcon } from './icons/Icons';

interface AdPlayerProps {
  onAdWatched: () => void;
}

const AD_DURATION_MS = 3000;
const PROGRESS_INTERVAL_MS = 50;

const AdPlayer: React.FC<AdPlayerProps> = ({ onAdWatched }) => {
  const [isWatching, setIsWatching] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [funFact, setFunFact] = useState<string | null>(null);
  const [isFactLoading, setIsFactLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!isWatching) return;

    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (PROGRESS_INTERVAL_MS / AD_DURATION_MS) * 100;
        if (newProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return newProgress;
      });
    }, PROGRESS_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [isWatching]);

  const fetchFact = useCallback(async () => {
    setIsFactLoading(true);
    setFunFact(null);
    try {
      const fact = await getFunFact();
      setFunFact(fact);
    } catch (error) {
      console.error("Failed to fetch fun fact:", error);
      setFunFact("An interesting fact is loading... or maybe not. Try again!");
    } finally {
      setIsFactLoading(false);
    }
  }, []);

  useEffect(() => {
    if (progress === 100) {
      onAdWatched();
      fetchFact();
      setTimeout(() => {
        setIsWatching(false);
        setProgress(0);
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, onAdWatched, fetchFact]);

  const handleWatchAd = () => {
    if (isWatching) return;
    setIsWatching(true);
  };

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      <div className="relative w-64 h-64">
        <button
          onClick={handleWatchAd}
          disabled={isWatching}
          className="w-full h-full rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-cyan-500/30 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isWatching ? (
            <div className="text-center">
              <p className="text-xl">Watching Ad...</p>
              <p className="text-sm font-normal">{Math.round(progress)}%</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
                <PlayIcon className="w-16 h-16" />
                <span>Watch Ad</span>
            </div>
          )}
        </button>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                    className="text-gray-700"
                    strokeWidth="5"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                />
                <circle
                    className="text-cyan-400 transition-all duration-300"
                    strokeWidth="5"
                    strokeDasharray="283"
                    strokeDashoffset={283 - (progress / 100) * 283}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                    transform="rotate(-90 50 50)"
                />
            </svg>
        </div>
      </div>

      <div className="w-full max-w-sm h-24 bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex items-center justify-center text-center">
        {isFactLoading ? (
            <LoadingIcon className="w-8 h-8 animate-spin text-cyan-400" />
        ) : funFact ? (
          <div className="flex items-start space-x-3">
            <InfoIcon className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
            <p className="text-sm text-gray-300 italic">{funFact}</p>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">A fun fact will appear here after you watch an ad!</p>
        )}
      </div>
    </div>
  );
};

export default AdPlayer;
