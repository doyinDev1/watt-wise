"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { gsap } from "gsap"

interface AuthLayoutProps {
    children: React.ReactNode
    title: string
    subtitle: string
    showGoogleButton?: boolean
}

export default function AuthLayout({
    children,
    title,
    subtitle,
    showGoogleButton = true
}: AuthLayoutProps) {
    const [isMounted, setIsMounted] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const sunRef = useRef<HTMLDivElement>(null)
    const solarPanelsRef = useRef<HTMLDivElement>(null)
    const energyWavesRef = useRef<HTMLDivElement>(null)
    const gridRef = useRef<HTMLDivElement>(null)
    const textContentRef = useRef<HTMLDivElement>(null)
    const formRef = useRef<HTMLDivElement>(null)

    const handleGoogleSignIn = () => {
        signIn('google', { callbackUrl: '/' })
    }

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (!isMounted) return

        // Check if we're on mobile - if so, just show elements without animation
        const isMobile = window.innerWidth < 768

        const ctx = gsap.context(() => {
            if (isMobile) {
                // On mobile: just show everything immediately, no animations
                gsap.set([sunRef.current, solarPanelsRef.current, energyWavesRef.current, textContentRef.current, formRef.current], {
                    opacity: 1,
                    scale: 1,
                    x: 0,
                    y: 0
                })
                return
            }

            // Desktop only: Check if animations have already run (prevent re-running on route changes)
            const hasAnimated = localStorage.getItem('authLayoutAnimated')

            // If already animated, just show elements without animation
            if (hasAnimated) {
                gsap.set([sunRef.current, solarPanelsRef.current, energyWavesRef.current, textContentRef.current, formRef.current], {
                    opacity: 1,
                    scale: 1,
                    x: 0,
                    y: 0
                })
                return
            }

            // Initial setup - hide all elements
            gsap.set([sunRef.current, solarPanelsRef.current, energyWavesRef.current, textContentRef.current, formRef.current], {
                opacity: 0,
                scale: 0.8
            })

            // Create main timeline for desktop
            const tl = gsap.timeline()

            // 1. Animate the background gradient
            tl.fromTo(containerRef.current,
                {
                    background: "linear-gradient(45deg, #10b981, #10b981)"
                },
                {
                    background: "linear-gradient(135deg, #4ade80, #22c55e, #16a34a)",
                    duration: 2,
                    ease: "power2.out"
                }
            )

                // 2. Animate the grid with stagger
                .to(gridRef.current?.children || [], {
                    opacity: 0.3,
                    scale: 1,
                    duration: 0.1,
                    stagger: {
                        grid: [8, 8],
                        from: "center",
                        amount: 1.5
                    },
                    ease: "back.out(1.7)"
                }, "-=1.5")

                // 3. Dramatic sun entrance
                .to(sunRef.current, {
                    opacity: 1,
                    scale: 1,
                    duration: 1,
                    ease: "elastic.out(1, 0.5)",
                    onComplete: () => {
                        // Continuous sun glow animation
                        gsap.to(sunRef.current, {
                            boxShadow: "0 0 60px rgba(253, 224, 71, 0.8)",
                            duration: 2,
                            repeat: -1,
                            yoyo: true,
                            ease: "sine.inOut"
                        })
                    }
                }, "-=1")

                // 4. Solar panels flying in from different directions
                .to(solarPanelsRef.current?.children || [], {
                    opacity: 1,
                    scale: 1,
                    rotation: (i) => [12, -6, 6][i] || 0,
                    x: 0,
                    y: 0,
                    duration: 1.2,
                    stagger: 0.3,
                    ease: "back.out(1.7)",
                    onComplete: () => {
                        // Floating animation for panels
                        gsap.to(solarPanelsRef.current?.children || [], {
                            y: "random(-20, 20)",
                            rotation: "+=random(-5, 5)",
                            duration: "random(3, 5)",
                            repeat: -1,
                            yoyo: true,
                            ease: "sine.inOut",
                            stagger: 0.5
                        })
                    }
                }, "-=0.5")

                // 5. Energy waves expanding from center
                .to(energyWavesRef.current, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    onComplete: () => {
                        // Continuous energy pulses
                        gsap.to(energyWavesRef.current?.children || [], {
                            scale: 2,
                            opacity: 0,
                            duration: 2,
                            repeat: -1,
                            stagger: 0.7,
                            ease: "power2.out"
                        })
                    }
                }, "-=0.3")

                // 6. Text content sliding up with dramatic effect
                .to(textContentRef.current, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1,
                    ease: "back.out(1.7)"
                }, "-=0.5")

                // 7. Form sliding in from right
                .to(formRef.current, {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    duration: 1,
                    ease: "back.out(1.7)"
                }, "-=0.8")

            // Continuous background animations
            gsap.to(containerRef.current, {
                backgroundPosition: "200% 200%",
                duration: 10,
                repeat: -1,
                ease: "none"
            })

            // Parallax effect on scroll
            const handleMouseMove = (e: MouseEvent) => {
                const { clientX, clientY } = e
                const x = (clientX / window.innerWidth - 0.5) * 20
                const y = (clientY / window.innerHeight - 0.5) * 20

                gsap.to(sunRef.current, {
                    x: x * 0.5,
                    y: y * 0.5,
                    duration: 0.5,
                    ease: "power2.out"
                })

                gsap.to(solarPanelsRef.current?.children || [], {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.8,
                    ease: "power2.out"
                })
            }

            window.addEventListener('mousemove', handleMouseMove)

            // Mark as animated to prevent re-running
            localStorage.setItem('authLayoutAnimated', 'true')

            return () => {
                window.removeEventListener('mousemove', handleMouseMove)
            }
        }, containerRef)

        return () => {
            ctx.revert()
        }
    }, [isMounted])

    // Removed the children animation effect to prevent animation on every keystroke

    return (
        <div className="h-screen flex overflow-hidden">
            {/* Left Side - EPIC Solar Themed Background */}
            <div
                ref={containerRef}
                className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-green-400 via-green-500 to-green-600 overflow-hidden"
                style={{ backgroundSize: '400% 400%' }}
            >
                {/* Animated Solar Panel Grid */}
                <div className="absolute inset-0 opacity-20">
                    <div
                        ref={gridRef}
                        className="grid grid-cols-8 gap-2 h-full p-8 transform rotate-12"
                    >
                        {Array.from({ length: 64 }).map((_, i) => (
                            <div
                                key={i}
                                className="bg-white/30 rounded-sm opacity-0 scale-0"
                            />
                        ))}
                    </div>
                </div>

                {/* Floating Solar Elements */}
                <div className="absolute inset-0">
                    {/* EPIC Sun with Rays */}
                    <div
                        ref={sunRef}
                        className="absolute top-16 right-16 w-24 h-24 opacity-0 scale-0 z-20"
                    >
                        <div className="relative w-full h-full">
                            {/* Sun Rays (behind) */}
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute w-1 h-8 bg-yellow-400/70 rounded-full z-10"
                                    style={{
                                        top: '-16px',
                                        left: '50%',
                                        transformOrigin: 'bottom center',
                                        transform: `translateX(-50%) rotate(${i * 45}deg)`
                                    }}
                                />
                            ))}

                            {/* Sun Core */}
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 via-yellow-300 to-orange-400 rounded-full shadow-2xl z-20 border-2 border-yellow-100"
                                style={{
                                    boxShadow: '0 0 40px rgba(253, 224, 71, 0.6), inset 0 2px 8px rgba(255, 255, 255, 0.3)'
                                }}
                            />
                        </div>
                    </div>

                    {/* Floating Solar Panels */}
                    <div ref={solarPanelsRef} className="absolute inset-0">
                        <div className="absolute top-32 left-12 w-20 h-14 opacity-0 scale-0">
                            <div className="w-full h-full bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg shadow-xl transform rotate-12">
                                <div className="grid grid-cols-3 gap-1 p-1 h-full">
                                    {Array.from({ length: 9 }).map((_, i) => (
                                        <div key={i} className="bg-blue-700/50 rounded-sm" />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="absolute top-48 left-20 w-24 h-16 opacity-0 scale-0">
                            <div className="w-full h-full bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg shadow-xl transform -rotate-6">
                                <div className="grid grid-cols-4 gap-1 p-1 h-full">
                                    {Array.from({ length: 12 }).map((_, i) => (
                                        <div key={i} className="bg-blue-700/50 rounded-sm" />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-32 right-20 w-18 h-13 opacity-0 scale-0">
                            <div className="w-full h-full bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg shadow-xl transform rotate-6">
                                <div className="grid grid-cols-3 gap-1 p-1 h-full">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className="bg-blue-700/50 rounded-sm" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Epic Energy Waves */}
                    <div
                        ref={energyWavesRef}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0"
                    >
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div
                                key={i}
                                className="absolute border-2 border-white/40 rounded-full"
                                style={{
                                    width: `${80 + i * 40}px`,
                                    height: `${80 + i * 40}px`,
                                    top: `${-40 - i * 20}px`,
                                    left: `${-40 - i * 20}px`,
                                }}
                            />
                        ))}
                    </div>

                    {/* Floating Energy Particles */}
                    <div className="absolute inset-0 overflow-hidden">
                        {Array.from({ length: 20 }).map((_, i) => {
                            // Fixed positions to prevent hydration mismatch
                            const positions = [
                                { top: '10%', left: '15%' }, { top: '25%', left: '80%' }, { top: '40%', left: '20%' },
                                { top: '60%', left: '70%' }, { top: '75%', left: '30%' }, { top: '90%', left: '85%' },
                                { top: '20%', left: '50%' }, { top: '35%', left: '10%' }, { top: '55%', left: '90%' },
                                { top: '15%', left: '65%' }, { top: '45%', left: '40%' }, { top: '65%', left: '15%' },
                                { top: '85%', left: '55%' }, { top: '30%', left: '75%' }, { top: '50%', left: '25%' },
                                { top: '70%', left: '60%' }, { top: '95%', left: '40%' }, { top: '5%', left: '35%' },
                                { top: '80%', left: '10%' }, { top: '25%', left: '95%' }
                            ]
                            const position = positions[i] || { top: '50%', left: '50%' }
                            return (
                                <div
                                    key={i}
                                    className="absolute w-2 h-2 bg-yellow-300/60 rounded-full animate-pulse"
                                    style={{
                                        top: position.top,
                                        left: position.left,
                                        animationDelay: `${i * 0.15}s`,
                                        animationDuration: `${2 + (i % 3)}s`
                                    }}
                                />
                            )
                        })}
                    </div>
                </div>

                {/* Epic Text Content */}
                <div
                    ref={textContentRef}
                    className="absolute bottom-8 left-8 right-8 text-white z-10 opacity-0 transform translate-y-8"
                >
                    <div className="backdrop-blur-sm bg-black/20 rounded-2xl p-6">
                        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-yellow-300 to-green-300 bg-clip-text text-transparent">
                            ⚡ Power Your Future
                        </h2>
                        <p className="text-lg opacity-90 leading-relaxed mb-4">
                            Join thousands of Nigerians who have already switched to clean, affordable solar energy with WattWise.
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                🌍 Eco-Friendly
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                                💰 Cost Savings
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                                🔋 Reliable Power
                            </span>
                        </div>
                    </div>
                </div>

                {/* Dynamic Background Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-background overflow-y-auto">
                <div
                    ref={formRef}
                    className="w-full max-w-md space-y-6 opacity-0 transform translate-x-8 my-auto"
                >
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center">
                        <div className="text-3xl font-bold text-primary mb-2">WattWise</div>
                        <p className="text-muted-foreground">
                            Smart solar solutions for Nigeria
                        </p>
                    </div>

                    {/* Header */}
                    <div className="text-center">
                        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{title}</h1>
                        <p className="text-muted-foreground mt-1">{subtitle}</p>
                    </div>

                    {/* Google Sign In Button */}
                    {showGoogleButton && (
                        <div className="space-y-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full h-12 border-border hover:bg-muted"
                                onClick={handleGoogleSignIn}
                            >
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Continue with Google
                            </Button>

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-background text-muted-foreground">or</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form Content */}
                    <div className="space-y-4">
                        {children}
                    </div>

                    {/* Footer */}
                    <div className="text-center text-sm text-muted-foreground">
                        <p>&copy; 2025 WattWise. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}