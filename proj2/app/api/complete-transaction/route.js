import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request) {
  try {
    const { type, id } = await request.json();

    const filePath = join(process.cwd(), 'app');
    
    let sourceFile, sourceData;
    
    if (type === 'donation') {
      sourceFile = join(filePath, 'donations.json');
      sourceData = JSON.parse(await readFile(sourceFile, 'utf8'));
    } else if (type === 'request') {
      sourceFile = join(filePath, 'requests.json');
      sourceData = JSON.parse(await readFile(sourceFile, 'utf8'));
    } else {
      return Response.json({ error: 'Invalid type' }, { status: 400 });
    }

    const itemIndex = sourceData.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return Response.json({ error: 'Item not found' }, { status: 404 });
    }

    const completedItem = sourceData.splice(itemIndex, 1)[0];
    completedItem.completedAt = new Date().toISOString();
    completedItem.uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    await writeFile(sourceFile, JSON.stringify(sourceData, null, 2));

    const transactionsFile = join(filePath, 'transactions.json');
    let transactionsData;
    
    try {
      transactionsData = JSON.parse(await readFile(transactionsFile, 'utf8'));
    } catch (error) {
      transactionsData = [];
    }

    transactionsData.push(completedItem);
    await writeFile(transactionsFile, JSON.stringify(transactionsData, null, 2));

    return Response.json({ success: true });
    
  } catch (error) {
    console.error('Error completing transaction:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}