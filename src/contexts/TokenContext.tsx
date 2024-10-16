'use client'

import React, { createContext, useState, useContext, useCallback } from 'react';

interface TokenContextType {
  tokens: number;
  updateTokens: (newTokens: number) => void;
  refreshTokens: () => Promise<void>;
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

  const refreshTokens = useCallback(async () => {
    try {
      const response = await fetch('/api/get-users-tokens');
      if (response.ok) {
        const data = await response.json();
        setTokens(data.tokens);
      }
    } catch (error) {
      console.error('Failed to refresh tokens:', error);
    }
  }, []);

  return (
    <TokenContext.Provider value={{ tokens, updateTokens, refreshTokens }}>
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