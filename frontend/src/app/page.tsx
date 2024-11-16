'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Shield, Users, Globe, Zap, CheckCircle2, X, User2, Star } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Add new interface for marketplace items
interface MarketplaceItem {
  id: number
  title: string
  price: string
  category: string
  image: string
  description: string
  details: {
    type: string
    status: string
    jurisdiction: string
    expiryDate: string
  }
  vendor: {
    name: string
    rating: number
    verified: boolean
  }
}

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null)
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false)
  const router = useRouter()

  // Sample marketplace items
  const marketplaceItems: MarketplaceItem[] = [
    {
      id: 1,
      title: "Patent: AI-Driven Analytics",
      price: "50,000 USDC",
      category: "Technology",
      image: "/patent1.jpg",
      description: "Revolutionary AI-powered analytics system for real-time data processing and predictive modeling. This patent covers core algorithms and implementation methods.",
      details: {
        type: "Utility Patent",
        status: "Granted",
        jurisdiction: "International",
        expiryDate: "2043"
      },
      vendor: {
        name: "TechInnovate Labs",
        rating: 4.8,
        verified: true
      }
    },
    {
      id: 2,
      title: "Trademark: EcoTech™",
      price: "25,000 USDC",
      category: "Green Technology",
      image: "/trademark1.jpg",
      description: "EcoTech™ is a registered trademark for sustainable technology products and services. This trademark covers eco-friendly products and services.",
      details: {
        type: "Service Mark",
        status: "Registered",
        jurisdiction: "International",
        expiryDate: "2043"
      },
      vendor: {
        name: "EcoTech Solutions",
        rating: 4.7,
        verified: true
      }
    },
    {
      id: 3,
      title: "Copyright: Software Suite",
      price: "35,000 USDC",
      category: "Software",
      image: "/copyright1.jpg",
      description: "The Software Suite is a copyrighted work for software development and distribution. This copyright covers the source code and documentation.",
      details: {
        type: "Copyright",
        status: "Registered",
        jurisdiction: "International",
        expiryDate: "2043"
      },
      vendor: {
        name: "Software Innovators",
        rating: 4.9,
        verified: true
      }
    },
    {
      id: 4,
      title: "Patent: Quantum Computing",
      price: "75,000 USDC",
      category: "Technology",
      image: "/patent2.jpg",
      description: "The Quantum Computing patent covers the development and implementation of quantum algorithms and architectures. This patent covers core algorithms and implementation methods.",
      details: {
        type: "Utility Patent",
        status: "Granted",
        jurisdiction: "International",
        expiryDate: "2043"
      },
      vendor: {
        name: "QuantumTech Solutions",
        rating: 4.8,
        verified: true
      }
    },
    // Add more items as needed
  ]

  const handleItemClick = (item: MarketplaceItem) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handleAction = (action: 'buy' | 'contact') => {
    setIsModalOpen(false)
    setIsConnectModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const handleNavigate = () => {
    router.push('/dashboard')
  }

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Blockchain",
      description: "All trades are permissioned, traceable, and immutable for guaranteed trust."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Verified Experts",
      description: "Collaborate with lawyers specialized in IP, vetted through our platform."
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Access",
      description: "Connect with IP experts worldwide with unmatched security."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Smart Tools",
      description: "Access valuation, licensing templates, and real-time blockchain insights."
    }
  ]

  const workflow = [
    {
      step: "01",
      title: "Sign Up & Verify",
      description: "Join the platform, verify your profile, and gain access to a secure marketplace."
    },
    {
      step: "02",
      title: "List or Find IPs",
      description: "Post your intellectual property or browse available IPs for trade or license."
    },
    {
      step: "03",
      title: "Connect & Transact",
      description: "Work with verified lawyers and transact securely through blockchain."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section - Modified */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
          
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-emerald-500/5" />
          
          {/* Animated particles */}
          <div className="absolute inset-0">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 0,
                  scale: 0,
                  x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0,
                  y: typeof window !== 'undefined' ? Math.random() * window.innerHeight : 0
                }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0,
                  y: typeof window !== 'undefined' ? Math.random() * window.innerHeight : 0
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
                className="absolute w-1 h-1 bg-emerald-500/30 rounded-full"
              />
            ))}
          </div>
          
          {/* Floating blockchain elements */}
          <div className="absolute inset-0">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`block-${i}`}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ 
                  y: "-100%",
                  opacity: [0, 1, 1, 0],
                  rotate: [0, 90, 180, 270, 360]
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  delay: i * 2,
                }}
                className="absolute left-[${Math.random() * 100}%]"
              >
                <div className="w-16 h-16 border-2 border-emerald-500/20 rounded-lg 
                               rotate-45 backdrop-blur-sm" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Glowing effect behind title */}
            <div className="absolute -inset-x-20 -inset-y-10 bg-gradient-to-r 
                           from-emerald-500/20 via-emerald-500/5 to-emerald-500/20 
                           blur-3xl -z-10" />
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8">
              <span className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 
                              bg-clip-text text-transparent">
                Empowering Secure and
              </span>
              <br />
              <span className="bg-gradient-to-r from-teal-400 via-emerald-500 to-emerald-400 
                              bg-clip-text text-transparent">
                Transparent IP Finance
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
            >
              All-in-one platform to Buy, Sell, and Finance Intellectual Property with Legal Expertise
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <button className="px-8 py-4 border border-emerald-500/30 rounded-lg 
                               hover:bg-emerald-500/10 transition-all duration-300
                               hover:border-emerald-500/50">
                Sign Up Today
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-emerald-500/30 rounded-full p-1"
          >
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* New Marketplace Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 
                         bg-clip-text text-transparent mb-4">
              Marketplace
            </h2>
            <p className="text-xl text-gray-400">
              Discover and trade intellectual property assets securely
            </p>
          </motion.div>

          <div className="relative">
            <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory">
              {marketplaceItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  className="min-w-[300px] bg-gray-900/50 rounded-xl p-6 snap-center
                           border border-emerald-500/20 hover:border-emerald-500/40
                           transition-all duration-300 cursor-pointer group"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="h-40 bg-emerald-500/10 rounded-lg mb-4 
                                 group-hover:bg-emerald-500/20 transition-colors" />
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-emerald-400 font-medium mb-2">{item.price}</p>
                  <span className="text-sm text-gray-400">{item.category}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full max-w-md mx-auto px-8 py-4 bg-emerald-500 rounded-lg hover:bg-emerald-600
                       transition-colors duration-300 font-medium"
            >
              Explore More
            </button>
          </div>
        </div>
      </section>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50
                     flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="bg-gray-900 rounded-2xl w-full max-w-lg max-h-[600px] overflow-hidden
                         border border-emerald-500/20 shadow-2xl shadow-emerald-500/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Image Background */}
              <div className="relative h-32 bg-gradient-to-br from-emerald-500/20 to-emerald-900/20
                             overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/90" />
                
                {/* Close button */}
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-black/20 
                           hover:bg-black/40 transition-colors backdrop-blur-sm
                           border border-white/10"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Title and Category - Overlaid on image */}
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 
                               rounded-full text-xs mb-1 inline-block
                               backdrop-blur-sm border border-emerald-500/20">
                    {selectedItem.category}
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    {selectedItem.title}
                  </h3>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto max-h-[calc(600px-8rem)]">
                <div className="p-4">
                  {/* Price and Vendor Info in one row */}
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-emerald-400 text-xl font-bold">
                      {selectedItem.price}
                    </p>
                    <div className="flex items-center gap-2">
                      <User2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm text-gray-300">{selectedItem.vendor.name}</span>
                      {selectedItem.vendor.verified && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {selectedItem.description}
                    </p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {Object.entries(selectedItem.details).map(([key, value]) => (
                      <div key={key} 
                           className="p-2 bg-emerald-500/5 rounded-lg border border-emerald-500/10
                                    hover:border-emerald-500/20 transition-colors">
                        <p className="text-xs text-gray-400">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </p>
                        <p className="font-medium text-sm text-white">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons - Fixed at bottom */}
              <div className="border-t border-emerald-500/10 p-4 bg-gray-900">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction('buy')}
                    className="flex-1 py-2 bg-emerald-500 rounded-lg text-sm font-medium
                             hover:bg-emerald-600 transition-all duration-300"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={() => handleAction('contact')}
                    className="flex-1 py-2 border border-emerald-500/30 rounded-lg text-sm
                             font-medium hover:bg-emerald-500/10 transition-all duration-300"
                  >
                    Contact Vendor
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connect Modal - Updated version */}
      <AnimatePresence>
        {isConnectModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50
                     flex items-center justify-center"
            onClick={() => setIsConnectModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 p-8 rounded-xl max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-4">Connect to Continue</h3>
              <p className="text-gray-400 mb-6">
                Connect your wallet to proceed with the transaction
              </p>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full py-3 bg-emerald-500 rounded-lg hover:bg-emerald-600
                           transition-colors duration-300"
                >
                  Connect Wallet
                </button>
                <button
                  onClick={() => setIsConnectModalOpen(false)}
                  className="w-full py-3 border border-gray-600 rounded-lg
                           hover:bg-gray-800 transition-colors duration-300"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Elevator Pitch with Visual Enhancement */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-transparent" />
        <div className="absolute inset-0">
          {/* Animated blockchain cubes */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 100 }}
              animate={{ 
                opacity: [0.5, 0.8, 0.5],
                y: [-20, 20, -20],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                delay: i * 2
              }}
              className="absolute w-64 h-64 blur-3xl bg-emerald-500/10"
              style={{
                left: `${20 + i * 30}%`,
                top: `${20 + i * 10}%`
              }}
            />
          ))}
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 
                           bg-clip-text text-transparent">
              Revolutionizing IP Trading
            </h2>
            <p className="text-xl leading-relaxed text-gray-300">
              IPSphere is the first blockchain-powered IP marketplace, connecting IP owners with 
              verified lawyers for secure and efficient trading. Our platform revolutionizes 
              IP transactions through the power of blockchain technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Key Features with Visual Cards */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 
                         bg-clip-text text-transparent mb-4"
            >
              Powerful Features
            </motion.h2>
            <p className="text-gray-400">Built for the future of IP trading</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Blockchain Security",
                description: "Immutable records and secure transactions powered by blockchain technology"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Verified Lawyers",
                description: "Connect with certified legal experts specialized in IP trading"
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Global Marketplace",
                description: "Access a worldwide network of IP assets and professionals"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative group p-8"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-900/50 
                               rounded-xl border border-emerald-500/20 transform transition-transform 
                               group-hover:scale-[1.02] duration-300" />
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent 
                               opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                
                <div className="relative">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-lg flex items-center justify-center 
                                text-emerald-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-emerald-400 mb-4">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Simplified Footer */}
      <footer className="bg-gray-900/50 backdrop-blur-sm border-t border-emerald-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="block group">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 
                               bg-clip-text text-transparent mb-4">
                  IPSphere
                </h3>
                <p className="text-gray-400 text-sm max-w-md">
                  Your trusted platform for secure and transparent IP trading, powered by blockchain technology.
                </p>
              </Link>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2">
                {[
                  { label: "Marketplace", href: "/marketplace" },
                  { label: "How it Works", href: "/how-it-works" },
                  { label: "For Lawyers", href: "/for-lawyers" }
                ].map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href}
                      className="text-gray-400 hover:text-emerald-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                {[
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                  { label: "Contact", href: "/contact" }
                ].map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href}
                      className="text-gray-400 hover:text-emerald-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-emerald-500/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © 2024 IPSphere. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <Link 
                  href="https://twitter.com" 
                  target="_blank"
                  className="text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  Twitter
                </Link>
                <Link 
                  href="https://linkedin.com" 
                  target="_blank"
                  className="text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  LinkedIn
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 