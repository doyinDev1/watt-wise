import { NextRequest, NextResponse } from 'next/server'
import { createPasswordResetToken, hasPendingResetToken } from '@/lib/passwordReset'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Check if user has a pending reset token (rate limiting)
    const hasPending = await hasPendingResetToken(email)
    if (hasPending) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'A password reset email was already sent. Please check your inbox or wait 15 minutes before requesting again.' 
        },
        { status: 429 }
      )
    }

    // Create reset token
    const result = await createPasswordResetToken(email)
    
    if (!result.success) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { 
          success: true, 
          message: 'If an account with that email exists, we\'ve sent a password reset link.' 
        },
        { status: 200 }
      )
    }

    // Send reset email
    const emailResult = await sendPasswordResetEmail(
      result.user!.email,
      result.resetToken!,
      result.user!.name
    )

    if (!emailResult.success) {
      console.error('Failed to send reset email:', emailResult.error)
      return NextResponse.json(
        { success: false, message: 'Failed to send reset email. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Password reset email sent! Please check your inbox and follow the instructions.' 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { success: false, message: 'An error occurred. Please try again.' },
      { status: 500 }
    )
  }
}