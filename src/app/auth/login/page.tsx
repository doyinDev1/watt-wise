"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import AuthLayout from "@/components/AuthLayout"
import { useAuthStore } from "@/store/authStore"

export default function LoginPage() {
    const router = useRouter()
    const { login, isLoading, error, user, clearError } = useAuthStore()

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            router.push('/')
        }
    }, [user, router])

    // Clear error when component mounts or form changes
    useEffect(() => {
        clearError()
    }, [clearError, formData])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.email || !formData.password) {
            return
        }

        try {
            const success = await login(formData.email, formData.password)
            if (success) {
                router.push('/')
            }
        } catch {
            // Error is handled by the store
        }
    }

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Sign in to your WattWise account"
            showGoogleButton={true}
        >
            <Card>
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-foreground">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Enter your email"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-foreground">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Enter your password"
                            />
                        </div>



                        {/* Forgot Password */}
                        <div className="text-right">
                            <Link
                                href="/auth/forgot-password"
                                className="text-sm text-primary hover:text-primary/80 transition-colors"
                            >
                                Forgot your password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full h-12"
                            disabled={isLoading || !formData.email || !formData.password}
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Sign Up Link */}
            <div className="text-center text-sm">
                <span className="text-muted-foreground">Don&apos;t have an account? </span>
                <Link
                    href="/auth/signup"
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                    Sign up
                </Link>
            </div>
        </AuthLayout>
    )
}