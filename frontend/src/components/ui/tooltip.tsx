'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TooltipProps {
  content: string
  children: React.ReactNode
}

export function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 
                     rounded-md shadow-lg -top-8 left-1/2 transform -translate-x-1/2
                     whitespace-nowrap border border-emerald-500/20"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 