import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { User } from '@/lib/models'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    await connectToDatabase()

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      bloodGroup: user.bloodGroup,
      phone: user.phone,
      isAdmin: user.isAdmin
    }

    return NextResponse.json(
      { message: 'Sign in successful', user: userResponse },
      { status: 200 }
    )
  } catch (error) {
    console.error('Sign in error:', error)
    return NextResponse.json(
      { message: 'Sign in failed' },
      { status: 500 }
    )
  }
}