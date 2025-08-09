import { db } from './db'

/**
 * Merge duplicate user accounts by email
 * Useful for fixing existing duplicate accounts
 */
export async function mergeDuplicateAccounts(email: string) {
  try {
    // Find all users with this email (case-insensitive)
    const users = await db.user.findMany({
      where: { 
        email: {
          mode: 'insensitive',
          equals: email
        }
      },
      include: {
        accounts: true,
        sessions: true,
      },
    })

    if (users.length <= 1) {
      console.log(`No duplicates found for ${email}`)
      return { success: true, message: 'No duplicates found' }
    }

    // Keep the oldest user (first created)
    const primaryUser = users.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )[0]

    const duplicateUsers = users.filter(user => user.id !== primaryUser.id)

    console.log(`Merging ${duplicateUsers.length} duplicate accounts for ${email}`)

    // Move all accounts and sessions to primary user
    for (const duplicateUser of duplicateUsers) {
      // Update accounts
      await db.account.updateMany({
        where: { userId: duplicateUser.id },
        data: { userId: primaryUser.id },
      })

      // Update sessions
      await db.session.updateMany({
        where: { userId: duplicateUser.id },
        data: { userId: primaryUser.id },
      })

      // Delete the duplicate user
      await db.user.delete({
        where: { id: duplicateUser.id },
      })
    }

    // Update primary user with any missing info
    const hasPassword = primaryUser.password !== null
    const hasGoogleAccount = primaryUser.accounts.some(acc => acc.provider === 'google')

    // If primary user doesn't have a name but duplicate did, update it
    const userWithName = users.find(u => u.name && u.name.trim() !== '')
    if (!primaryUser.name && userWithName?.name) {
      await db.user.update({
        where: { id: primaryUser.id },
        data: { name: userWithName.name },
      })
    }

    return {
      success: true,
      message: `Successfully merged ${duplicateUsers.length} accounts`,
      primaryUserId: primaryUser.id,
      hasPassword,
      hasGoogleAccount,
    }
  } catch (error) {
    console.error('Error merging duplicate accounts:', error)
    return {
      success: false,
      message: 'Failed to merge accounts',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Check if an email has duplicate accounts
 */
export async function checkForDuplicates(email: string) {
  const count = await db.user.count({
    where: { email },
  })
  return count > 1
}