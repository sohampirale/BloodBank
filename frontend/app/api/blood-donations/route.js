import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { BloodDonation } from '@/lib/models'

export async function GET(request) {
  try {
    await connectToDatabase()
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    let donations
    if (userId) {
      donations = await BloodDonation.find({ userId }).sort({ createdAt: -1 })
    } else {
      donations = await BloodDonation.find().sort({ createdAt: -1 })
    }
    
    return NextResponse.json(donations)
  } catch (error) {
    console.error('Error fetching blood donations:', error)
    return NextResponse.json(
      { message: 'Failed to fetch blood donations' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const { userId, donorName, bloodGroup, units, lastDonation, contact, location } = await request.json()
    
    await connectToDatabase()
    
    const bloodDonation = new BloodDonation({
      userId,
      donorName,
      bloodGroup,
      units,
      lastDonation,
      contact,
      location
    })
    
    await bloodDonation.save()
    
    return NextResponse.json(
      { message: 'Blood donation created successfully', bloodDonation },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating blood donation:', error)
    return NextResponse.json(
      { message: 'Failed to create blood donation' },
      { status: 500 }
    )
  }
}