'use client'

import { useTokens } from '@/contexts/TokenContext';

const TokenDisplayNavBar = () => {
  const { tokens } = useTokens();

  return (
    <div className="bg-gray-700 rounded-full px-3 py-1 text-sm">
      {tokens} tokens
    </div>
  );
};

export default TokenDisplayNavBar;