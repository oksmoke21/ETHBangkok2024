'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, Clock } from 'lucide-react'
import { useState } from 'react'

interface Notification {
  id: number
  title: string
  message: string
  time: string
  type: 'info' | 'warning' | 'success'
  isRead: boolean
}

export function NotificationPopup({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean
  onClose: () => void
}) {
  const [notifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New IP Listed",
      message: "A new IP 'Blockchain Patent #123' has been listed in the marketplace",
      time: "2 minutes ago",
      type: "info",
      isRead: false
    },
    {
      id: 2,
      title: "Loan Request",
      message: "Your IP loan request has been approved",
      time: "1 hour ago",
      type: "success",
      isRead: false
    },
    {
      id: 3,
      title: "Valuation Update",
      message: "Your IP valuation report is ready for review",
      time: "2 hours ago",
      type: "warning",
      isRead: true
    }
  ])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed right-4 top-20 w-96 bg-gray-900 rounded-xl shadow-lg z-50
                     border border-emerald-500/20 overflow-hidden"
          >
            <div className="p-4 border-b border-emerald-500/20 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </h2>
              <button 
                onClick={onClose}
                className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-4 border-b border-emerald-500/10 hover:bg-gray-800/50 
                           transition-colors cursor-pointer ${
                             !notification.isRead ? 'bg-emerald-500/5' : ''
                           }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium text-emerald-400">
                      {notification.title}
                    </h3>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">
                    {notification.message}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 