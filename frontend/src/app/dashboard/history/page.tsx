'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Download, 
  Search, 
  ChevronDown, 
  ChevronUp,
  FileText,
  Link as LinkIcon,
  User,
  Clock,
  Filter
} from 'lucide-react'

interface Transaction {
  id: string
  ipName: string
  date: string
  action: 'bought' | 'sold' | 'licensed'
  status: 'completed' | 'pending' | 'failed'
  amount: string
  contractId?: string
  blockchainHash?: string
  terms?: {
    duration: string
    exclusivity: boolean
    territory: string[]
  }
  lawyer?: {
    name: string
    email: string
    phone: string
  }
  timeToClose?: string
  interactions?: {
    date: string
    type: 'comment' | 'negotiation' | 'document'
    user: string
    content: string
  }[]
}

interface ExportTemplate {
  name: string
  columns: string[]
  format: 'CSV' | 'JSON' | 'PDF'
}

export default function History() {
  const [activeTab, setActiveTab] = useState<'transactions' | 'interactions'>('transactions')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null)
  const [selectedExportTemplate, setSelectedExportTemplate] = useState<string>('')
  const [interactionFilters, setInteractionFilters] = useState({
    participant: '',
    ipId: ''
  })

  // Mock data
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      ipName: 'FutureTech Trademark',
      date: '2024-03-15',
      action: 'bought',
      status: 'completed',
      amount: '$25,000',
      contractId: 'CTR-2024-001',
      blockchainHash: '0x1234...5678',
      terms: {
        duration: '5 years',
        exclusivity: true,
        territory: ['North America', 'Europe']
      },
      lawyer: {
        name: 'Jane Smith',
        email: 'jane@lawfirm.com',
        phone: '+1 234 567 8900'
      },
      timeToClose: '15 days',
      interactions: [
        {
          date: '2024-03-10',
          type: 'negotiation',
          user: 'John Doe',
          content: 'Initial price negotiation started'
        }
      ]
    }
  ]

  const exportTemplates: ExportTemplate[] = [
    {
      name: 'Legal Audit',
      columns: ['contractId', 'blockchainHash', 'terms', 'lawyer'],
      format: 'PDF'
    },
    {
      name: 'Financial Summary',
      columns: ['date', 'amount', 'status', 'timeToClose'],
      format: 'CSV'
    }
  ]

  // Performance metrics calculation
  const metrics = useMemo(() => {
    const completed = mockTransactions.filter(t => t.status === 'completed')
    return {
      averageTimeToClose: completed.reduce((acc, t) => 
        acc + (t.timeToClose ? parseInt(t.timeToClose) : 0), 0) / completed.length,
      totalTransactions: mockTransactions.length,
      successRate: (completed.length / mockTransactions.length) * 100
    }
  }, [mockTransactions])

  const handleExport = (format: 'CSV' | 'JSON' | 'PDF') => {
    const template = exportTemplates.find(t => t.name === selectedExportTemplate)
    console.log(`Exporting in ${format} format with template:`, template)
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
          History
        </h1>
        <p className="text-gray-400 mt-2">
          View your transaction history and platform interactions
        </p>
      </motion.div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900/50 rounded-lg p-4 border border-emerald-500/10">
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <Clock className="w-4 h-4" />
            <h3 className="font-medium">Average Time to Close</h3>
          </div>
          <p className="text-2xl font-semibold text-white">
            {metrics.averageTimeToClose.toFixed(1)} days
          </p>
        </div>
        {/* Add more metric cards */}
      </div>

      {/* Enhanced Filters and Export */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full bg-gray-900 border border-emerald-500/20 rounded-lg pl-10 pr-4 py-2
                       focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <select
            value={selectedExportTemplate}
            onChange={(e) => setSelectedExportTemplate(e.target.value)}
            className="bg-gray-900 border border-emerald-500/20 rounded-lg px-3 py-2
                     focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent transition-all"
          >
            <option value="">Select Export Template</option>
            {exportTemplates.map(template => (
              <option key={template.name} value={template.name}>
                {template.name}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            {['CSV', 'JSON', 'PDF'].map((format) => (
              <button
                key={format}
                onClick={() => handleExport(format as 'CSV' | 'JSON' | 'PDF')}
                className="px-3 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg
                         hover:bg-emerald-500/20 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {format}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions Table with Expandable Rows */}
      <div className="bg-gray-900/50 rounded-lg border border-emerald-500/10 overflow-hidden">
        <table className="w-full">
          {/* Table header remains the same */}
          <tbody>
            {mockTransactions.map((transaction) => (
              <>
                <tr 
                  key={transaction.id}
                  className="border-b border-emerald-500/10 hover:bg-emerald-500/5 transition-colors
                           cursor-pointer"
                  onClick={() => setExpandedTransaction(
                    expandedTransaction === transaction.id ? null : transaction.id
                  )}
                >
                  {/* Regular columns remain the same */}
                  <td className="px-6 py-4">
                    {expandedTransaction === transaction.id ? 
                      <ChevronUp className="w-4 h-4 text-emerald-400" /> : 
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    }
                  </td>
                </tr>
                
                {/* Expanded Details Panel */}
                {expandedTransaction === transaction.id && (
                  <tr>
                    <td colSpan={6}>
                      <div className="px-6 py-4 bg-gray-900/30">
                        <div className="grid grid-cols-2 gap-4">
                          {/* Contract Details */}
                          <div>
                            <h4 className="text-sm font-medium text-emerald-400 mb-2">
                              Contract Details
                            </h4>
                            <div className="space-y-2 text-sm text-gray-400">
                              <p>Contract ID: {transaction.contractId}</p>
                              <p>Blockchain Hash: {transaction.blockchainHash}</p>
                              <p>Duration: {transaction.terms?.duration}</p>
                              <p>Territory: {transaction.terms?.territory.join(', ')}</p>
                            </div>
                          </div>

                          {/* Lawyer Contact */}
                          <div>
                            <h4 className="text-sm font-medium text-emerald-400 mb-2">
                              Legal Representative
                            </h4>
                            <div className="space-y-2 text-sm text-gray-400">
                              <p>{transaction.lawyer?.name}</p>
                              <p>{transaction.lawyer?.email}</p>
                              <p>{transaction.lawyer?.phone}</p>
                            </div>
                          </div>
                        </div>

                        {/* Interactions Log */}
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-emerald-400 mb-2">
                            Interaction History
                          </h4>
                          <div className="space-y-2">
                            {transaction.interactions?.map((interaction, index) => (
                              <div 
                                key={index}
                                className="text-sm text-gray-400 flex items-start gap-2"
                              >
                                <span className="text-emerald-400">{interaction.date}</span>
                                <span>{interaction.user}:</span>
                                <span>{interaction.content}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

