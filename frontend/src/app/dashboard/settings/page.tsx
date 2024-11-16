'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Shield, Save } from 'lucide-react'

interface UserSettings {
  notifications: {
    email: boolean
    push: boolean
  }
  security: {
    twoFactor: boolean
  }
}

export default function Settings() {
  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      email: true,
      push: true
    },
    security: {
      twoFactor: false
    }
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 
                        bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-gray-400 mt-2">
            Manage your preferences
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors
                    ${isSaving 
                      ? 'bg-gray-700 text-gray-300' 
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="space-y-6">
        {/* Notifications */}
        <section className="bg-gray-900/50 rounded-lg border border-emerald-500/10 p-6">
          <h2 className="text-lg font-medium text-emerald-400 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </h2>
          
          <div className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-gray-300 capitalize">{key} Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        [key]: e.target.checked
                      }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer 
                                peer-checked:bg-emerald-500 peer-checked:after:translate-x-full 
                                after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                after:bg-white after:rounded-full after:h-5 after:w-5 
                                after:transition-all"></div>
                </label>
              </div>
            ))}
          </div>
        </section>

        {/* Security */}
        <section className="bg-gray-900/50 rounded-lg border border-emerald-500/10 p-6">
          <h2 className="text-lg font-medium text-emerald-400 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security
          </h2>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-300">Two-Factor Authentication</span>
              <p className="text-sm text-gray-400">
                Add an extra layer of security
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.security.twoFactor}
                onChange={(e) => setSettings({
                  ...settings,
                  security: {
                    ...settings.security,
                    twoFactor: e.target.checked
                  }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 rounded-full peer 
                            peer-checked:bg-emerald-500 peer-checked:after:translate-x-full 
                            after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                            after:bg-white after:rounded-full after:h-5 after:w-5 
                            after:transition-all"></div>
            </label>
          </div>
        </section>
      </div>
    </div>
  )
} 