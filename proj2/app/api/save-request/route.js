import { writeFile, readFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request) {
  try {
    const newRequest = await request.json();
    
    // Read current requests
    const filePath = path.join(process.cwd(), 'app', 'requests.json');
    const fileContent = await readFile(filePath, 'utf-8');
    const requests = JSON.parse(fileContent);
    
    // Add new request
    requests.unshift(newRequest);
    
    // Write back to file
    await writeFile(filePath, JSON.stringify(requests, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save request' }, { status: 500 });
  }
}