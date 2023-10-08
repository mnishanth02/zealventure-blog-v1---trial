import dbConnect from '@/lib/dbConnect'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest, response: NextResponse) => {
  try {
    await dbConnect()

    return NextResponse.json('success', { status: 200 })
  } catch (error: any) {
    console.log('error-> ', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
