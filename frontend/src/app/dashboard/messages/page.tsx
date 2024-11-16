'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Send, 
  Paperclip, 
  MoreVertical,
  Mail,
  Wallet,
  X,
  Check,
  CheckCheck
} from 'lucide-react'
import { useWeb3Auth } from '@/contexts/Web3AuthContext'
// import { getActivityLogs, getRecentActivities, addNotification } from '@/app/dashboard/marketplace/page'

import { getMessageThreads, getThreadMessages } from '@/app/dashboard/marketplace/page'

interface Message {
  id: string
  content: string
  timestamp: string
  status: 'sent' | 'delivered' | 'read'
  isOwn: boolean
  isOffer?: boolean
  offerAmount?: string
  read: boolean
}

interface Thread {
  id: string
  recipientName: string
  recipientEmail?: string
  recipientWallet?: string
  lastMessage: string
  timestamp: string
  unread: number
  messages: Message[]
}

interface Notification {
  id: string
  type: 'offer' | 'message' | 'system'
  title: string
  message: string
  timestamp: Date
  read: boolean
  senderId: string
  receiverId: string
}

const MOCK_CURRENT_USER = {
  id: 'current-user-id',
  name: 'John Doe',
  walletId: '0x1234...5678',
  email: 'john@example.com'
}

