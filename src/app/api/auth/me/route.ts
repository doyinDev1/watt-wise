import { NextRequest, NextResponse } from 'next/server'
import { verifyJWTToken } from '@/lib/auth'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'

export async function GET(request: NextRequest) {
  try {
    let user = null

    // First try NextAuth session
    const session = await getServerSession()
    if (session?.user?.email) {
      user = await db.user.findUnique({
        where: { email: session.user.email },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true
        }
      })
    }

    // If no NextAuth session, try JWT token
    if (!user) {
      const token = request.cookies.get('auth-token')?.value
      if (token) {
        try {
          const payload = verifyJWTToken(token)
          user = await db.user.findUnique({
            where: { id: payload.userId },
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
              emailVerified: true,
              createdAt: true,
              updatedAt: true
            }
          })
        } catch (jwtError) {
          // JWT verification failed, continue
        }
      }
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No valid authentication found' },
        { status: 401 }
      )
    }

    return NextResponse.json({ 
      success: true,
      user 
    })

  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}