
import React from 'react';
import { WalletIcon, OwnerIcon } from './icons/Icons';

interface BalanceDisplayProps {
  userBalance: number;
  ownerBalance: number;
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ userBalance, ownerBalance }) => {
  return (
    <div className="w-full grid grid-cols-2 gap-4 text-white">
      <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700 flex flex-col items-center space-y-2">
        <div className="flex items-center space-x-2">
          <WalletIcon className="w-6 h-6 text-cyan-400" />
          <h2 className="text-sm font-semibold text-gray-300">Your Balance</h2>
        </div>
        <p className="text-3xl font-bold tracking-tighter">{userBalance.toLocaleString()} <span className="text-cyan-400">Դ</span></p>
      </div>
      <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700 flex flex-col items-center space-y-2">
        <div className="flex items-center space-x-2">
          <OwnerIcon className="w-6 h-6 text-blue-500" />
          <h2 className="text-sm font-semibold text-gray-300">Owner Profit</h2>
        </div>
        <p className="text-3xl font-bold tracking-tighter">{ownerBalance.toLocaleString()} <span className="text-blue-500">Դ</span></p>
      </div>
    </div>
  );
};

export default BalanceDisplay;
