'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react';
import { MessageSquare, Shield, Scale, FileText } from 'lucide-react'

export default function IPServices() {
  const [lawyers, setLawyers] = useState([]);
  
  // useEffect(() => {
  //   const fetchIps = async () => {
  //     try {
  //       const address = localStorage.getItem('address');
  //       if (!address) return;

  //       const response = await fetch(
  //         `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/ipTokenization/getMyIPs?address=${address}`
  //       );
  //       const data = await response.json();
  //       setIps(data || []);
  //     } catch (error) {
  //       console.error('Error fetching IPs:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchIps();
  // }, []);

  const services = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: 'Legal Consultation',
      description: 'Get expert advice on IP protection and strategy',
      action: 'Schedule Call'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'IP Protection',
      description: 'Comprehensive IP protection services',
      action: 'Learn More'
    },
    {
      icon: <Scale className="w-6 h-6" />,
      title: 'Dispute Resolution',
      description: 'Professional IP dispute handling',
      action: 'Get Support'
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Documentation',
      description: 'Complete IP documentation services',
      action: 'Start Process'
    }
  ]

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 
                      bg-clip-text text-transparent">
          IP Services
        </h1>
        <p className="text-gray-400 mt-2">
          Professional IP services and consultation
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/50 rounded-lg border border-emerald-500/10 p-6
                     hover:border-emerald-500/30 transition-colors group"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400
                           group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-emerald-400">{service.title}</h3>
                <p className="text-gray-400 mt-1">{service.description}</p>
                <button className="mt-4 text-sm text-emerald-400 hover:text-emerald-300
                                 flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                  {service.action}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 