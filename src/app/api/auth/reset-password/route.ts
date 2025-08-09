import { NextRequest, NextResponse } from 'next/server'
import { validateResetToken, clearResetToken } from '@/lib/passwordReset'
import { hashPassword } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { success: false, message: 'Token and password are required' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Validate reset token
    const tokenResult = await validateResetToken(token)
    if (!tokenResult.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    const user = tokenResult.user!

    // Hash new password
    const hashedPassword = await hashPassword(password)

    // Update user password
    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword
      }
    })

    // Clear reset token
    await clearResetToken(user.id)

    return NextResponse.json(
      { 
        success: true, 
        message: 'Password reset successful! You can now log in with your new password.' 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { success: false, message: 'An error occurred. Please try again.' },
      { status: 500 }
    )
  }
}

// GET endpoint to validate token without resetting password
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token is required' },
        { status: 400 }
      )
    }

    // Validate reset token
    const result = await validateResetToken(token)
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Token is valid',
        user: {
          email: result.user!.email,
          name: result.user!.name
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Validate token error:', error)
    return NextResponse.json(
      { success: false, message: 'An error occurred while validating token' },
      { status: 500 }
    )
  }
}