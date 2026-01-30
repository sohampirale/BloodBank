import { writeFile, readFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request) {
  try {
    const newDonation = await request.json();
    
    // Read current donations
    const filePath = path.join(process.cwd(), 'app', 'donations.json');
    const fileContent = await readFile(filePath, 'utf-8');
    const donations = JSON.parse(fileContent);
    
    // Add new donation
    donations.unshift(newDonation);
    
    // Write back to file
    await writeFile(filePath, JSON.stringify(donations, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save donation' }, { status: 500 });
  }
}