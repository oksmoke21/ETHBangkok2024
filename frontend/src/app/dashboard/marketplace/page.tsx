'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Search,
  Grid,
  List,
  Filter as FilterIcon,
  Heart,
  Star,
  MapPin,
  Tag,
  ChevronRight,
  Clock,
  Download,
  MessageCircle,
  Eye,
  Shield,
  AlertCircle,
  Check,
  X,
  Info
} from 'lucide-react'
import { Tooltip } from '@/components/ui/tooltip'

interface IP {
  id: string
  title: string
  thumbnail: string
  category: string
  price: string
  location: string
  isNew: boolean
  isTrending: boolean
  isFavorited: boolean
  verificationStatus: 'verified' | 'pending' | 'unverified'
  views: number
  interestLevel: number
  timeLeft?: string
  description: string
  ownerName: string
  blockchainVerified: boolean
  contractTerms?: string
  valuationSummary?: string
  ownerId: string
}

interface FilterState {
  categories: string[]
  locations: string[]
  priceRange: [number, number] | null
  verificationStatus: string[]
  blockchainStatus: 'all' | 'verified' | 'unverified'
}

interface IPCardProps {
  ip: IP
  isSelected: boolean
  onSelect: (selected: boolean) => void
  onNegotiate: () => void
  onDownloadSummary: () => void
  onToggleFavorite: () => void
  onCardClick: (ip: IP) => void
}

interface NegotiationModalProps {
  ipId: string
  onClose: () => void
  ip: IP
}
interface IPDetailModalProps {
  ip: IP
  onClose: () => void
  onNegotiate: () => void
  onContactVendor: () => void
}
interface MessageLog {
  id: string
  senderId: string
  receiverId: string
  subject: string
  message: string
  timestamp: Date
  ipId?: string
  offerAmount?: string
}
// Add this interface for message threads
interface MessageThread {
  id: string
  participants: string[]
  messages: {
    id: string
    senderId: string
    content: string
    timestamp: Date
    isOffer?: boolean
    offerAmount?: string
    ipId?: string
  }[]
  lastUpdated: Date
}
// Add these interfaces at the top with other interfaces
interface ActivityLog {
  id: string
  type: 'offer_sent' | 'message_sent' | 'ip_viewed' | 'contract_signed'
  timestamp: Date
  details: {
    ipId: string
    ipTitle: string
    amount?: string
    message?: string
    recipientId?: string
    recipientName?: string
  }
}

