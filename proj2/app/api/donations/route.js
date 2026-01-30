import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'app', 'donations.json');
    const data = await readFile(filePath, 'utf8');
    return Response.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading donations:', error);
    return Response.json([], { status: 500 });
  }
}