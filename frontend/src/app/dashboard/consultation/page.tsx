'use client'

import { motion } from 'framer-motion'
import { Send } from 'lucide-react'

export default function Consultation() {
  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 
                      bg-clip-text text-transparent">
          IP Consultation
        </h1>
        <p className="text-gray-400 mt-2">
          Get expert advice on your intellectual property needs
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-gray-900/50 rounded-lg border border-emerald-500/10 p-6"
      >
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-emerald-400 mb-2">
              Name
            </label>
            <input
              type="text"
              className="w-full bg-gray-900 border border-emerald-500/20 rounded-lg p-3
                       focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent
                       transition-all"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-400 mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full bg-gray-900 border border-emerald-500/20 rounded-lg p-3
                       focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent
                       transition-all"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-400 mb-2">
              Message
            </label>
            <textarea
              rows={4}
              className="w-full bg-gray-900 border border-emerald-500/20 rounded-lg p-3
                       focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent
                       transition-all"
              placeholder="Describe your IP consultation needs..."
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-3
                     bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg
                     transition-colors"
          >
            <Send className="w-4 h-4" />
            Send Message
          </button>
        </form>
      </motion.div>
    </div>
  )
} 