"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"

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
    const handleGoogleSignIn = () => {
        signIn('google', { callbackUrl: '/' })
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Image */}
            <div className="hidden lg:flex lg:w-1/2 relative">
                <Image
                    src="/images/mapImage.png"
                    alt="WattWise Solar Map"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Overlay with gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />

                {/* Logo and branding overlay */}
                <div className="absolute bottom-8 left-8 text-white">
                    <div className="text-3xl font-bold mb-2">WattWise</div>
                    <p className="text-lg opacity-90 max-w-md">
                        Empowering Nigerians with smart solar solutions for a sustainable future.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-md space-y-8">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center">
                        <div className="text-3xl font-bold text-primary mb-2">WattWise</div>
                        <p className="text-muted-foreground">
                            Smart solar solutions for Nigeria
                        </p>
                    </div>

                    {/* Header */}
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
                        <p className="text-muted-foreground mt-2">{subtitle}</p>
                    </div>

                    {/* Google Sign In Button */}
                    {showGoogleButton && (
                        <div className="space-y-4">
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
                    <div className="space-y-6">
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