import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { BloodRequest } from '@/lib/models'

export async function GET(request) {
  try {
    await connectToDatabase()
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    let requests
    if (userId) {
      requests = await BloodRequest.find({ userId }).sort({ createdAt: -1 })
    } else {
      requests = await BloodRequest.find().sort({ createdAt: -1 })
    }
    
    return NextResponse.json(requests)
  } catch (error) {
    console.error('Error fetching blood requests:', error)
    return NextResponse.json(
      { message: 'Failed to fetch blood requests' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const { userId, patientName, bloodGroup, units, hospital, contact, urgency } = await request.json()
    
    await connectToDatabase()
    
    const bloodRequest = new BloodRequest({
      userId,
      patientName,
      bloodGroup,
      units,
      hospital,
      contact,
      urgency
    })
    
    await bloodRequest.save()
    
    return NextResponse.json(
      { message: 'Blood request created successfully', bloodRequest },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating blood request:', error)
    return NextResponse.json(
      { message: 'Failed to create blood request' },
      { status: 500 }
    )
  }
}