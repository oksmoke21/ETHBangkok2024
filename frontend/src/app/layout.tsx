import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3AuthProvider } from '@/contexts/Web3AuthContext'

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "IPSphere - IP Management",
  description: "Your gateway to Intellectual Property",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} h-full bg-gray-950 antialiased`}>
        <Web3AuthProvider>
          <div className="relative min-h-screen">
            {/* Background gradient effects */}
            <div className="fixed inset-0 bg-gradient-radial from-emerald-500/5 to-transparent" />
            <div className="fixed inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-gray-950/20" />
            
            {/* Content */}
            <div className="relative">
              {children}
            </div>
          </div>
        </Web3AuthProvider>
      </body>
    </html>
  );
} 