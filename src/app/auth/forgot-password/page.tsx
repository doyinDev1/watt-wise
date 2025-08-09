"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import AuthLayout from "@/components/AuthLayout"
import axios from "axios"
import toast from "react-hot-toast"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email) {
            toast.error("Please enter your email address")
            return
        }

        setIsLoading(true)

        try {
            const response = await axios.post('/api/auth/forgot-password', { email })

            if (response.data.success) {
                setIsSubmitted(true)
                toast.success(response.data.message)
            } else {
                toast.error(response.data.message)
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error 
                ? error.message 
                : 'Failed to send reset email'
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    if (isSubmitted) {
        return (
            <AuthLayout
                title="Check Your Email"
                subtitle="We've sent you a password reset link"
                showGoogleButton={false}
            >
                <Card>
                    <CardContent className="p-6 text-center">
                        <div className="mb-6">
                            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">Email Sent!</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                We&apos;ve sent a password reset link to <strong>{email}</strong>
                            </p>
                        </div>

                        <div className="space-y-4 text-sm text-muted-foreground">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="font-medium text-blue-800 mb-1">⏰ Link expires in 15 minutes</p>
                                <p className="text-blue-600">Please check your email and click the reset link soon.</p>
                            </div>

                            <div className="space-y-2">
                                <p>Didn&apos;t receive the email?</p>
                                <ul className="text-xs space-y-1">
                                    <li>• Check your spam/junk folder</li>
                                    <li>• Make sure you entered the correct email</li>
                                    <li>• Wait a few minutes for delivery</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <Button
                                onClick={() => {
                                    setIsSubmitted(false)
                                    setEmail("")
                                }}
                                variant="outline"
                                className="w-full"
                            >
                                Try Different Email
                            </Button>

                            <Link href="/auth/login">
                                <Button variant="secondary" className="w-full">
                                    Back to Login
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </AuthLayout>
        )
    }

    return (
        <AuthLayout
            title="Forgot Password?"
            subtitle="Enter your email to receive a reset link"
            showGoogleButton={false}
        >
            <Card>
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-foreground">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Enter your email address"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                                <strong>💡 How it works:</strong><br />
                                We&apos;ll send you a secure link to reset your password. The link expires in 15 minutes for security.
                            </p>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12"
                            disabled={isLoading || !email}
                        >
                            {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="text-center text-sm">
                <span className="text-muted-foreground">Remember your password? </span>
                <Link
                    href="/auth/login"
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                    Back to Login
                </Link>
            </div>
        </AuthLayout>
    )
}