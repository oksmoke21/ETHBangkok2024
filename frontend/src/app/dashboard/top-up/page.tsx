'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  RefreshCw,
  QrCode,
  Copy,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'

interface Transaction {
  id: string
  type: 'top-up' | 'withdrawal' | 'purchase'
  amount: number
  status: 'completed' | 'pending' | 'failed'
  date: string
  method: string
}

interface ExchangeRate {
  currency: string
  rate: number
  change24h: number
}

export default function TopUp() {
  const [balance, setBalance] = useState(1234.56)
  const [amount, setAmount] = useState('')
  const [selectedMethod, setSelectedMethod] = useState('crypto')
  const [showQR, setShowQR] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState<'success' | 'error' | null>(null)
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'top-up',
      amount: 500,
      status: 'completed',
      date: '2024-03-15',
      method: 'Crypto Wallet'
    },
    {
      id: '2',
      type: 'purchase',
      amount: -200,
      status: 'completed',
      date: '2024-03-14',
      method: 'Platform'
    }
  ])

  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([
    { currency: 'USD', rate: 10.00, change24h: 2.5 },
    { currency: 'ETH', rate: 0.0083, change24h: -1.2 },
    { currency: 'BTC', rate: 0.00024, change24h: 1.8 }
  ])

  // Simulated WebSocket connection for real-time updates
  useEffect(() => {
    const ws = new WebSocket('wss://your-websocket-server')
    
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data)
      if (update.type === 'balance') {
        setBalance(update.balance)
      } else if (update.type === 'rates') {
        setExchangeRates(update.rates)
      }
    }

    return () => ws.close()
  }, [])

  const handleTopUp = async () => {
    setIsProcessing(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setTransactionStatus('success')
      setBalance(prev => prev + Number(amount))
      setRecentTransactions(prev => [{
        id: Date.now().toString(),
        type: 'top-up',
        amount: Number(amount),
        status: 'completed',
        date: new Date().toISOString().split('T')[0],
        method: selectedMethod
      }, ...prev])
    } catch (error) {
      setTransactionStatus('error')
    } finally {
      setIsProcessing(false)
      setTimeout(() => setTransactionStatus(null), 3000)
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 
                      bg-clip-text text-transparent">
          Top-up DRAU
        </h1>
        <p className="text-gray-400 mt-2">
          Manage your DRAU balance and transactions
        </p>
      </motion.div>

      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 rounded-lg border border-emerald-500/10 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Wallet className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-medium text-emerald-400">Current Balance</h2>
          </div>
          <p className="text-3xl font-bold text-white">{balance.toFixed(2)} DRAU</p>
          <p className="text-sm text-gray-400 mt-1">≈ ${(balance * 10).toFixed(2)} USD</p>
        </motion.div>

        {/* Recent Activity Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/50 rounded-lg border border-emerald-500/10 p-6"
        >
          <h2 className="text-lg font-medium text-emerald-400 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentTransactions.slice(0, 3).map(transaction => (
              <div key={transaction.id} className="flex justify-between text-sm">
                <span className="text-gray-400">{transaction.type}</span>
                <span className={transaction.amount > 0 ? 'text-green-400' : 'text-red-400'}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount} DRAU
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Exchange Rates Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/50 rounded-lg border border-emerald-500/10 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-emerald-400">Exchange Rates</h2>
            <RefreshCw className="w-4 h-4 text-gray-400" />
          </div>
          <div className="space-y-3">
            {exchangeRates.map(rate => (
              <div key={rate.currency} className="flex justify-between text-sm">
                <span className="text-gray-400">1 DRAU</span>
                <div className="flex items-center gap-2">
                  <span className="text-white">{rate.rate} {rate.currency}</span>
                  <span className={`text-xs ${
                    rate.change24h > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {rate.change24h > 0 ? '+' : ''}{rate.change24h}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top-Up Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-900/50 rounded-lg border border-emerald-500/10 p-6"
        >
          <h2 className="text-xl font-medium text-emerald-400 mb-6">Top Up Your Wallet</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Amount (DRAU)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-gray-800 border border-emerald-500/20 rounded-lg px-4 py-2
                         focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent"
                placeholder="Enter amount"
              />
              <p className="text-sm text-gray-400 mt-1">
                ≈ ${(Number(amount) * 10).toFixed(2)} USD
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Payment Method
              </label>
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="w-full bg-gray-800 border border-emerald-500/20 rounded-lg px-4 py-2
                         focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent"
              >
                <option value="crypto">Crypto Wallet</option>
                <option value="bank">Bank Transfer</option>
                <option value="card">Credit/Debit Card</option>
              </select>
            </div>

            {/* Promotional Banner */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
              <p className="text-sm text-emerald-400">
                🎉 Get 5% bonus on top-ups over 100 DRAU
              </p>
            </div>

            <button
              onClick={handleTopUp}
              disabled={isProcessing}
              className={`w-full py-2 rounded-lg transition-colors flex items-center justify-center gap-2
                       ${isProcessing 
                         ? 'bg-gray-700 text-gray-300' 
                         : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm Top-Up'
              )}
            </button>
          </div>
        </motion.div>

        {/* QR Code Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-900/50 rounded-lg border border-emerald-500/10 p-6"
        >
          <div className="flex flex-col items-center justify-center h-full">
            <div className="bg-white p-8 rounded-lg mb-4">
              {/* Replace with actual QR code component */}
              <div className="w-48 h-48 bg-gray-900"></div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Scan QR code to complete payment
            </p>
            <button
              onClick={() => {/* Implement copy functionality */}}
              className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy Address
            </button>
          </div>
        </motion.div>
      </div>

      {/* Transaction Status Notifications */}
      <AnimatePresence>
        {transactionStatus && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-8 right-8 p-4 rounded-lg flex items-center gap-3
                     ${transactionStatus === 'success' 
                       ? 'bg-green-500/10 border border-green-500/20' 
                       : 'bg-red-500/10 border border-red-500/20'}`}
          >
            {transactionStatus === 'success' ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-400" />
                <p className="text-green-400">Top-up successful!</p>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-400">Transaction failed. Please try again.</p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 