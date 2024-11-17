'use client';

import { ReactNode } from 'react';
import { Web3AuthProvider } from '@/contexts/Web3AuthContext';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Web3AuthProvider>
      <Toaster position="top-right" />
      {children}
    </Web3AuthProvider>
  );
} 