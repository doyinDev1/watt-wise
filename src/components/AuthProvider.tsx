"use client"

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useAuthStore } from '@/store/authStore'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const { checkAuth } = useAuthStore()
    const { status } = useSession()

    useEffect(() => {
        // Check if user is authenticated on app load or session change
        if (status !== 'loading') {
            checkAuth()
        }
    }, [checkAuth, status])

    return <>{children}</>
}