'use client'

import { useTokens } from '@/contexts/TokenContext';
import { useEffect, useState } from 'react';

const TokenDisplayNavBar = () => {
  const { tokens } = useTokens();
  const [displayTokens, setDisplayTokens] = useState(tokens);

  useEffect(() => {
    setDisplayTokens(tokens);
    console.log('TokenDisplayNavBar updating. New tokens:', tokens);
  }, [tokens]);

  return (
    <div className="bg-gray-700 rounded-full px-3 py-1 text-sm">
      {displayTokens} tokens
    </div>
  );
};

export default TokenDisplayNavBar;