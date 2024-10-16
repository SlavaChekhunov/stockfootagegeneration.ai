'use client'

import React, { createContext, useState, useContext, useCallback } from 'react';

interface TokenContextType {
  tokens: number;
  refreshTokens: () => Promise<number>;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

interface TokenProviderProps {
  children: React.ReactNode;
  initialTokens: number;
}

export const TokenProvider: React.FC<TokenProviderProps> = ({ children, initialTokens }) => {
  const [tokens, setTokens] = useState(initialTokens);

  const refreshTokens = useCallback(async (): Promise<number> => {
    console.log('refreshTokens started. Current tokens:', tokens);
    try {
      // Add a small delay to allow for potential database lag
      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await fetch('/api/get-users-tokens');
      if (response.ok) {
        const data = await response.json();
        console.log('New token count received:', data.tokens);
        setTokens(data.tokens);
        return data.tokens;
      } else {
        console.error('Failed to refresh tokens. Status:', response.status);
        return tokens;
      }
    } catch (error) {
      console.error('Error in refreshTokens:', error);
      return tokens;
    }
  }, [tokens]);

  return (
    <TokenContext.Provider value={{ tokens, refreshTokens }}>
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