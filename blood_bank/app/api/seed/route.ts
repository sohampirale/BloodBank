import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/user';
import BloodInventory from '@/lib/models/bloodInventory';
import bcryptjs from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Create admin user
    const adminEmail = 'admin@bloodbank.com';
    const adminPassword = 'admin123';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcryptjs.hash(adminPassword, 12);
      await User.create({
        name: 'Admin User',
        email: adminEmail,
        phone: '1234567890',
        bloodType: 'O+',
        password: hashedPassword,
        role: 'admin',
      });
    }

    // Initialize blood inventory
    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    
    for (const bloodType of bloodTypes) {
      const existingInventory = await BloodInventory.findOne({ bloodType });
      if (!existingInventory) {
        await BloodInventory.create({
          bloodType,
          quantity: Math.floor(Math.random() * 2000) + 500, // 500-2500ml
          location: 'Main Center',
        });
      }
    }

    return NextResponse.json({ 
      message: 'Database seeded successfully',
      admin: {
        email: adminEmail,
        password: adminPassword
      }
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}