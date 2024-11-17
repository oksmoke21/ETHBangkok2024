'use client'

import { useState, useEffect } from 'react';
import { PushAPI, CONSTANTS } from '@pushprotocol/restapi';
import { toast } from 'react-hot-toast';
import { useWeb3Auth } from '@/contexts/Web3AuthContext';
import { Lawyer } from '@/types/lawyer';

const mockLawyers: Lawyer[] = [
  {
    id: 1,
    name: "John Doe",
    specialization: "IP Protection",
    rating: 4.8,
    walletAddress: "0x123456789abcdef",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
  },
  {
    id: 2,
    name: "Jane Smith",
    specialization: "Dispute Resolution",
    rating: 4.9,
    walletAddress: "0xabcdef123456789",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane"
  },
];

export default function IPServicesPage() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const { address, isConnected, connect, getSigner } = useWeb3Auth();

  useEffect(() => {
    setLawyers(mockLawyers);
  }, []);

  const startChatWithLawyer = async (lawyer: Lawyer) => {
    try {
      if (!isConnected) {
        await connect();
        return;
      }

      if (!address) {
        toast.error('Please connect your wallet first');
        return;
      }

      const signer = await getSigner();

      // Initialize Push Protocol user
      const pushUser = await PushAPI.initialize(signer as any, {
        env: CONSTANTS.ENV.STAGING,
        account: address
      });

      // Send initial message to start the chat
      await pushUser.chat.send(lawyer.walletAddress, {
        content: `Hello, I'd like to consult about IP services.`,
        type: 'Text'
      });

      toast.success(`Started chat with ${lawyer.name}`);
    } catch (error) {
      console.error('Error starting chat:', error);
      toast.error('Failed to start chat');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">IP Legal Consultants</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lawyers.map((lawyer) => (
          <div
            key={lawyer.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={lawyer.imageUrl}
                alt={lawyer.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="text-xl font-semibold">{lawyer.name}</h3>
                <p className="text-gray-600">{lawyer.specialization}</p>
              </div>
            </div>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                <span className="text-yellow-400">★</span>
                <span className="ml-1">{lawyer.rating.toFixed(1)}</span>
              </div>
            </div>

            <button
              onClick={() => startChatWithLawyer(lawyer)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              aria-label={`Message ${lawyer.name}`}
            >
              {isConnected ? 'Message' : 'Connect Wallet to Message'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 