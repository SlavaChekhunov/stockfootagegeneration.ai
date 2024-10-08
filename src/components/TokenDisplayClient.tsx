'use client'

import { useTokens } from '@/contexts/TokenContext';

interface TokenDisplayClientProps {
  initialPlan: string;
}

const TokenDisplayClient: React.FC<TokenDisplayClientProps> = ({ initialPlan }) => {
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

export default TokenDisplayClient;