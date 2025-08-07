"use client"

import { useEffect } from 'react'

// TypeScript declarations for UnicornStudio
declare global {
    interface Window {
        UnicornStudio: {
            isInitialized: boolean
            init?: () => void
        }
    }
}

export default function UnicornStudioBackground() {
    useEffect(() => {
        // Load Unicorn Studio script using the exact code provided
        if (!window.UnicornStudio) {
            window.UnicornStudio = { isInitialized: false }
            const script = document.createElement("script")
            script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js?update=1.0.1"
            script.onload = function () {
                if (!window.UnicornStudio.isInitialized && window.UnicornStudio.init) {
                    window.UnicornStudio.init()
                    window.UnicornStudio.isInitialized = true
                }
            }
            document.head.appendChild(script)
        }
    }, [])

    return (
        <div className="absolute inset-0 w-full h-full">
            <div
                data-us-project="Jpro2t1WUVnkQQDRZjP6?update=1.0.1"
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    )
} 