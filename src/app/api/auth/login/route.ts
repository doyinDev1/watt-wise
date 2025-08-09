import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, findUserByEmail, createJWTToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user (normalize email to lowercase)
    const user = await findUserByEmail(email.toLowerCase())
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if user has a password (not OAuth user)
    if (!user.password) {
      return NextResponse.json(
        { success: false, message: 'Please sign in with Google' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = createJWTToken({
      userId: user.id,
      email: user.email
    })

    // Get fresh user data from database (in case it was updated by OAuth)
    const freshUser = await findUserByEmail(user.email)
    
    // Create response with token
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: freshUser?.id || user.id,
        email: freshUser?.email || user.email,
        name: freshUser?.name || user.name,
        emailVerified: freshUser?.emailVerified || user.emailVerified,
        createdAt: freshUser?.createdAt || user.createdAt
      }
    })

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}