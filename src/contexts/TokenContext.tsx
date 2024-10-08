'use client'

import React, { createContext, useState, useContext } from 'react';

interface TokenContextType {
  tokens: number;
  updateTokens: (newTokens: number) => void;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

interface TokenProviderProps {
  children: React.ReactNode;
  initialTokens: number;
}

export const TokenProvider: React.FC<TokenProviderProps> = ({ children, initialTokens }) => {
  const [tokens, setTokens] = useState(initialTokens);

  const updateTokens = (newTokens: number) => {
    setTokens(newTokens);
  };

  return (
    <TokenContext.Provider value={{ tokens, updateTokens }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useTokens = () => {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error('useTokens must be used within a TokenProvider');
  }
  return context;
};