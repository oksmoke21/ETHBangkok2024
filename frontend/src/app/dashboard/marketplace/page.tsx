'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
import { Tooltip } from '../../../../ui/tooltip'

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
}

interface NegotiationModalProps {
  ipId: string
  onClose: () => void
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
      interestLevel: 89,
      timeLeft: '3 days',
      description: 'Revolutionary AI analytics patent with global market potential',
      ownerName: 'Tech Innovations Inc.',
      blockchainVerified: true,
      contractTerms: 'Exclusive licensing available',
      valuationSummary: 'Market value assessment based on...'
    }
    // Add more mock data
  ])

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
      <div className={`grid ${
        viewMode === 'grid' 
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
              />
        ))}
            </div>
            
      {/* Negotiation Modal */}
      {showNegotiationModal && (
        <NegotiationModal
          ipId={selectedIPForNegotiation!}
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
function IPCard({ ip, isSelected, onSelect, onNegotiate, onDownloadSummary, onToggleFavorite }: IPCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-900/50 rounded-lg border border-emerald-500/10 overflow-hidden
                hover:border-emerald-500/30 transition-all duration-300"
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
                  className={`w-4 h-4 ${
                    i < ip.interestLevel ? 'fill-amber-400 text-amber-400' : 'text-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={onNegotiate}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg
                       transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Negotiate
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

function NegotiationModal({ ipId, onClose }: NegotiationModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 rounded-lg p-6 max-w-lg w-full mx-4 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-semibold mb-6">Start Negotiation</h2>

        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="offer" className="block text-sm font-medium text-gray-300">
              Your Initial Offer
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                id="offer"
                className="w-full bg-gray-800 rounded-lg px-8 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="Enter your offer amount"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-medium text-gray-300">
              Message to Seller
            </label>
            <textarea
              id="message"
              rows={4}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Explain your offer and any terms you'd like to discuss..."
            />
          </div>

          <div className="bg-gray-800 rounded-lg p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-300">
              Your offer will be sent to the IP owner. They will have 48 hours to respond before the offer expires.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors
                       flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Send Offer
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 