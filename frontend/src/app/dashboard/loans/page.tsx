'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, 
  Clock, 
  AlertCircle,
  ChevronRight,
  Shield,
  Calendar,
  DollarSign,
  FileText,
  Plus,
  CheckCircle,
  XCircle,
  Hourglass,
  CreditCard, 
  Bitcoin, 
  Landmark,
  ArrowRight,
  Info,
  AlertTriangle,
  Copy
} from 'lucide-react'

interface Loan {
  id: string
  ipName: string
  borrowerName: string
  lenderName: string
  amount: number
  dueDate: string
  status: 'active' | 'pending' | 'completed'
  completionPercentage: number
  blockchainVerified: boolean
  contractTerms?: string
  repaymentSchedule?: {
    date: string
    amount: number
    status: 'paid' | 'pending' | 'overdue'
  }[]
}

interface PaymentMethod {
  id: string
  name: string
  icon: React.ReactNode
  description: string
}

interface LoanApplication {
  ipId: string
  ipName: string
  amount: number
  duration: number
  purpose: string
  collateralType: string
  borrowerName: string
  borrowerEmail: string
  companyRegistration: string
  expectedRevenue: string
  businessPlan: string
}

export default function Loans() {
  const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'completed'>('active')
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null)
  const [showLoanModal, setShowLoanModal] = useState(false)
  const [showLoanApplicationModal, setShowLoanApplicationModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('')
  const [loanApplication, setLoanApplication] = useState<LoanApplication>({
    ipId: '',
    ipName: '',
    amount: 0,
    duration: 12,
    purpose: '',
    collateralType: '',
    borrowerName: '',
    borrowerEmail: '',
    companyRegistration: '',
    expectedRevenue: '',
    businessPlan: ''
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [pendingApplications, setPendingApplications] = useState<Loan[]>([])

  // Mock data
  const loans: Loan[] = [
    {
      id: '1',
      ipName: 'AI Analytics Patent',
      borrowerName: 'Tech Innovations Inc.',
      lenderName: 'IP Finance Ltd.',
      amount: 50000,
      dueDate: '2024-06-15',
      status: 'active',
      completionPercentage: 65,
      blockchainVerified: true,
      repaymentSchedule: [
        { date: '2024-04-15', amount: 10000, status: 'paid' },
        { date: '2024-05-15', amount: 10000, status: 'pending' },
        { date: '2024-06-15', amount: 10000, status: 'pending' }
      ]
    }
    // Add more mock loans
  ]

  // Calculate summary stats
  const stats = {
    activeLoans: loans.filter(l => l.status === 'active').length,
    pendingApplications: loans.filter(l => l.status === 'pending').length,
    totalValue: loans.reduce((acc, loan) => acc + loan.amount, 0)
  }

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      icon: <Bitcoin className="w-6 h-6" />,
      description: 'Pay using Bitcoin, Ethereum, or other cryptocurrencies'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Secure payment using your credit or debit card'
    },
    {
      id: 'wire',
      name: 'Wire Transfer',
      icon: <Landmark className="w-6 h-6" />,
      description: 'Direct bank transfer (2-3 business days)'
    }
  ]

  const handleLoanApplication = async (formData: LoanApplication) => {
    setIsProcessing(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create new pending loan
      const newPendingLoan: Loan = {
        id: Date.now().toString(),
        ipName: formData.ipName,
        borrowerName: formData.borrowerName,
        lenderName: 'Pending Assignment',
        amount: formData.amount,
        dueDate: new Date(Date.now() + formData.duration * 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        completionPercentage: 0,
        blockchainVerified: false,
        purpose: formData.purpose,
        applicationDate: new Date().toISOString()
      }

      // Update pending applications
      setPendingApplications(prev => [...prev, newPendingLoan])
      setShowLoanApplicationModal(false)
      
      // Show success notification
      // You can add a toast notification here
    } catch (error) {
      // Show error notification
    } finally {
      setIsProcessing(false)
    }
  }

  const handleMakePayment = (loanId: string) => {
    setShowPaymentModal(true)
    setSelectedLoan(loanId)
  }

  const selectedLoanDetails = loans.find(loan => loan.id === selectedLoan)

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
          IP Loans
        </h1>
        <p className="text-gray-400 mt-2">
          Manage your IP-backed loans and applications
        </p>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 rounded-lg p-6 border border-emerald-500/10"
        >
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <TrendingUp className="w-5 h-5" />
            <h3 className="font-medium">Active Loans</h3>
          </div>
          <p className="text-2xl font-semibold text-white">{stats.activeLoans}</p>
          <p className="text-sm text-gray-400">Total value: ${stats.totalValue.toLocaleString()}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/50 rounded-lg p-6 border border-emerald-500/10"
        >
          <div className="flex items-center gap-2 text-amber-400 mb-2">
            <Clock className="w-5 h-5" />
            <h3 className="font-medium">Pending Applications</h3>
          </div>
          <p className="text-2xl font-semibold text-white">{stats.pendingApplications}</p>
        </motion.div>

        {/* New Loan CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-emerald-500/10 rounded-lg p-6 border border-emerald-500/20"
        >
          <h3 className="font-medium text-emerald-400 mb-4">Apply for a New Loan</h3>
          <button
            onClick={() => setShowLoanApplicationModal(true)}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg
                     transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Start Application
          </button>
        </motion.div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-4 mb-8 border-b border-emerald-500/10">
        {(['active', 'pending', 'completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors
                      ${activeTab === tab 
                        ? 'text-emerald-400 border-b-2 border-emerald-400' 
                        : 'text-gray-400 hover:text-emerald-400'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Loan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loans
          .filter(loan => loan.status === activeTab)
          .map((loan) => (
            <motion.div
              key={loan.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900/50 rounded-lg border border-emerald-500/10 p-6
                       hover:border-emerald-500/30 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium text-lg text-emerald-400">{loan.ipName}</h3>
                  <p className="text-sm text-gray-400">
                    Borrower: {loan.borrowerName}
                  </p>
                </div>
                {loan.blockchainVerified && (
                  <Shield className="w-5 h-5 text-emerald-400" />
                )}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Loan Amount</span>
                  <span className="text-white">${loan.amount.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Due Date</span>
                  <span className="text-white">{new Date(loan.dueDate).toLocaleDateString()}</span>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Repayment Progress</span>
                    <span className="text-emerald-400">{loan.completionPercentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${loan.completionPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setSelectedLoan(loan.id)}
                    className="flex-1 bg-emerald-500/10 text-emerald-400 py-2 rounded-lg
                             hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    View Details
                  </button>
                  {loan.status === 'active' && (
                    <button
                      onClick={() => handleMakePayment(loan.id)}
                      className="flex-1 bg-emerald-500 text-white py-2 rounded-lg
                               hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <DollarSign className="w-4 h-4" />
                      Make Payment
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
      </div>

      {/* Loan Details Modal */}
      <AnimatePresence>
        {selectedLoan && selectedLoanDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-gray-900 rounded-lg p-6 max-w-lg w-full"
            >
              {/* Modal content */}
              <button
                onClick={() => setSelectedLoan(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loan Application Modal */}
      <AnimatePresence>
        {showLoanApplicationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-gray-900 rounded-lg p-6 max-w-lg w-full relative"
            >
              <h2 className="text-2xl font-semibold text-emerald-400 mb-6">
                Apply for IP Loan
              </h2>

              <form onSubmit={(e) => {
                e.preventDefault()
                handleLoanApplication(loanApplication)
              }} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Loan Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      className="w-full bg-gray-800 border border-emerald-500/20 rounded-lg px-8 py-2
                               focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent"
                      placeholder="Enter amount"
                      value={loanApplication.amount}
                      onChange={(e) => setLoanApplication({
                        ...loanApplication,
                        amount: Number(e.target.value)
                      })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Loan Duration (months)
                  </label>
                  <select
                    className="w-full bg-gray-800 border border-emerald-500/20 rounded-lg px-3 py-2
                             focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent"
                    value={loanApplication.duration}
                    onChange={(e) => setLoanApplication({
                      ...loanApplication,
                      duration: Number(e.target.value)
                    })}
                  >
                    {[6, 12, 24, 36].map((months) => (
                      <option key={months} value={months}>{months} months</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Purpose of Loan
                  </label>
                  <textarea
                    className="w-full bg-gray-800 border border-emerald-500/20 rounded-lg px-3 py-2
                             focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent"
                    rows={3}
                    placeholder="Describe the purpose of your loan..."
                    value={loanApplication.purpose}
                    onChange={(e) => setLoanApplication({
                      ...loanApplication,
                      purpose: e.target.value
                    })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    IP Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-gray-800 border border-emerald-500/20 rounded-lg px-3 py-2"
                    value={loanApplication.ipName}
                    onChange={(e) => setLoanApplication({
                      ...loanApplication,
                      ipName: e.target.value
                    })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Borrower Details
                  </label>
                  <div className="space-y-4">
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      className="w-full bg-gray-800 border border-emerald-500/20 rounded-lg px-3 py-2"
                      value={loanApplication.borrowerName}
                      onChange={(e) => setLoanApplication({
                        ...loanApplication,
                        borrowerName: e.target.value
                      })}
                    />
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      className="w-full bg-gray-800 border border-emerald-500/20 rounded-lg px-3 py-2"
                      value={loanApplication.borrowerEmail}
                      onChange={(e) => setLoanApplication({
                        ...loanApplication,
                        borrowerEmail: e.target.value
                      })}
                    />
                    <input
                      type="text"
                      required
                      placeholder="Company Registration Number"
                      className="w-full bg-gray-800 border border-emerald-500/20 rounded-lg px-3 py-2"
                      value={loanApplication.companyRegistration}
                      onChange={(e) => setLoanApplication({
                        ...loanApplication,
                        companyRegistration: e.target.value
                      })}
                    />
                  </div>
                </div>

                {/* Business Details */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Business Information
                  </label>
                  <div className="space-y-4">
                    <input
                      type="text"
                      required
                      placeholder="Expected Annual Revenue"
                      className="w-full bg-gray-800 border border-emerald-500/20 rounded-lg px-3 py-2"
                      value={loanApplication.expectedRevenue}
                      onChange={(e) => setLoanApplication({
                        ...loanApplication,
                        expectedRevenue: e.target.value
                      })}
                    />
                    <textarea
                      required
                      placeholder="Business Plan Summary"
                      rows={4}
                      className="w-full bg-gray-800 border border-emerald-500/20 rounded-lg px-3 py-2"
                      value={loanApplication.businessPlan}
                      onChange={(e) => setLoanApplication({
                        ...loanApplication,
                        businessPlan: e.target.value
                      })}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowLoanApplicationModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg
                             hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 bg-emerald-500 text-white px-4 py-2 rounded-lg
                             hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>Submit Application</>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-gray-900 rounded-lg p-6 max-w-lg w-full relative"
            >
              <h2 className="text-2xl font-semibold text-emerald-400 mb-6">
                Make Payment
              </h2>

              {!selectedPaymentMethod ? (
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                      className="w-full p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors
                               border border-emerald-500/20 flex items-center gap-4"
                    >
                      <div className="p-2 bg-emerald-500/10 rounded-lg">
                        {method.icon}
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium text-emerald-400">{method.name}</h3>
                        <p className="text-sm text-gray-400">{method.description}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Crypto Payment Form */}
                  {selectedPaymentMethod === 'crypto' && (
                    <div className="space-y-4">
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <p className="text-sm text-gray-300 mb-2">Send payment to:</p>
                        <div className="flex items-center gap-2">
                          <code className="bg-gray-900 px-3 py-1 rounded text-emerald-400">
                            0x1234...5678
                          </code>
                          <button className="text-gray-400 hover:text-emerald-400">
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-amber-400">
                        <AlertTriangle className="w-4 h-4 mt-0.5" />
                        <p>Please only send ETH or USDT to this address</p>
                      </div>
                    </div>
                  )}

                  {/* Credit Card Form */}
                  {selectedPaymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          className="w-full bg-gray-800 border border-emerald-500/20 rounded-lg px-3 py-2"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            className="w-full bg-gray-800 border border-emerald-500/20 rounded-lg px-3 py-2"
                            placeholder="MM/YY"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            CVC
                          </label>
                          <input
                            type="text"
                            className="w-full bg-gray-800 border border-emerald-500/20 rounded-lg px-3 py-2"
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Wire Transfer Form */}
                  {selectedPaymentMethod === 'wire' && (
                    <div className="space-y-4">
                      <div className="bg-gray-800 p-4 rounded-lg space-y-3">
                        <div>
                          <p className="text-sm text-gray-400">Bank Name</p>
                          <p className="text-emerald-400">Example Bank</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Account Number</p>
                          <p className="text-emerald-400">1234567890</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Routing Number</p>
                          <p className="text-emerald-400">987654321</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-gray-400">
                        <Info className="w-4 h-4 mt-0.5" />
                        <p>Please include your Loan ID in the transfer reference</p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      onClick={() => setSelectedPaymentMethod('')}
                      className="px-4 py-2 text-gray-400 hover:text-gray-300"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        // Handle payment submission
                        setShowPaymentModal(false)
                      }}
                      className="flex-1 bg-emerald-500 text-white px-4 py-2 rounded-lg
                               hover:bg-emerald-600 transition-colors"
                    >
                      Confirm Payment
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 