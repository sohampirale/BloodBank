import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { User } from '@/lib/models'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const { name, email, password, bloodGroup, phone, isAdmin } = await request.json()

    await connectToDatabase()

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      name,
      email,
      password: hashedPassword,
      bloodGroup,
      phone,
      isAdmin: isAdmin || false
    })

    await user.save()

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      bloodGroup: user.bloodGroup,
      phone: user.phone,
      isAdmin: user.isAdmin
    }

    return NextResponse.json(
      { message: 'User registered successfully', user: userResponse },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Registration failed' },
      { status: 500 }
    )
  }
}