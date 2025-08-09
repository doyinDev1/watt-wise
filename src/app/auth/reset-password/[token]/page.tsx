"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import AuthLayout from "@/components/AuthLayout"
import axios from "axios"
import toast from "react-hot-toast"

export default function ResetPasswordPage() {
    const params = useParams()
    const router = useRouter()
    const token = params.token as string

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    })
    const [isLoading, setIsLoading] = useState(false)
    const [isValidating, setIsValidating] = useState(true)
    const [isValidToken, setIsValidToken] = useState(false)
    const [userEmail, setUserEmail] = useState("")
    const [passwordError, setPasswordError] = useState("")

    // Validate token on component mount
    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setIsValidating(false)
                return
            }

            try {
                const response = await axios.get(`/api/auth/reset-password?token=${token}`)

                if (response.data.success) {
                    setIsValidToken(true)
                    setUserEmail(response.data.user.email)
                } else {
                    setIsValidToken(false)
                    toast.error(response.data.message)
                }
            } catch (error: unknown) {
                setIsValidToken(false)
                const errorMessage = error instanceof Error 
                    ? error.message 
                    : 'Invalid or expired reset token'
                toast.error(errorMessage)
            } finally {
                setIsValidating(false)
            }
        }

        validateToken()
    }, [token])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        setPasswordError("")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validation
        if (!formData.password || !formData.confirmPassword) {
            setPasswordError("Please fill in all fields")
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

        setIsLoading(true)

        try {
            const response = await axios.post('/api/auth/reset-password', {
                token,
                password: formData.password
            })

            if (response.data.success) {
                toast.success(response.data.message)
                // Redirect to login after successful reset
                setTimeout(() => {
                    router.push('/auth/login')
                }, 2000)
            } else {
                toast.error(response.data.message)
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error 
                ? error.message 
                : 'Failed to reset password'
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    // Loading state while validating token
    if (isValidating) {
        return (
            <AuthLayout
                title="Validating Reset Link"
                subtitle="Please wait while we verify your reset token"
                showGoogleButton={false}
            >
                <Card>
                    <CardContent className="p-6 text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Validating your reset link...</p>
                    </CardContent>
                </Card>
            </AuthLayout>
        )
    }

    // Invalid token state
    if (!isValidToken) {
        return (
            <AuthLayout
                title="Invalid Reset Link"
                subtitle="This password reset link is invalid or expired"
                showGoogleButton={false}
            >
                <Card>
                    <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Link Expired or Invalid</h3>
                        <p className="text-muted-foreground text-sm mb-6">
                            This password reset link has expired or is invalid. Reset links are only valid for 15 minutes.
                        </p>

                        <div className="space-y-3">
                            <Link href="/auth/forgot-password">
                                <Button className="w-full">
                                    Request New Reset Link
                                </Button>
                            </Link>

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

    // Valid token - show reset form
    return (
        <AuthLayout
            title="Reset Your Password"
            subtitle={`Create a new password for ${userEmail}`}
            showGoogleButton={false}
        >
            <Card>
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-foreground">
                                New Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Enter new password"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                                Confirm New Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Confirm new password"
                                disabled={isLoading}
                            />
                        </div>

                        {passwordError && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                                {passwordError}
                            </div>
                        )}

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-sm text-green-800">
                                <strong>🔒 Password Requirements:</strong><br />
                                • At least 6 characters long<br />
                                • Can contain letters, numbers, and special characters
                            </p>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12"
                            disabled={isLoading || !formData.password || !formData.confirmPassword}
                        >
                            {isLoading ? "Resetting Password..." : "Reset Password"}
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