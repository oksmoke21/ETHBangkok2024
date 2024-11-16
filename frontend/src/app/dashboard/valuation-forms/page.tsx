'use client'

import { motion } from 'framer-motion'
import { FileText, Download, Clock } from 'lucide-react'

export default function ValuationForms() {
  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 
                      bg-clip-text text-transparent">
          IP Valuation Forms
        </h1>
        <p className="text-gray-400 mt-2">
          Track and manage IP valuations
        </p>
      </motion.div>

      <div className="grid gap-6">
        {[
          {
            id: 'VAL001',
            ipName: 'AI Analytics Patent',
            status: 'In Progress',
            submittedDate: '2024-03-15',
            estimatedCompletion: '2024-03-22'
          },
          // Add more mock data
        ].map((form) => (
          <motion.div
            key={form.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/50 rounded-lg border border-emerald-500/10 p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-emerald-400">{form.ipName}</h3>
                <p className="text-sm text-gray-400 mt-1">Form ID: {form.id}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm
                ${form.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400' : 
                  'bg-emerald-500/20 text-emerald-400'}`}>
                {form.status}
              </span>
            </div>
            
            <div className="mt-4 flex items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Submitted: {form.submittedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Est. Completion: {form.estimatedCompletion}</span>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 
                               text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors">
                <Download className="w-4 h-4" />
                Download Report
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 