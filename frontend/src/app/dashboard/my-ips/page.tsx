'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Download, Edit, Coins } from 'lucide-react'
import Link from 'next/link'
import { useWeb3Auth } from '@/contexts/Web3AuthContext'

interface IP {
  id: string
  ipNumber: string
  name: string
  valuation: string
  eligibleLoanAmount: string
  rating: number
  status: 'Pending' | 'Approved' | 'Rejected'
}

export default function MyIPs() {
  const [ips, setIps] = useState<IP[]>([])
  const { isLawyer } = useWeb3Auth()

  useEffect(() => {
    // Load IPs from localStorage or use dummy data if empty
    const savedIPs = JSON.parse(localStorage.getItem('myIPs') || '[]')
    if (savedIPs.length === 0) {
      // Add dummy IP if no IPs exist
      const dummyIP = {
        id: 'IP2024001',
        ipNumber: 'IP2024001',
        name: 'AI Analytics Patent',
        valuation: '$75,000',
        eligibleLoanAmount: '$50,000',
        rating: 4,
        status: 'Approved' as const
      }
      localStorage.setItem('myIPs', JSON.stringify([dummyIP]))
      setIps([dummyIP])
    } else {
      setIps(savedIPs)
    }
  }, [])

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 
                        bg-clip-text text-transparent">
            My IPs
          </h1>
          <p className="text-gray-400 mt-2">
            Manage and monitor your intellectual property portfolio
          </p>
        </motion.div>

        <Link href="/dashboard/create-ip">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600
                     text-white rounded-lg transition-colors"
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
              {ips.map((ip) => (
                <tr key={ip.id} className="border-b border-emerald-500/10">
                  <td className="px-6 py-4 text-sm text-gray-300">{ip.ipNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{ip.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{ip.valuation}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{ip.eligibleLoanAmount}</td>
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
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      ip.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' :
                      ip.status === 'Rejected' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {ip.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 hover:bg-emerald-500/10 rounded-lg transition-colors
                                 text-emerald-400"
                        title="Lend Against IP"
                      >
                        <Coins className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 hover:bg-emerald-500/10 rounded-lg transition-colors
                                 text-emerald-400"
                        title="Download Report"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 hover:bg-emerald-500/10 rounded-lg transition-colors
                                 text-emerald-400"
                        title="Edit Details"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
} 