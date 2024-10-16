'use client'

import { TokenProvider, useTokens } from '@/contexts/TokenContext';

interface TokenDisplayProps {
  initialPlan: string;
}

const TokenDisplay: React.FC<TokenDisplayProps> = ({ initialPlan }) => {
  const { tokens } = useTokens();

  return (
    <div className="flex items-center space-x-4">
      <div className="bg-gray-700 rounded-full px-3 py-1 text-sm">
        {tokens} tokens
      </div>
      <div className="text-sm font-medium">{initialPlan}</div>
    </div>
  );
};

interface TokenDisplayClientProps {
  initialTokens: number;
  initialPlan: string;
}

const TokenDisplayClient: React.FC<TokenDisplayClientProps> = ({ initialTokens, initialPlan }) => {
  return (
    <TokenProvider initialTokens={initialTokens}>
      <TokenDisplay initialPlan={initialPlan} />
    </TokenProvider>
  );
};

export default TokenDisplayClient;