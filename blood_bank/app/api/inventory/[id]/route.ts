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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const inventory = await BloodInventory.findById(id).populate('donors', 'name email phone');
    
    if (!inventory) {
      return NextResponse.json(
        { error: 'Blood type not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ inventory });
  } catch (error) {
    console.error('Get inventory error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const decoded = await verifyToken(request);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { quantity, location, donors } = await request.json();

    const inventory = await BloodInventory.findById(id);
    if (!inventory) {
      return NextResponse.json(
        { error: 'Blood type not found' },
        { status: 404 }
      );
    }

    const updateData: any = { lastUpdated: new Date() };
    if (quantity !== undefined) updateData.quantity = quantity;
    if (location) updateData.location = location;
    if (donors) updateData.donors = donors;

    const updatedInventory = await BloodInventory.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('donors', 'name email phone');

    return NextResponse.json({
      message: 'Inventory updated successfully',
      inventory: updatedInventory,
    });
  } catch (error) {
    console.error('Update inventory error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}