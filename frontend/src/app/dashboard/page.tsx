'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
  Sun,
  LogOut,
  BanknoteIcon,
  MessageSquare,
  ArrowRightLeft
} from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import Link from 'next/link'
import OnboardingModal from '@/components/ui/onboardingmodal'
import { NotificationPopup } from '@/components/ui/notification-popup'
import { useWeb3Auth } from '@/contexts/Web3AuthContext'

interface DashboardCard {
  title: string
  description: string
  icon: React.ReactNode
  link: string
  gradient: string
}

export default function Dashboard() {
  const searchParams = useSearchParams();
  const [notifications, setNotifications] = useState(0)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const { loggedIn, isLawyer, setIsLawyer, setLoggedIn } = useWeb3Auth()
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const router = useRouter()
  
  const primaryCards: DashboardCard[] = [
    {
      title: "IP Marketplace",
      description: "Provide borrowers with liquidity, list an IP for loan, buy and sell IP",
      icon: <Globe className="w-6 h-6" />,
      link: "/dashboard/marketplace",
      gradient: "from-emerald-500 to-emerald-700"
    },
    {
      title: "Top-up wallet",
      description: "Simply pay for transactions & valuation fees, liquidity, earn rewards",
      icon: <Wallet className="w-6 h-6" />,
      link: "dashboard/top-up",
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

  const [ips, setIps] = useState<any[]>([]);
	const [address, setAddress] = useState<string>('');
	const [firstName, setFirstName] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const userInfo = window.localStorage["userInfo"];
			const _address = window.localStorage.getItem('address');
			if (userInfo) {
				try {
					const userInfoJSON = JSON.parse(userInfo);
					setFirstName(userInfoJSON.name.split(' ')[0]);
				} catch (error) {
					console.error("Error parsing userInfo from localStorage", error);
				}
			}
			if (_address) {
				try {
					setAddress(_address);
				} catch (error) {
					console.error('Error parsing userInfo from localStorage', error);
				}
			}
		}
	}, []);

	useEffect(() => {
		const fetchIps = async () => {
			if (address) {
				try {
					const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/ipTokenization/getMyIPs?address=${address}`);
					const data = await response.json();
					console.log('API Response:', data);
					setIps(data); // Handle case where forms might be undefined
				} catch (error) {
					console.error('Error fetching tokenized IPs:', error);
				} finally {
					setLoading(false);
				}
			}
		};
		fetchIps();
	}, [address]);

  const activities = [
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
    },
    {
      title: "Loan Approved",
      description: "Your IP loan request has been approved",
      time: "1 day ago",
      icon: <BanknoteIcon className="w-5 h-5" />
    },
    {
      title: "New Message",
      description: "Alice Johnson sent you a message",
      time: "2 days ago",
      icon: <MessageSquare className="w-5 h-5" />
    },
    {
      title: "IP Transfer",
      description: "Patent transfer completed successfully",
      time: "3 days ago",
      icon: <ArrowRightLeft className="w-5 h-5" />
    }
  ]

  return (
    <>
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
                Welcome
              </h1>
              <p className="text-gray-400 mt-2">
                Your gateway to Intellectual Property
              </p>
            </motion.div>
            
            <div className="flex items-center gap-4">
              {/* Login/Role Toggle Section */}
              {/* {!loggedIn ? (
                                <div className="flex items-center gap-2">
                                <motion.button
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  onClick={() => setLoggedIn(true)}
                                  className="p-2 rounded-lg transition-colors border flex items-center gap-2
                                            bg-gray-900 border-emerald-500/10 text-gray-400 hover:border-emerald-500/20"
                                >
                                  <LogOut className="w-5 h-5" />
                                  <span className="text-sm">Login</span>
                                </motion.button>
                                <motion.button
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  onClick={() => router.push('/signup')}
                                  className="p-2 rounded-lg transition-colors border flex items-center gap-2
                                            bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-600"
                                >
                                  <Plus className="w-5 h-5" />
                                  <span className="text-sm">Sign Up</span>
                                </motion.button>
                              </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Role:</span>
                  <button
                    onClick={() => setIsLawyer(!isLawyer)}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors
                               ${isLawyer 
                                 ? 'bg-emerald-500/20 text-emerald-400' 
                                 : 'bg-gray-900 text-gray-400'}`}
                  >
                    {isLawyer ? 'Lawyer' : 'Client'}
                  </button>
                </div>
              )} */}
              
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
          {!loggedIn && (
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
              {activities.map((activity, index) => (
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
        </div>
      </div>
    </div>
    {searchParams.get('showOnboardingModal') === 'true' && (
				<OnboardingModal />
			)}
    </>
  )
} 