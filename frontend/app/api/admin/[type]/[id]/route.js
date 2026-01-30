import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase()
    
    const { type, id } = params
    
    let Model
    
    switch (type) {
      case 'users':
        Model = (await import('@/lib/models')).User
        break
      case 'blood-requests':
        Model = (await import('@/lib/models')).BloodRequest
        break
      case 'blood-donations':
        Model = (await import('@/lib/models')).BloodDonation
        break
      default:
        return NextResponse.json(
          { message: 'Invalid type' },
          { status: 400 }
        )
    }
    
    const item = await Model.findById(id)
    if (!item) {
      return NextResponse.json(
        { message: `${type} not found` },
        { status: 404 }
      )
    }
    
    await Model.findByIdAndDelete(id)
    
    return NextResponse.json(
      { message: `${type} deleted successfully` },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting item:', error)
    return NextResponse.json(
      { message: 'Failed to delete item' },
      { status: 500 }
    )
  }
}