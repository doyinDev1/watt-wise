"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import AuthLayout from "@/components/AuthLayout"
import { useAuthStore } from "@/store/authStore"

export default function SignupPage() {
    const router = useRouter()
    const { register, isLoading, user, clearError } = useAuthStore()

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const [passwordError, setPasswordError] = useState("")

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            router.push('/')
        }
    }, [user, router])

    // Clear error when component mounts or form changes
    useEffect(() => {
        clearError()
        setPasswordError("")
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

        // Validation
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setPasswordError("Passwords do not match")
            return
        }

        if (formData.password.length < 6) {
            setPasswordError("Password must be at least 6 characters long")
            return
        }

        try {
            const success = await register(formData.email, formData.password, formData.name)
            if (success) {
                router.push('/')
            }
        } catch {
            // Error is handled by the store
        }
    }

    return (
        <AuthLayout
            title="Join WattWise"
            subtitle="Create your account to get started"
            showGoogleButton={true}
        >
            <Card>
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium text-foreground">
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Enter your full name"
                            />
                        </div>

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
                                placeholder="Create a password"
                            />
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Confirm your password"
                            />
                        </div>

                        {/* Password Error Only */}
                        {passwordError && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                                {passwordError}
                            </div>
                        )}

                        {/* Terms */}
                        <div className="text-xs text-muted-foreground">
                            By creating an account, you agree to our{" "}
                            <Link href="/terms" className="text-primary hover:text-primary/80 transition-colors">
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="text-primary hover:text-primary/80 transition-colors">
                                Privacy Policy
                            </Link>
                            .
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full h-12"
                            disabled={
                                isLoading ||
                                !formData.name ||
                                !formData.email ||
                                !formData.password ||
                                !formData.confirmPassword
                            }
                        >
                            {isLoading ? "Creating account..." : "Create Account"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Sign In Link */}
            <div className="text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link
                    href="/auth/login"
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                    Sign in
                </Link>
            </div>
        </AuthLayout>
    )
}