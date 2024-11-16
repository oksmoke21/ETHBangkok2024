import { motion } from 'framer-motion'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  delay?: number
}

export function StatCard({ title, value, icon, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="relative group"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 
                    rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative p-6 bg-gray-900/90 backdrop-blur-sm rounded-lg border border-emerald-500/20 
                    hover:border-emerald-500/40 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
          <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:scale-110 
                        group-hover:bg-emerald-500/20 transition-all duration-300">
            {icon}
          </div>
        </div>
        <p className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 
                     bg-clip-text text-transparent">
          {value}
        </p>
      </div>
    </motion.div>
  )
} 