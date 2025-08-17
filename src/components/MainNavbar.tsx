import { useAuthStore } from '@/store/authStore'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const Navbar = () => {
  const { user, logout, isLoading } = useAuthStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  useEffect(() => {
    // Close dropdowns when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.user-menu') && !target.closest('.mobile-menu')) {
        setIsUserMenuOpen(false)
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-primary">
              WattWise
            </div>
          </div>

          {/* Center Navigation - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-foreground/80 hover:text-foreground transition-colors">
              How it Works
            </a>
            <a href="#pricing" className="text-foreground/80 hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#benefits" className="text-foreground/80 hover:text-foreground transition-colors">
              Benefits
            </a>
            <a href="#faqs" className="text-foreground/80 hover:text-foreground transition-colors">
              FAQs
            </a>
            <a href="#contact" className="text-foreground/80 hover:text-foreground transition-colors">
              Contact
            </a>
          </div>

          {/* CTA Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative user-menu">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <Avatar
                    src={user.image || undefined}
                    alt={user.name || 'User'}
                    fallback={user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    className="h-8 w-8"
                  />
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-md shadow-lg z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-muted-foreground border-b border-border">
                        {user.name || 'User'}
                      </div>
                      <button
                        onClick={() => {
                          logout()
                          setIsUserMenuOpen(false)
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Logging out...' : 'Logout'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login">
                <Button variant="secondary" size="sm">
                  Login
                </Button>
              </Link>
            )}
            <Link href="/calculator">
              <Button size="sm">
                Get Estimate
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden mobile-menu">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-foreground hover:text-primary transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                <a href="#how-it-works" className="block text-foreground/80 hover:text-foreground transition-colors py-2">
                  How it Works
                </a>
                <a href="#pricing" className="block text-foreground/80 hover:text-foreground transition-colors py-2">
                  Pricing
                </a>
                <a href="#benefits" className="block text-foreground/80 hover:text-foreground transition-colors py-2">
                  Benefits
                </a>
                <a href="#faqs" className="block text-foreground/80 hover:text-foreground transition-colors py-2">
                  FAQs
                </a>
                <a href="#contact" className="block text-foreground/80 hover:text-foreground transition-colors py-2">
                  Contact
                </a>
              </div>

              {/* Mobile Calculator & History Links */}
              <div className="space-y-2 pt-2 border-t border-border">
                <Link href="/calculator" className="block text-foreground/80 hover:text-foreground transition-colors py-2">
                  Calculator
                </Link>
                <Link href="/calculator/history" className="block text-foreground/80 hover:text-foreground transition-colors py-2">
                  History
                </Link>
              </div>

              {/* Mobile Auth Section */}
              <div className="pt-2 border-t border-border">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 py-2">
                      <Avatar
                        src={user.image || undefined}
                        alt={user.name || 'User'}
                        fallback={user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        className="h-8 w-8"
                      />
                      <span className="text-sm text-muted-foreground">{user.name || 'User'}</span>
                    </div>
                    <button
                      onClick={() => {
                        logout()
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full text-left text-sm text-foreground hover:text-primary transition-colors py-2"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Logging out...' : 'Logout'}
                    </button>
                  </div>
                ) : (
                  <Link href="/auth/login">
                    <Button variant="secondary" size="sm" className="w-full">
                      Login
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar