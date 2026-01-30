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

    const filter: any = {};
    if (bloodType) filter.bloodType = bloodType;

    const inventory = await BloodInventory.find(filter).sort({ bloodType: 1 });

    return NextResponse.json({ inventory });
  } catch (error) {
    console.error('Get inventory error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const decoded = await verifyToken(request);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { bloodType, quantity, location } = await request.json();

    if (!bloodType || quantity === undefined || !location) {
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

    if (quantity < 0) {
      return NextResponse.json(
        { error: 'Quantity cannot be negative' },
        { status: 400 }
      );
    }

    const existingInventory = await BloodInventory.findOne({ bloodType });
    
    if (existingInventory) {
      existingInventory.quantity += quantity;
      existingInventory.lastUpdated = new Date();
      if (location !== existingInventory.location) {
        existingInventory.location = location;
      }
      await existingInventory.save();

      return NextResponse.json({
        message: 'Inventory updated successfully',
        inventory: existingInventory,
      });
    } else {
      const newInventory = await BloodInventory.create({
        bloodType,
        quantity,
        location,
      });

      return NextResponse.json({
        message: 'Inventory created successfully',
        inventory: newInventory,
      }, { status: 201 });
    }
  } catch (error) {
    console.error('Create inventory error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}