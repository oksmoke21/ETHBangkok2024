'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Globe, 
  Wallet,
  History,
  Settings,
  Menu,
  X,
  LogOut
} from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    { icon: <LayoutDashboard />, label: 'Dashboard', href: '/dashboard' },
    { icon: <Globe />, label: 'IP Management', href: '/dashboard/ip' },
    { icon: <Wallet />, label: 'IP Loans', href: '/dashboard/loans' },
    { icon: <History />, label: 'History', href: '/dashboard/history' },
    { icon: <Settings />, label: 'Settings', href: '/dashboard/settings' },
  ]

  useEffect(() => {
    setIsSidebarOpen(false)
  }, [pathname])

  return (
    <div className="flex min-h-screen bg-gray-950">
      {/* Sidebar - Always visible on desktop */}
      <div className="hidden lg:block w-72 min-h-screen fixed left-0 top-0">
        <motion.aside
          initial={false}
          animate={{ opacity: 1 }}
          className="w-full h-full bg-gradient-to-b from-gray-900/95 via-gray-900/95 to-gray-950/95
                     border-r border-emerald-500/10 shadow-2xl shadow-emerald-500/5"
        >
          <div className="p-8 border-b border-emerald-500/10">
            <Link href="/" className="block group">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative flex items-center gap-2"
              >
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 
                              bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
                  IPSphere
                </h1>
                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 
                              blur-lg -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            </Link>
          </div>

          <nav className="flex-1 py-8 px-4">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.href
                
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-4 px-4 py-3 rounded-lg
                               hover:bg-emerald-500/10 hover:text-emerald-400 
                               transition-all duration-300 relative group
                               ${isActive ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-400'}`}
                  >
                    <div className={`p-2 rounded-lg transition-all duration-300 
                                  ${isActive ? 'bg-emerald-500/20 scale-110' : 'group-hover:scale-110'}`}>
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-teal-400 rounded-r"
                      />
                    )}
                  </Link>
                )
              })}
            </div>
          </nav>

          <div className="p-4 mx-4 mb-4 border-t border-emerald-500/10">
            <button 
              className="flex items-center gap-4 px-6 py-3 w-full text-gray-400
                       hover:bg-red-500/10 hover:text-red-400 rounded-lg
                       transition-all duration-300 group"
            >
              <div className="p-2 rounded-lg transition-all duration-300 group-hover:scale-110">
                <LogOut className="w-5 h-5" />
              </div>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </motion.aside>
      </div>

      {/* Mobile sidebar - Shown when menu is clicked */}
      {isSidebarOpen && (
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b 
                     from-gray-900/95 via-gray-900/95 to-gray-950/95"
        >
          <div className="p-8 border-b border-emerald-500/10">
            <Link href="/" className="block group">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative flex items-center gap-2"
              >
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 
                              bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
                  IPSphere
                </h1>
                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 
                              blur-lg -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            </Link>
          </div>

          <nav className="flex-1 py-8 px-4">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.href
                
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-4 px-4 py-3 rounded-lg
                               hover:bg-emerald-500/10 hover:text-emerald-400 
                               transition-all duration-300 relative group
                               ${isActive ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-400'}`}
                  >
                    <div className={`p-2 rounded-lg transition-all duration-300 
                                  ${isActive ? 'bg-emerald-500/20 scale-110' : 'group-hover:scale-110'}`}>
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-teal-400 rounded-r"
                      />
                    )}
                  </Link>
                )
              })}
            </div>
          </nav>

          <div className="p-4 mx-4 mb-4 border-t border-emerald-500/10">
            <button 
              className="flex items-center gap-4 px-6 py-3 w-full text-gray-400
                       hover:bg-red-500/10 hover:text-red-400 rounded-lg
                       transition-all duration-300 group"
            >
              <div className="p-2 rounded-lg transition-all duration-300 group-hover:scale-110">
                <LogOut className="w-5 h-5" />
              </div>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </motion.aside>
      )}

      {/* Main content - Pushed to the right on desktop */}
      <main className="flex-1 lg:ml-72">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}