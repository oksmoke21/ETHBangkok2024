'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Info } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function ListIP() {
  const router = useRouter()
  const { isLawyer } = useAuth()
  const [formData, setFormData] = useState({
    ipNumber: '',
    companyRegNumber: '',
    ipName: '',
    companyName: '',
    ipDescription: '',
    region: '',
    assetType: '',
    registrationStatus: '',
    filingDate: '',
    issuanceDate: '',
    revenue: '',
    revenueStreams: '',
    yearsOperation: '',
    profitMargin: '',
    competitors: ''
  })

  const formId = '256c1654-330e-4d10-9c22-a00e888a27eb'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Get existing IPs from localStorage or initialize empty array
    const existingIPs = JSON.parse(localStorage.getItem('myIPs') || '[]')
    
    // Create new IP object
    const newIP = {
      id: `IP${Date.now()}`,
      ipNumber: formData.ipNumber || `IP${Date.now()}`,
      name: formData.ipName,
      valuation: '$0', // Initial valuation
      eligibleLoanAmount: '$0', // Initial loan amount
      rating: 0,
      status: 'Pending'
    }
    
    // Add new IP to array
    const updatedIPs = [...existingIPs, newIP]
    
    // Save to localStorage
    localStorage.setItem('myIPs', JSON.stringify(updatedIPs))
    
    // Redirect to My IPs page
    router.push('/dashboard/my-ips')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 
                        bg-clip-text text-transparent mb-4">
            Valuate and Onboard your IP
          </h1>
          <p className="text-gray-400">
            To take loans against your IP assets, the IP first passes through a valuation round 
            and is then tokenized as an IP NFT.
          </p>
          <p className="text-gray-400 mt-2">
            Your IP NFT then holds the complete property rights of your IP and legally represents 
            the IP in the traditional legal realm.
          </p>
          <div className="text-sm text-gray-500 mt-4">
            Form ID: {formId}
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic IP Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-emerald-400 mb-2">
                  IP Number *
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-gray-900 border border-emerald-500/20 rounded-lg p-3
                           focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent
                           transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-emerald-400 mb-2">
                  IP Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-gray-900 border border-emerald-500/20 rounded-lg p-3
                           focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent
                           transition-all"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-emerald-400 mb-2">
                  Company Registration Number *
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-gray-900 border border-emerald-500/20 rounded-lg p-3
                           focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent
                           transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-emerald-400 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-900 border border-emerald-500/20 rounded-lg p-3
                           focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent
                           transition-all"
                />
              </div>
            </motion.div>
          </div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <label className="block text-sm font-medium text-emerald-400 mb-2">
              IP Description *
            </label>
            <textarea
              required
              rows={4}
              className="w-full bg-gray-900 border border-emerald-500/20 rounded-lg p-3
                       focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent
                       transition-all"
            />
          </motion.div>

          {/* Region and Asset Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <label className="block text-sm font-medium text-emerald-400 mb-4">
                Region where company is registered
              </label>
              <div className="space-y-2">
                {['Europe', 'Africa', 'China'].map((region) => (
                  <label key={region} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="region"
                      value={region}
                      className="form-radio text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="text-gray-300">{region}</span>
                  </label>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <label className="block text-sm font-medium text-emerald-400 mb-4">
                IP asset to use as collateral *
              </label>
              <div className="space-y-2">
                {['Trademark', 'Copyright', 'Patent', 'Design'].map((type) => (
                  <label key={type} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="assetType"
                      value={type}
                      className="form-radio text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="text-gray-300">{type}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <label className="block text-sm font-medium text-emerald-400 mb-2">
                Filing Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full bg-gray-900 border border-emerald-500/20 rounded-lg p-3
                           focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent
                           transition-all"
                />
                <Calendar className="absolute right-3 top-3 text-gray-400" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <label className="block text-sm font-medium text-emerald-400 mb-2">
                Issuance Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full bg-gray-900 border border-emerald-500/20 rounded-lg p-3
                           focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent
                           transition-all"
                />
                <Calendar className="absolute right-3 top-3 text-gray-400" />
              </div>
            </motion.div>
          </div>

          {/* Owner Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-8 border-t border-emerald-500/20"
          >
            <h2 className="text-xl font-semibold text-emerald-400 mb-6">Owner Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Last Twelve Months Revenue', key: 'revenue' },
                { label: 'Number of Revenue Streams', key: 'revenueStreams' },
                { label: 'Years of Operation', key: 'yearsOperation' },
                { label: 'Last Twelve Months Company Profit Margin Percentage', key: 'profitMargin' },
                { label: 'Number of Competitors', key: 'competitors' }
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-emerald-400 mb-2">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-900 border border-emerald-500/20 rounded-lg p-3
                             focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent
                             transition-all"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Submit Buttons */}
          <div className="flex justify-between pt-8">
            <button
              type="button"
              className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg
                       hover:bg-gray-700 transition-colors"
            >
              Save Progress
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500
                       text-white rounded-lg hover:from-emerald-600 hover:to-teal-600
                       transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 