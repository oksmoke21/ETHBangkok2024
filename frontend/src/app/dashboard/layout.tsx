'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Globe, 
  Wallet,
  History,
  Settings,
  Menu,
  X,
  LogOut,
  List,
  ListIcon,
  BanknoteIcon,
  ChevronDown,
  MessageSquare
} from 'lucide-react'
import { useContext } from 'react'
import { useWeb3Auth } from '@/contexts/Web3AuthContext'

interface MenuItem {
  icon: React.ReactNode
  label: string
  href?: string
  children?: {
    label: string
    href: string
  }[]
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { web3auth, getAccounts, loggedIn, isLawyer, setLoggedIn, setProvider } = useWeb3Auth()
  const router = useRouter()
  const pathname = usePathname()

  const menuItems: MenuItem[] = [
    { icon: <LayoutDashboard />, label: 'Dashboard', href: '/dashboard' },
    ...(loggedIn
      ? [
    ...(isLawyer ? [
      {
        icon: <Globe />,
        label: 'IP Management',
        children: [
          { label: 'My IPs', href: '/dashboard/my-ips' },
          { label: 'IP Valuation Forms', href: '/dashboard/valuation-forms' },
          { label: 'Legal Services & Consultation', href: '/dashboard/ip-services' }
        ]
      }
    ] : [
      { icon: <Globe />, label: 'Consultation', href: '/dashboard/consultation' }
    ]),
    { icon: <List/>, label: 'Register IP', href: '/dashboard/create-ip' },
    { icon: <MessageSquare />, label: 'Messages', href: '/dashboard/messages' },
    { icon: <History />, label: 'History', href: '/dashboard/history' },
    { icon: <BanknoteIcon />, label: 'Loans', href: '/dashboard/loans' },
    { icon: <Settings />, label: 'Settings', href: '/dashboard/settings' },
        ]
      : [
          { icon: <Globe />, label: 'Consultation', href: '/dashboard/consultation' }
        ]
    )
  ]

  const isActivePath = (href: string) => pathname === href

  const isDropdownActive = (item: MenuItem) => {
    if (!item.children) return false
    return item.children.some(child => pathname === child.href)
  }

  const renderMenuItem = (item: MenuItem) => {
    if (item.children) {
      return (
        <div key={item.label} className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center justify-between w-full px-4 py-3 rounded-lg
                       hover:bg-emerald-500/10 hover:text-emerald-400 
                       transition-all duration-300 group
                       ${isDropdownActive(item) ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-400'}`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg transition-all duration-300 
                            ${isDropdownActive(item) ? 'bg-emerald-500/20 scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </div>
              <span className="font-medium">{item.label}</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 
                                 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="pl-12 mt-1 space-y-1">
              {item.children.map(child => (
                <Link
                  key={child.href}
                  href={child.href}
                  className={`block px-4 py-2 rounded-lg text-sm
                             hover:bg-emerald-500/10 hover:text-emerald-400 
                             transition-all duration-300
                             ${isActivePath(child.href) ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-400'}`}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link
        key={item.label}
        href={item.href!}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                   hover:bg-emerald-500/10 hover:text-emerald-400 
                   transition-all duration-300 relative group
                   ${isActivePath(item.href!) ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-400'}`}
      >
        <div className={`p-1.5 rounded-lg transition-all duration-300 
                      ${isActivePath(item.href!) ? 'bg-emerald-500/20 scale-110' : 'group-hover:scale-110'}`}>
          {item.icon}
        </div>
        <span className="font-medium">{item.label}</span>
        {isActivePath(item.href!) && (
          <motion.div
            layoutId="activeTab"
            className="absolute left-0 w-0.5 h-full bg-gradient-to-b from-emerald-400 to-teal-400 rounded-r"
          />
        )}
      </Link>
    )
  }

  useEffect(() => {
    setIsSidebarOpen(false)
  }, [pathname])

  const handleLogout = async () => {
		if (web3auth) {
			await web3auth.logout();
			localStorage.removeItem('userInfo');
			localStorage.removeItem('address');
			router.push('/');
		}
	};

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
              {menuItems.map(renderMenuItem)}
            </div>
          </nav>

          <div className="p-4 mx-4 mb-4 border-t border-emerald-500/10">
            {loggedIn && (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-4 px-6 py-3 w-full text-gray-400
                         hover:bg-red-500/10 hover:text-red-400 rounded-lg
                         transition-all duration-300 group"
              >
                <div className="p-2 rounded-lg transition-all duration-300 group-hover:scale-110">
                  <LogOut className="w-5 h-5" />
                </div>
                <span className="font-medium">Logout</span>
              </button>
            )}
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
              {menuItems.map(renderMenuItem)}
            </div>
          </nav>

          <div className="p-4 mx-4 mb-4 border-t border-emerald-500/10">
            {loggedIn && (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-4 px-6 py-3 w-full text-gray-400
                         hover:bg-red-500/10 hover:text-red-400 rounded-lg
                         transition-all duration-300 group"
              >
                <div className="p-2 rounded-lg transition-all duration-300 group-hover:scale-110">
                  <LogOut className="w-5 h-5" />
                </div>
                <span className="font-medium">Logout</span>
              </button>
            )}
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