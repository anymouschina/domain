import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface CheapestPriceRecord {
  id: number;
  registrar_name: string;
  tld_name: string;
  reg_price: number;
  renew_price: number;
  transfer_price: number;
  created_at: Date;
}

interface CountResult {
  total: number;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 20);
  const sortBy = searchParams.get('sortBy') || 'tld';
  const sortOrder = searchParams.get('sortOrder') || 'asc';
  const tldName = searchParams.get('tldName');

  try {
    const offset = (page - 1) * limit;

    // Build base query conditions
    let whereClause = 'WHERE p.rn = 1';
    let countWhereClause = '';
    
    if (tldName) {
      whereClause = `WHERE p.rn = 1 AND t.name LIKE '%${tldName}%'`;
      countWhereClause = `WHERE t.name LIKE '%${tldName}%'`;
    }

    // Use window function to get the cheapest price for each TLD (sorted by registration price)
    const rawQuery = `
      SELECT p.*, r.name as registrar_name, t.name as tld_name
      FROM (
        SELECT *, 
               ROW_NUMBER() OVER (PARTITION BY tld_id ORDER BY reg_price ASC) as rn
        FROM price
      ) p
      JOIN reg r ON p.reg_id = r.id
      JOIN tld t ON p.tld_id = t.id
      ${whereClause}
      ORDER BY ${sortBy === 'tld' ? 't.name' : sortBy === 'registrar' ? 'r.name' : 'p.reg_price'} ${sortOrder === 'asc' ? 'ASC' : 'DESC'}
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countQuery = `
      SELECT COUNT(DISTINCT tld_id) as total
      FROM (
        SELECT *, 
               ROW_NUMBER() OVER (PARTITION BY tld_id ORDER BY reg_price ASC) as rn
        FROM price
      ) p
      JOIN tld t ON p.tld_id = t.id
      ${countWhereClause}
    `;

    const [cheapestPrices, countResult] = await Promise.all([
      prisma.$queryRawUnsafe(rawQuery),
      prisma.$queryRawUnsafe(countQuery)
    ]);

    const formattedPrices = (cheapestPrices as CheapestPriceRecord[]).map(price => ({
      id: Number(price.id),
      registrar: price.registrar_name || 'Unknown',
      tld: price.tld_name || 'Unknown',
      registrationPrice: Number(price.reg_price),
      renewalPrice: Number(price.renew_price),
      transferPrice: Number(price.transfer_price),
      currency: 'USD',
      createdAt: price.created_at
    }));

    const totalCount = Number((countResult as CountResult[])[0].total);
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      prices: formattedPrices,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      message: `Found ${formattedPrices.length} cheapest TLD records (page ${page} of ${totalPages})`
    });
  } catch (error) {
    console.error('Error fetching cheapest TLDs:', error);
    
    return NextResponse.json({
      prices: [],
      pagination: {
        page: 1,
        limit: 20,
        totalCount: 0,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      },
      message: 'Error fetching cheapest TLD data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}