export default function Messages() {
  const { loggedIn } = useWeb3Auth()
  const [activeThread, setActiveThread] = useState<string | null>(null)
  const [messageInput, setMessageInput] = useState('')
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false)
  const [threads, setThreads] = useState<Thread[]>([
    {
      id: '1',
      recipientName: 'Alice Johnson',
      recipientEmail: 'alice@example.com',
      lastMessage: 'Thanks for the IP valuation details',
      timestamp: '2 min ago',
      unread: 2,
      messages: [
        {
          id: 'm1',
          content: "Hello! I'd like to discuss the IP valuation.",
          timestamp: '10:30 AM',
          status: 'read',
          isOwn: true,
          read: false
        },
        {
          id: 'm2',
          content: "Sure! I've reviewed the documents. When would you like to schedule a call?",
          timestamp: '10:32 AM',
          status: 'read',
          isOwn: false,
          read: false
        }
      ]
    },
    {
      id: '2',
      recipientName: 'Bob Smith',
      recipientWallet: '0x8765...4321',
      lastMessage: 'When can we discuss the patent?',
      timestamp: '1 hour ago',
      unread: 0,
      messages: [
        {
          id: 'm3',
          content: "Hi Bob, regarding the patent discussion...",
          timestamp: '11:45 AM',
          status: 'delivered',
          isOwn: true,
          read: false
        }
      ]
    }
  ])

  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Load threads from localStorage
    const storedThreads = getMessageThreads()
    if (storedThreads) {
      setThreads(storedThreads.map(thread => {
        const recipient = thread.participants.find(p => p !== MOCK_CURRENT_USER.id)
        const lastMessage = thread.messages[thread.messages.length - 1]
        
        return {
          id: thread.id,
          recipientName: recipient || 'Unknown',
          lastMessage: lastMessage?.content || '',
          timestamp: new Date(thread.lastUpdated).toLocaleString(),
          unread: thread.messages.filter(m => m.senderId !== MOCK_CURRENT_USER.id).length,
          messages: thread.messages.map(m => ({
            id: m.id,
            content: m.content,
            timestamp: new Date(m.timestamp).toLocaleTimeString(),
            status: 'read',
            isOwn: m.senderId === MOCK_CURRENT_USER.id,
            isOffer: m.isOffer,
            offerAmount: m.offerAmount,
            read: m.senderId === MOCK_CURRENT_USER.id
          }))
        }
      }))
    }

    // Mark messages as read when opening thread
    const handleMarkAsRead = (threadId: string) => {
      const storedThreads = getMessageThreads()
      const updatedThreads = storedThreads.map(thread => {
        if (thread.id === threadId) {
          return {
            ...thread,
            messages: thread.messages.map(m => ({
              ...m,
              read: true
            }))
          }
        }
        return thread
      })
      localStorage.setItem('messageThreads', JSON.stringify(updatedThreads))
    }

    if (activeThread) {
      handleMarkAsRead(activeThread)
    }

    // Load notifications
    const notifications: Notification[] = JSON.parse(
      localStorage.getItem('notifications') || '[]'
    )
    const unreadNotifications = notifications.filter(
      n => !n.read && n.receiverId === MOCK_CURRENT_USER.id
    )
    setUnreadCount(unreadNotifications.length)
  }, [activeThread])

  const handleSendMessage = (content: string) => {
    if (!activeThread || !content.trim()) return

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content: content.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      isOwn: true,
      read: false
    }

    // Store message in localStorage
    const storedThreads = getMessageThreads()
    const threadIndex = storedThreads.findIndex(t => t.id === activeThread)
    
    if (threadIndex !== -1) {
      storedThreads[threadIndex].messages.push({
        id: newMessage.id,
        senderId: MOCK_CURRENT_USER.id,
        content: newMessage.content,
        timestamp: new Date(),
      })
      storedThreads[threadIndex].lastUpdated = new Date()
      localStorage.setItem('messageThreads', JSON.stringify(storedThreads))
    }

    // Update UI
    setThreads(prev => prev.map(thread => {
      if (thread.id === activeThread) {
        return {
          ...thread,
          messages: [...thread.messages, newMessage],
          lastMessage: content.trim(),
          timestamp: 'Just now'
        }
      }
      return thread
    }))

    // Clear input
    setMessageInput('')

    // Simulate message status updates
    setTimeout(() => updateMessageStatus(activeThread, newMessage.id, 'delivered'), 1000)
    setTimeout(() => updateMessageStatus(activeThread, newMessage.id, 'read'), 2000)
  }

  const updateMessageStatus = (threadId: string, messageId: string, status: 'sent' | 'delivered' | 'read') => {
    setThreads(prev => prev.map(thread => {
      if (thread.id === threadId) {
        return {
          ...thread,
          messages: thread.messages.map(msg => 
            msg.id === messageId ? { ...msg, status } : msg
          )
        }
      }
      return thread
    }))
  }

  return (
    <div className="p-8">
      <div className="flex h-[calc(100vh-12rem)] bg-gray-900/50 rounded-lg border border-emerald-500/10">
        {/* Threads Panel */}
        <div className="w-1/3 border-r border-emerald-500/10 flex flex-col">
          <div className="p-4 space-y-4">
            <h2 className="text-xl font-semibold text-emerald-400">Messages</h2>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full bg-gray-800/50 border border-emerald-500/20 rounded-lg pl-10 pr-4 py-2
                         focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent transition-all"
              />
            </div>

            {/* New Message Button */}
            <button 
              onClick={() => setIsNewMessageOpen(true)}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg py-2
                       flex items-center justify-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" />
              New Message
            </button>
          </div>

          {/* Thread List */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <div className="space-y-2">
              {unreadCount > 0 && (
                <div className="px-4 py-2 mb-4 bg-emerald-500/10 rounded-lg">
                  <span className="text-emerald-400">
                    {unreadCount} new {unreadCount === 1 ? 'message' : 'messages'}
                  </span>
                </div>
              )}
              {threads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => setActiveThread(thread.id)}
                  className={`w-full p-3 rounded-lg text-left transition-all
                             ${activeThread === thread.id 
                               ? 'bg-emerald-500/20 text-emerald-400 scale-[0.98]' 
                               : 'hover:bg-gray-800/50'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium">{thread.recipientName}</span>
                    <span className="text-xs text-gray-400">{thread.timestamp}</span>
                  </div>
                  <div className="text-sm text-gray-400 truncate">{thread.lastMessage}</div>
                  {thread.unread > 0 && (
                    <span className="inline-block bg-emerald-500 text-white text-xs rounded-full 
                                   px-2 py-0.5 mt-1">
                      {thread.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Message View */}
        <div className="flex-1 flex flex-col">
          {activeThread ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-emerald-500/10">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-emerald-400">
                      {threads.find(t => t.id === activeThread)?.recipientName}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {threads.find(t => t.id === activeThread)?.recipientEmail || 
                       threads.find(t => t.id === activeThread)?.recipientWallet}
                    </p>
                  </div>
                  <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {threads.find(t => t.id === activeThread)?.messages.map((message) => (
                  <div key={message.id} 
                    className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`relative max-w-[70%] ${
                      message.isOwn 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-gray-800 text-gray-300'
                    } rounded-lg p-3`}>
                      {message.isOffer && (
                        <div className="mb-2 p-2 bg-emerald-500/10 rounded-lg">
                          <span className="text-emerald-400 font-medium">
                            Offer Amount: ${message.offerAmount}
                          </span>
                        </div>
                      )}
                      <p>{message.content}</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-xs text-gray-400">
                          {message.timestamp}
                        </span>
                        {message.isOwn && (
                          <span className="ml-1">
                            {message.status === 'sent' && <Check className="w-3 h-3 text-gray-400" />}
                            {message.status === 'delivered' && <CheckCheck className="w-3 h-3 text-gray-400" />}
                            {message.status === 'read' && <CheckCheck className="w-3 h-3 text-emerald-400" />}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-emerald-500/10">
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                    <Paperclip className="w-5 h-5 text-gray-400" />
                  </button>
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage(messageInput)
                      }
                    }}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-800 border border-emerald-500/20 rounded-lg px-4 py-2
                             focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent transition-all"
                  />
                  <button 
                    onClick={() => handleSendMessage(messageInput)}
                    className="p-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors"
                  >
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a conversation or start a new one
            </div>
          )}
        </div>
      </div>

      {/* New Message Modal */}
      <NewMessageModal 
        isOpen={isNewMessageOpen}
        onClose={() => setIsNewMessageOpen(false)}
        onSend={(recipient, message) => {
          const newThread: Thread = {
            id: `thread-${Date.now()}`,
            recipientName: recipient.split('@')[0],
            recipientEmail: recipient,
            lastMessage: message,
            timestamp: 'Just now',
            unread: 0,
            messages: [{
              id: `msg-${Date.now()}`,
              content: message,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: 'sent',
              isOwn: true,
              read: false
            }]
          }
          setThreads(prev => [newThread, ...prev])
          setActiveThread(newThread.id)
          setIsNewMessageOpen(false)
        }}
      />
    </div>
  )
}

interface NewMessageModalProps {
  isOpen: boolean
  onClose: () => void
  onSend: (recipient: string, message: string) => void
}

function NewMessageModal({ isOpen, onClose, onSend }: NewMessageModalProps) {
  const [recipientType, setRecipientType] = useState<'email' | 'wallet'>('email')
  const [recipient, setRecipient] = useState('')
  const [message, setMessage] = useState('')

  if (!isOpen) return null

  return (
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
        className="bg-gray-900 rounded-lg p-6 max-w-md w-full border border-emerald-500/20"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-emerald-400">New Message</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Recipient Type Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setRecipientType('email')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2
                     transition-colors ${recipientType === 'email' 
                       ? 'bg-emerald-500/20 text-emerald-400' 
                       : 'bg-gray-800 text-gray-400'}`}
          >
            <Mail className="w-4 h-4" />
            Email
          </button>
          <button
            onClick={() => setRecipientType('wallet')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2
                     transition-colors ${recipientType === 'wallet' 
                       ? 'bg-emerald-500/20 text-emerald-400' 
                       : 'bg-gray-800 text-gray-400'}`}
          >
            <Wallet className="w-4 h-4" />
            Wallet
          </button>
        </div>

        {/* Recipient Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-emerald-400 mb-2">
            {recipientType === 'email' ? 'Email Address' : 'Wallet Address'}
          </label>
          <input
            type={recipientType === 'email' ? 'email' : 'text'}
            placeholder={recipientType === 'email' ? 'user@example.com' : '0x...'}
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full bg-gray-800 border border-emerald-500/20 rounded-lg p-3
                     focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent
                     transition-all"
          />
        </div>

        {/* Message Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-emerald-400 mb-2">
            Message
          </label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full bg-gray-800 border border-emerald-500/20 rounded-lg p-3
                     focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent
                     transition-all"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:bg-gray-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (recipient.trim() && message.trim()) {
                onSend(recipient, message)
                setRecipient('')
                setMessage('')
              }
            }}
            disabled={!recipient.trim() || !message.trim()}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg
                     transition-colors flex items-center gap-2 disabled:opacity-50 
                     disabled:hover:bg-emerald-500 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            Send Message
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
} 