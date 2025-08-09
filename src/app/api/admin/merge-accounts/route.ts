import { NextRequest, NextResponse } from 'next/server'
import { mergeDuplicateAccounts } from '@/lib/accountLinking'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      )
    }

    const result = await mergeDuplicateAccounts(email)

    return NextResponse.json(result, {
      status: result.success ? 200 : 500
    })

  } catch (error) {
    console.error('Merge accounts error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}