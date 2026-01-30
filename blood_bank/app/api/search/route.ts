import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BloodInventory from '@/lib/models/bloodInventory';
import jwt from 'jsonwebtoken';

async function verifyToken(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any;
    return decoded;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const bloodType = searchParams.get('bloodType');
    const location = searchParams.get('location');
    const minQuantity = searchParams.get('minQuantity');

    const filter: any = {};
    
    if (bloodType) {
      filter.bloodType = bloodType;
    }
    
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    
    if (minQuantity) {
      const quantity = parseInt(minQuantity);
      if (!isNaN(quantity) && quantity > 0) {
        filter.quantity = { $gte: quantity };
      }
    }

    const inventory = await BloodInventory.find(filter)
      .sort({ quantity: -1 })
      .populate('donors', 'name email phone');

    return NextResponse.json({
      results: inventory,
      count: inventory.length,
    });
  } catch (error) {
    console.error('Search blood error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { bloodType, quantity, location, urgency, notes } = await request.json();

    if (!bloodType || !quantity || !location) {
      return NextResponse.json(
        { error: 'Blood type, quantity, and location are required' },
        { status: 400 }
      );
    }

    const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    if (!validBloodTypes.includes(bloodType)) {
      return NextResponse.json(
        { error: 'Invalid blood type' },
        { status: 400 }
      );
    }

    const availableBlood = await BloodInventory.find({
      bloodType,
      quantity: { $gte: quantity },
      location: { $regex: location, $options: 'i' }
    });

    if (availableBlood.length === 0) {
      return NextResponse.json({
        message: 'No matching blood available at the specified location',
        available: false,
        alternatives: await BloodInventory.find({
          bloodType,
          quantity: { $gte: quantity }
        }).sort({ quantity: -1 }).limit(3)
      });
    }

    return NextResponse.json({
      message: 'Blood request submitted successfully',
      request: {
        bloodType,
        quantity,
        location,
        urgency: urgency || 'normal',
        notes,
        requestedBy: decoded.userId,
        status: 'pending'
      },
      available: true,
      availableBlood,
    }, { status: 201 });
  } catch (error) {
    console.error('Submit request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}