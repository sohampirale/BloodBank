import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Donation from '@/lib/models/donation';
import BloodInventory from '@/lib/models/bloodInventory';
import User from '@/lib/models/user';
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
    const status = searchParams.get('status');
    const donorId = searchParams.get('donorId');

    const filter: any = {};
    if (bloodType) filter.bloodType = bloodType;
    if (status) filter.status = status;
    if (donorId) filter.donorId = donorId;
    if (decoded.role !== 'admin') {
      filter.donorId = decoded.userId;
    }

    const donations = await Donation.find(filter)
      .populate('donorId', 'name email phone bloodType')
      .sort({ donationDate: -1 });

    return NextResponse.json({ donations });
  } catch (error) {
    console.error('Get donations error:', error);
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

    const { bloodType, quantity, location, notes } = await request.json();

    if (!bloodType || !quantity || !location) {
      return NextResponse.json(
        { error: 'Blood type, quantity, and location are required' },
        { status: 400 }
      );
    }

    if (quantity < 250 || quantity > 500) {
      return NextResponse.json(
        { error: 'Donation quantity must be between 250ml and 500ml' },
        { status: 400 }
      );
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.lastDonated) {
      const daysSinceLastDonation = Math.floor(
        (Date.now() - new Date(user.lastDonated).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceLastDonation < 90) {
        return NextResponse.json(
          { error: 'You must wait at least 90 days between donations' },
          { status: 400 }
        );
      }
    }

    const donation = await Donation.create({
      donorId: decoded.userId,
      bloodType,
      quantity,
      location,
      status: 'pending',
      notes,
    });

    await User.findByIdAndUpdate(decoded.userId, {
      lastDonated: new Date(),
    });

    return NextResponse.json({
      message: 'Donation submitted successfully',
      donation,
    }, { status: 201 });
  } catch (error) {
    console.error('Create donation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}