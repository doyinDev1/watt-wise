import crypto from 'crypto'
import { db } from './db'

/**
 * Generate a secure reset token
 */
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Create password reset token and save to database
 */
export async function createPasswordResetToken(email: string) {
  try {
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, name: true, email: true }
    })

    if (!user) {
      return {
        success: false,
        message: 'User not found'
      }
    }

    // Generate secure token
    const resetToken = generateResetToken()
    
    // Set expiry to 15 minutes from now
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000)

    // Update user with reset token
    await db.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })

    return {
      success: true,
      resetToken,
      user: {
        name: user.name || 'User',
        email: user.email
      }
    }
  } catch (error) {
    console.error('Error creating password reset token:', error)
    return {
      success: false,
      message: 'Failed to generate reset token'
    }
  }
}

/**
 * Validate reset token and return user if valid
 */
export async function validateResetToken(token: string) {
  try {
    const user = await db.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date() // Token must not be expired
        }
      },
      select: {
        id: true,
        email: true,
        name: true,
        resetToken: true,
        resetTokenExpiry: true
      }
    })

    if (!user) {
      return {
        success: false,
        message: 'Invalid or expired reset token'
      }
    }

    return {
      success: true,
      user
    }
  } catch (error) {
    console.error('Error validating reset token:', error)
    return {
      success: false,
      message: 'Failed to validate token'
    }
  }
}

/**
 * Clear reset token after successful password reset
 */
export async function clearResetToken(userId: string) {
  try {
    await db.user.update({
      where: { id: userId },
      data: {
        resetToken: null,
        resetTokenExpiry: null
      }
    })
    return { success: true }
  } catch (error) {
    console.error('Error clearing reset token:', error)
    return {
      success: false,
      message: 'Failed to clear reset token'
    }
  }
}

/**
 * Check if user has pending reset token
 */
export async function hasPendingResetToken(email: string): Promise<boolean> {
  try {
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        resetToken: true,
        resetTokenExpiry: true
      }
    })

    if (!user || !user.resetToken || !user.resetTokenExpiry) {
      return false
    }

    // Check if token is still valid (not expired)
    return user.resetTokenExpiry > new Date()
  } catch (error) {
    console.error('Error checking pending reset token:', error)
    return false
  }
}