import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { storageService } from '../services/storageService'
import { dataService } from '../services/dataService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const session = storageService.getSession()
    if (session && storageService.isSessionValid()) {
      const user = dataService.getUserById(session.userId)
      if (user && user.accountStatus === 'active') {
        setCurrentUser(user)
        setIsAuthenticated(true)
      } else {
        storageService.clearSession()
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback((user) => {
    storageService.setSession({ userId: user.id })
    setCurrentUser(user)
    setIsAuthenticated(true)
  }, [])

  const logout = useCallback(() => {
    // Signal that a sign-out is in progress so guards don't block
    window.__bpn_signing_out = true

    storageService.clearSession()
    setCurrentUser(null)
    setIsAuthenticated(false)

    // Clear the flag after React has flushed the state changes
    setTimeout(() => {
      window.__bpn_signing_out = false
    }, 100)
  }, [])

  const refreshUser = useCallback(() => {
    if (currentUser) {
      const updated = dataService.getUserById(currentUser.id)
      if (updated) setCurrentUser(updated)
    }
  }, [currentUser])

  const value = {
    currentUser,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}