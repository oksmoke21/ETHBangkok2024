'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AuthContextType {
  isLoggedIn: boolean
  isLawyer: boolean
  setIsLoggedIn: (value: boolean) => void
  setIsLawyer: (value: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isLoggedIn') === 'true'
    }
    return false
  })
  
  const [isLawyer, setIsLawyer] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isLawyer') === 'true'
    }
    return false
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isLoggedIn', 'false')
      localStorage.setItem('isLawyer', 'false')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn.toString())
  }, [isLoggedIn])

  useEffect(() => {
    localStorage.setItem('isLawyer', isLawyer.toString())
  }, [isLawyer])

  const handleSetIsLoggedIn = (value: boolean) => {
    setIsLoggedIn(value)
    if (!value) {
      setIsLawyer(false)
      localStorage.removeItem('myIPs')
      localStorage.setItem('isLoggedIn', 'false')
      localStorage.setItem('isLawyer', 'false')
    }
  }

  return (
    <AuthContext.Provider 
      value={{ 
        isLoggedIn, 
        isLawyer, 
        setIsLoggedIn: handleSetIsLoggedIn, 
        setIsLawyer 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 