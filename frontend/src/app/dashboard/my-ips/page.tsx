'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Edit, Coins } from 'lucide-react';
import Link from 'next/link';
import { useWeb3Auth } from '@/contexts/Web3AuthContext';

interface IP {
  id: string;
  ipNumber: string;
  ipName: string;
  valuation: string;
  eligibleAmount: string;
  rating: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Valued' | 'Tokenized';
}

export default function MyIPs() {
  const [ips, setIps] = useState<IP[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLawyer } = useWeb3Auth();

  useEffect(() => {
    const fetchIps = async () => {
      try {
        const address = localStorage.getItem('address');
        if (!address) return;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/ipTokenization/getMyIPs?address=${address}`
        );
        const data = await response.json();
        setIps(data || []);
      } catch (error) {
        console.error('Error fetching IPs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIps();
  }, []);

  console.log("IPs: ")
  console.log(ips)

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            My IPs
          </h1>
          <p className="text-gray-400 mt-2">Manage and monitor your Intellectual Property portfolio</p>
        </motion.div>

        <Link href="/dashboard/create-ip">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Register IP
          </motion.button>
        </Link>
      </div>

      {/* IP Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/50 rounded-lg border border-emerald-500/10"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-emerald-500/10">
                <th className="px-6 py-4 text-left text-sm font-medium text-emerald-400">IP Number</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-emerald-400">Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-emerald-400">Valuation</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-emerald-400">Eligible Loan</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-emerald-400">Rating</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-emerald-400">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-emerald-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-8 py-4 text-center text-gray-300">
                    Loading...
                  </td>
                </tr>
              ) : ips.length > 0 ? (
                ips.map((ip) => (
                  <tr key={ip.id} className="border-b border-emerald-500/10">
                    <td className="px-6 py-4 text-sm text-gray-300">{ip.ipNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{ip.ipName}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{ip.valuation}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">${ip.eligibleAmount}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full ${
                              index < ip.rating ? 'bg-emerald-400' : 'bg-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          ip.status === 'Approved'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : ip.status === 'Rejected'
                            ? 'bg-red-500/20 text-red-400'
                            : ip.status === 'Valued'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {ip.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 hover:bg-emerald-500/10 rounded-lg transition-colors text-emerald-400"
                          title="Lend Against IP"
                        >
                          <Coins className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 hover:bg-emerald-500/10 rounded-lg transition-colors text-emerald-400"
                          title="Download Report"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 hover:bg-emerald-500/10 rounded-lg transition-colors text-emerald-400"
                          title="Edit Details"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-8 py-4 text-center text-gray-300">
                    No IPs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
