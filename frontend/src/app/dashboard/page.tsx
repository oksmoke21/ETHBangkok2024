'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Globe, 
  Wallet, 
  ChevronRight,
  TrendingUp,
  Clock,
  Scale,
  Bell,
  Zap,
  Plus,
  Phone,
  Sun
} from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import Link from 'next/link'
import { NotificationPopup } from '@/components/ui/notification-popup'

interface DashboardCard {
  title: string
  description: string
  icon: React.ReactNode
  link: string
  gradient: string
}

export default function Dashboard() {
  const [isLawyer, setIsLawyer] = useState(false)
  const [notifications, setNotifications] = useState(0)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isLoggedIn] = useState(false)
  
  const primaryCards: DashboardCard[] = [
    {
      title: "IP Marketplace",
      description: "Provide borrowers with liquidity, list an IP for loan, buy and sell IP",
      icon: <Globe className="w-6 h-6" />,
      link: "/marketplace",
      gradient: "from-emerald-500 to-emerald-700"
    },
    {
      title: "Top-up wallet",
      description: "Simply pay for transactions & valuation fees, liquidity, earn rewards and more",
      icon: <Wallet className="w-6 h-6" />,
      link: "/top-up",
      gradient: "from-emerald-400 to-emerald-600"
    }
  ]

  // Simulated data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications(3)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Navigation Bar */}
        <div className="sticky top-0 z-10 py-4 bg-gray-950/80 backdrop-blur-sm border-b border-emerald-500/10">
          <div className="flex justify-between items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 
                            bg-clip-text text-transparent">
                Welcome to IPSphere
              </h1>
              <p className="text-gray-400 mt-2">
                Your gateway to intellectual property management
              </p>
            </motion.div>
            
            <div className="flex items-center gap-4">
              {/* Theme Toggle Button (optional) */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-2 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors
                           border border-emerald-500/10 hover:border-emerald-500/20"
              >
                <Sun className="w-5 h-5 text-emerald-400" />
              </motion.button>
              
              {/* Notification Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative p-2 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors
                           border border-emerald-500/10 hover:border-emerald-500/20"
                onClick={() => setIsNotificationOpen(true)}
              >
                <Bell className="w-5 h-5 text-emerald-400" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full 
                                 text-xs flex items-center justify-center animate-pulse">
                    {notifications}
                  </span>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Main Content with proper spacing */}
        <div className="py-8 space-y-8">
          {/* Notification Popup */}
          <NotificationPopup 
            isOpen={isNotificationOpen} 
            onClose={() => setIsNotificationOpen(false)} 
          />

          {/* Login Required Banner */}
          {!isLoggedIn && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 mb-8"
            >
              <p className="text-emerald-400 text-sm">
                👋 Please sign in to perform actions. You can browse and view IPs, but interactions require an account.
              </p>
            </motion.div>
          )}

          {/* Primary Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {primaryCards.map((card, index) => (
              <Link href={card.link} key={card.title}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`group relative p-6 rounded-xl overflow-hidden
                             hover:scale-[1.02] transition-all duration-300 cursor-pointer`}
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-90`} />
                  
                  {/* Animated background effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur opacity-0 
                                 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Content */}
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm
                                    group-hover:scale-110 transition-transform duration-300">
                        {card.icon}
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/70 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-white">{card.title}</h3>
                    <p className="text-sm text-white/80">{card.description}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatCard 
              title="Loan taken"
              value="$25,000"
              icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
            />
            <StatCard 
              title="My valuations"
              value="12"
              icon={<Scale className="w-5 h-5 text-emerald-400" />}
              delay={0.1}
            />
            <StatCard 
              title="Due in 30 days"
              value="$5,000"
              icon={<Clock className="w-5 h-5 text-emerald-400" />}
              delay={0.2}
            />
          </div>

          {/* Action Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-900 p-6 rounded-xl hover:bg-gray-800/50 transition-all duration-300
                         hover:shadow-lg hover:shadow-emerald-500/10 group"
            >
              <h3 className="text-xl font-semibold mb-4 group-hover:text-emerald-400 transition-colors">
                Value your IP
              </h3>
              <p className="text-gray-400 mb-4">
                Fill out an IP Valuation form and receive a valuation report by experienced IP lawyers
              </p>
              <button className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2
                               group-hover:translate-x-2 transition-transform">
                Submit <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-900 p-6 rounded-xl hover:bg-gray-800/50 transition-all duration-300
                         hover:shadow-lg hover:shadow-emerald-500/10 group"
            >
              <h3 className="text-xl font-semibold mb-4 group-hover:text-emerald-400 transition-colors">
                No IP Onramped Yet!
              </h3>
              <p className="text-gray-400 mb-4">
                Get started by filling out an IP Valuation form or acquire IP from the marketplace
              </p>
              <button className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2
                               group-hover:translate-x-2 transition-transform">
                Get Started <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <section className="mt-12">
            <h2 className="text-2xl font-semibold text-emerald-400 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {[
                {
                  title: "New IP Listed",
                  description: "Blockchain Patent #123 has been listed",
                  time: "2 hours ago",
                  icon: <Globe className="w-5 h-5" />
                },
                {
                  title: "Valuation Complete",
                  description: "Your IP valuation report is ready",
                  time: "5 hours ago",
                  icon: <Scale className="w-5 h-5" />
                }
              ].map((activity, index) => (
                <motion.div
                  key={activity.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 p-4 bg-gray-900/50 rounded-lg border 
                             border-emerald-500/10 hover:border-emerald-500/20 transition-all"
                >
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-emerald-400">{activity.title}</h3>
                    <p className="text-sm text-gray-400">{activity.description}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Quick Actions */}
          <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Quick Valuation",
                description: "Get an instant estimate",
                icon: <Zap className="w-5 h-5" />,
                color: "emerald"
              },
              {
                title: "List New IP",
                description: "Add to marketplace",
                icon: <Plus className="w-5 h-5" />,
                color: "blue"
              },
              {
                title: "Schedule Call",
                description: "Talk to an expert",
                icon: <Phone className="w-5 h-5" />,
                color: "purple"
              }
            ].map((action, index) => (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 bg-${action.color}-500/10 rounded-lg border border-${action.color}-500/20
                           hover:bg-${action.color}-500/20 transition-all group text-left`}
              >
                <div className={`p-2 bg-${action.color}-500/10 rounded-lg w-fit mb-3
                                text-${action.color}-400 group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <h3 className={`font-medium text-${action.color}-400 mb-1`}>{action.title}</h3>
                <p className="text-sm text-gray-400">{action.description}</p>
              </motion.button>
            ))}
          </section>

          {/* Market Insights */}
          <section className="mt-12">
            <h2 className="text-2xl font-semibold text-emerald-400 mb-6">Market Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gray-900/50 rounded-lg border border-emerald-500/10">
                <h3 className="text-lg font-medium text-emerald-400 mb-4">Popular Categories</h3>
                <div className="space-y-3">
                  {[
                    { name: "Blockchain Patents", value: "32%" },
                    { name: "Software IP", value: "28%" },
                    { name: "Hardware Patents", value: "24%" }
                  ].map((category) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <span className="text-gray-300">{category.name}</span>
                      <span className="text-emerald-400 font-medium">{category.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-6 bg-gray-900/50 rounded-lg border border-emerald-500/10">
                <h3 className="text-lg font-medium text-emerald-400 mb-4">Trading Volume</h3>
                {/* Add a simple chart or statistics here */}
                <div className="h-32 flex items-end gap-2">
                  {[40, 70, 45, 30, 90, 60, 80].map((height, index) => (
                    <div
                      key={index}
                      className="flex-1 bg-emerald-500/20 rounded-t transition-all hover:bg-emerald-500/30"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
} 