export default function Marketplace() {
  // State management
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    locations: [],
    priceRange: null,
    verificationStatus: [],
    blockchainStatus: 'all'
  })
  const [selectedIPs, setSelectedIPs] = useState<string[]>([])
  const [savedFilters, setSavedFilters] = useState<{ name: string; filters: FilterState }[]>([])
  const [showNewUserGuide, setShowNewUserGuide] = useState(true)
  const [showNegotiationModal, setShowNegotiationModal] = useState(false)
  const [selectedIPForNegotiation, setSelectedIPForNegotiation] = useState<string | null>(null)
  const [selectedIPForDetail, setSelectedIPForDetail] = useState<IP | null>(null)

  // Mock data
  const [mockData, setMockData] = useState<IP[]>([
    {
      id: '1',
      title: 'AI-Powered Analytics Patent',
      thumbnail: '/images/ip1.jpg',
      category: 'Patent',
      price: '$75,000',
      location: 'United States',
      isNew: true,
      isTrending: true,
      isFavorited: false,
      verificationStatus: 'verified',
      views: 342,
      interestLevel: 4,
      timeLeft: '3 days',
      description: 'Revolutionary AI analytics patent with global market potential',
      ownerName: 'Tech Innovations Inc.',
      blockchainVerified: true,
      contractTerms: 'Exclusive licensing available',
      valuationSummary: 'Market value assessment based on...',
      ownerId: 'user123'
    },
    {
      id: '2',
      title: 'Sustainable Energy Storage Solution',
      thumbnail: '/images/ip2.jpg',
      category: 'Patent',
      price: '$120,000',
      location: 'Germany',
      isNew: false,
      isTrending: true,
      isFavorited: false,
      verificationStatus: 'verified',
      views: 567,
      interestLevel: 5,
      description: 'Next-generation battery technology for renewable energy storage',
      ownerName: 'GreenTech GmbH',
      blockchainVerified: true,
      ownerId: 'user124'
    },
    {
      id: '3',
      title: 'Smart Home Automation Trademark',
      thumbnail: '/images/ip3.jpg',
      category: 'Trademark',
      price: '$45,000',
      location: 'Japan',
      isNew: true,
      isTrending: false,
      isFavorited: false,
      verificationStatus: 'pending',
      views: 234,
      interestLevel: 3,
      timeLeft: '5 days',
      description: 'Established smart home brand with strong market presence',
      ownerName: 'Smart Living Co.',
      blockchainVerified: false,
      ownerId: 'user125'
    },
    {
      id: '4',
      title: 'Biotech Research Database',
      thumbnail: '/images/ip4.jpg',
      category: 'Copyright',
      price: '$250,000',
      location: 'Switzerland',
      isNew: false,
      isTrending: true,
      isFavorited: false,
      verificationStatus: 'verified',
      views: 789,
      interestLevel: 5,
      description: 'Comprehensive database of pharmaceutical research data',
      ownerName: 'BioResearch AG',
      blockchainVerified: true,
      ownerId: 'user126'
    }
    // Add more mock data
  ])

  const router = useRouter()
  // Handlers
  const handleNegotiation = (ipId: string) => {
    setSelectedIPForNegotiation(ipId)
    setShowNegotiationModal(true)
  }

  const handleDownloadSummary = async (ipId: string) => {
    // Implement PDF generation logic here
    console.log('Downloading summary for IP:', ipId)
  }

  const handleToggleFavorite = (ipId: string) => {
    setMockData(prev => prev.map(ip =>
      ip.id === ipId ? { ...ip, isFavorited: !ip.isFavorited } : ip
    ))
    // Sync with localStorage
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    if (favorites.includes(ipId)) {
      localStorage.setItem('favorites', JSON.stringify(favorites.filter((id: string) => id !== ipId)))
    } else {
      localStorage.setItem('favorites', JSON.stringify([...favorites, ipId]))
    }
  }

  // Add new function to handle vendor contact
  const handleContactVendor = (ownerId: string, ipTitle: string) => {
    router.push(`/dashboard/messages?recipient=${ownerId}&subject=Regarding: ${ipTitle}`)
  }

  // Filter and search logic
  const filteredIPs = useMemo(() => {
    return mockData.filter(ip => {
      const searchMatch = ip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ip.description.toLowerCase().includes(searchQuery.toLowerCase())

      const categoryMatch = filters.categories.length === 0 ||
        filters.categories.includes(ip.category)

      const locationMatch = filters.locations.length === 0 ||
        filters.locations.includes(ip.location)

      const verificationMatch = filters.verificationStatus.length === 0 ||
        filters.verificationStatus.includes(ip.verificationStatus)

      const blockchainMatch = filters.blockchainStatus === 'all' ||
        (filters.blockchainStatus === 'verified' && ip.blockchainVerified) ||
        (filters.blockchainStatus === 'unverified' && !ip.blockchainVerified)

      return searchMatch && categoryMatch && locationMatch && verificationMatch && blockchainMatch
    })
  }, [mockData, searchQuery, filters])

  // WebSocket connection for real-time updates
  useEffect(() => {
    const ws = new WebSocket('wss://your-websocket-server')

    ws.onmessage = (event) => {
      const update = JSON.parse(event.data)
      setMockData(prev => prev.map(ip =>
        ip.id === update.ipId ? { ...ip, ...update.changes } : ip
      ))
    }

    return () => ws.close()
  }, [])

  return (
    <div className="p-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 
                      bg-clip-text text-transparent">
          IP Marketplace
        </h1>
        <p className="text-gray-400 mt-2">
          Discover and acquire intellectual property assets
        </p>
      </motion.div>

      {/* New User Guide */}
      <AnimatePresence>
        {showNewUserGuide && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 bg-emerald-500/10 rounded-xl p-6 border border-emerald-500/20"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-emerald-400 mb-2">
                  👋 First Time Here?
                </h3>
                <p className="text-gray-400">
                  Welcome to the IP Marketplace! Here's how to get started:
                </p>
                <ul className="mt-4 space-y-2 text-gray-400">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Browse available IPs using filters
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Save your favorite IPs for later
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Start negotiations directly with IP owners
                  </li>
                </ul>
              </div>
              <button
                onClick={() => setShowNewUserGuide(false)}
                className="text-gray-400 hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Search and Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search IPs by name, category, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 border border-emerald-500/20 rounded-lg pl-10 pr-4 py-2
                     focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors
                      ${viewMode === 'grid'
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-gray-900 text-gray-400 hover:text-emerald-400'}`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors
                      ${viewMode === 'list'
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-gray-900 text-gray-400 hover:text-emerald-400'}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* IP Grid/List */}
      <div className={`grid ${viewMode === 'grid'
        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        : 'grid-cols-1'
        } gap-6`}>
        {filteredIPs.map((ip) => (
          <IPCard
            key={ip.id}
            ip={ip}
            isSelected={selectedIPs.includes(ip.id)}
            onSelect={(selected) => {
              if (selected) {
                setSelectedIPs([...selectedIPs, ip.id])
              } else {
                setSelectedIPs(selectedIPs.filter(id => id !== ip.id))
              }
            }}
            onNegotiate={() => handleNegotiation(ip.id)}
            onDownloadSummary={() => handleDownloadSummary(ip.id)}
            onToggleFavorite={() => handleToggleFavorite(ip.id)}
            onCardClick={(ip) => setSelectedIPForDetail(ip)}
          />
        ))}
      </div>

      {/* Detail Modal */}
      {selectedIPForDetail && (
        <IPDetailModal
          ip={selectedIPForDetail}
          onClose={() => setSelectedIPForDetail(null)}
          onNegotiate={() => {
            setSelectedIPForDetail(null)
            handleNegotiation(selectedIPForDetail.id)
          }}
          onContactVendor={() => handleContactVendor(selectedIPForDetail.ownerId, selectedIPForDetail.title)}
        />
      )}

      {/* Negotiation Modal */}
      {showNegotiationModal && selectedIPForNegotiation && (
        <NegotiationModal
          ipId={selectedIPForNegotiation}
          ip={mockData.find(ip => ip.id === selectedIPForNegotiation)!}
          onClose={() => {
            setShowNegotiationModal(false)
            setSelectedIPForNegotiation(null)
          }}
        />
      )}
    </div>
  )
}

// Add these components at the bottom of the file
// Add these components at the bottom of the file
function IPCard({
  ip,
  isSelected,
  onSelect,
  onNegotiate,
  onDownloadSummary,
  onToggleFavorite,
  onCardClick
}: IPCardProps) {
  const router = useRouter()

  const handleContactVendor = (ownerId: string, ipTitle: string) => {
    router.push(`/dashboard/messages?recipient=${ownerId}&subject=Regarding: ${ipTitle}`)
  }

  const handleClick = (e: React.MouseEvent) => {
    // Prevent click event from bubbling up when clicking buttons
    if ((e.target as HTMLElement).closest('button')) {
      e.stopPropagation()
      return
    }
    onCardClick(ip)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-900/50 rounded-lg border border-emerald-500/10 overflow-hidden
                hover:border-emerald-500/30 transition-all duration-300 cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative">
        {/* Thumbnail */}
        <div className="relative h-48">
          <img
            src={ip.thumbnail}
            alt={ip.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={onToggleFavorite}
              className="p-2 bg-gray-900/80 rounded-full hover:bg-gray-800 transition-colors"
              aria-label={ip.isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={`w-4 h-4 ${ip.isFavorited ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            </button>
          </div>
          {ip.isNew && (
            <span className="absolute top-2 left-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded">
              New
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-lg line-clamp-2">{ip.title}</h3>
              <div className="flex items-center gap-1 text-emerald-400">
                <Tag className="w-4 h-4" />
                <span>{ip.price}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>{ip.location}</span>
            </div>
          </div>

          <p className="text-sm text-gray-400 line-clamp-2">
            {ip.description}
          </p>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-gray-400" />
              <span>{ip.views} views</span>
            </div>
            {ip.timeLeft && (
              <div className="flex items-center gap-2 text-amber-400">
                <Clock className="w-4 h-4" />
                <span>{ip.timeLeft}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {ip.blockchainVerified && (
              <Tooltip content="Blockchain Verified">
                <Shield className="w-4 h-4 text-emerald-400" />
              </Tooltip>
            )}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < ip.interestLevel ? 'fill-amber-400 text-amber-400' : 'text-gray-600'
                    }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => handleContactVendor(ip.ownerId, ip.title)}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg
                       transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Contact
            </button>
            <button
              onClick={onNegotiate}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg
                       transition-colors flex items-center justify-center gap-2"
            >
              <Tag className="w-4 h-4" />
              Make Offer
            </button>
            <button
              onClick={onDownloadSummary}
              className="p-2 border border-emerald-500/20 hover:border-emerald-500/40 rounded-lg
                       transition-colors"
              aria-label="Download Summary"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function IPDetailModal({ ip, onClose, onNegotiate, onContactVendor }: IPDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="space-y-6">
          <div className="relative h-64">
            <img
              src={ip.thumbnail}
              alt={ip.title}
              className="w-full h-full object-cover rounded-lg"
            />
            {ip.isNew && (
              <span className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full">
                New
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold">{ip.title}</h2>
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-emerald-400" />
                <span className="text-xl font-semibold text-emerald-400">{ip.price}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm text-gray-400">Location</h3>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>{ip.location}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm text-gray-400">Category</h3>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-400" />
                  <span>{ip.category}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm text-gray-400">Description</h3>
              <p className="text-gray-300">{ip.description}</p>
            </div>

            {ip.contractTerms && (
              <div className="space-y-2">
                <h3 className="text-sm text-gray-400">Contract Terms</h3>
                <p className="text-gray-300">{ip.contractTerms}</p>
              </div>
            )}

            <div className="flex items-center gap-4 pt-4">
              <button
                onClick={onNegotiate}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg
                         transition-colors flex items-center justify-center gap-2"
              >
                <Tag className="w-5 h-5" />
                Make Offer
              </button>
              <button
                onClick={onContactVendor}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg
                         transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Contact
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function NegotiationModal({ ipId, ip, onClose }: NegotiationModalProps) {
  const router = useRouter()
  const [offer, setOffer] = useState('')
  const [message, setMessage] = useState('')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  // Mock current user data (replace with actual auth context)
  const currentUser = {
    id: 'current-user-id',
    name: 'John Doe',
    walletId: '0x1234...5678'
  }

  const createMessageAndActivityLog = (formattedMessage: string) => {
    // 1. Create/Update Message Thread
    const threadId = [currentUser.id, ip.ownerId].sort().join('-')
    const existingThreads: MessageThread[] = JSON.parse(
      localStorage.getItem('messageThreads') || '[]'
    )

    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      content: formattedMessage,
      timestamp: new Date(),
      isOffer: true,
      offerAmount: offer,
      ipId: ip.id
    }

    const existingThread = existingThreads.find(t => t.id === threadId)
    if (existingThread) {
      existingThread.messages.push(newMessage)
      existingThread.lastUpdated = new Date()
    } else {
      const newThread: MessageThread = {
        id: threadId,
        participants: [currentUser.id, ip.ownerId],
        messages: [newMessage],
        lastUpdated: new Date()
      }
      existingThreads.push(newThread)
    }
    localStorage.setItem('messageThreads', JSON.stringify(existingThreads))

    // 2. Create Activity Log
    const activityLog: ActivityLog = {
      id: `activity-${Date.now()}`,
      type: 'offer_sent',
      timestamp: new Date(),
      details: {
        ipId: ip.id,
        ipTitle: ip.title,
        amount: offer,
        message: message,
        recipientId: ip.ownerId,
        recipientName: ip.ownerName
      }
    }

    const existingActivities: ActivityLog[] = JSON.parse(
      localStorage.getItem('activityLogs') || '[]'
    )
    existingActivities.unshift(activityLog)
    localStorage.setItem('activityLogs', JSON.stringify(
      existingActivities.slice(0, 50) // Keep last 50 activities
    ))

    // 3. Update Recent Activities in Dashboard
    const recentActivities = JSON.parse(
      localStorage.getItem('recentActivities') || '[]'
    )
    recentActivities.unshift({
      title: 'Offer Sent',
      description: `Sent offer of $${offer} for ${ip.title}`,
      time: 'Just now',
      icon: 'Tag',
      type: 'offer_sent'
    })
    localStorage.setItem('recentActivities', JSON.stringify(
      recentActivities.slice(0, 10) // Keep last 10 recent activities
    ))
  }

  const handleSubmitOffer = () => {
    if (!offer || !message) {
      alert('Please fill in both offer amount and message')
      return
    }

    try {
      // Create formatted message using template
      const formattedMessage = `
🤝 New Offer for ${ip.title}

From: ${currentUser.name}
Wallet ID: ${currentUser.walletId}
Offer Amount: $${offer}

Message:
${message}

IP Details:
- Title: ${ip.title}
- Category: ${ip.category}
- Location: ${ip.location}

Please review this offer and respond at your earliest convenience.

Best regards,
${currentUser.name}
      `.trim()

      // Create message and activity logs
      createMessageAndActivityLog(formattedMessage)

      // Show success message
      setShowSuccessMessage(true)

      // Redirect to messages after delay
      setTimeout(() => {
        router.push(`/dashboard/messages?thread=${[currentUser.id, ip.ownerId].sort().join('-')}`)
        onClose()
      }, 2000)

    } catch (error) {
      console.error('Error sending offer:', error)
      alert('Failed to send offer. Please try again.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 rounded-lg p-6 max-w-lg w-full mx-4 relative"
      >
        {showSuccessMessage ? (
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Check className="w-8 h-8 text-emerald-400" />
            </motion.div>
            <h3 className="text-xl font-semibold text-emerald-400 mb-2">Offer Sent Successfully!</h3>
            <p className="text-gray-400">Redirecting to messages...</p>
          </div>
        ) : (
          <>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-semibold mb-6">Make an Offer for {ip.title}</h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="offer" className="block text-sm font-medium text-gray-300">
                  Your Offer Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    id="offer"
                    value={offer}
                    onChange={(e) => setOffer(e.target.value)}
                    className="w-full bg-gray-800 rounded-lg px-8 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Enter your offer amount"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                  Additional Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full bg-gray-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Add any additional details or terms you'd like to discuss..."
                  required
                />
              </div>

              <div className="bg-gray-800 rounded-lg p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-300 space-y-2">
                  <p>Your message will be formatted to include:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-400">
                    <li>Your name and wallet ID</li>
                    <li>The offer amount</li>
                    <li>Your additional message</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitOffer}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors
                           flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Send Offer
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
