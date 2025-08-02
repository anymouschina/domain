import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const registrar = searchParams.get('registrar');
  const extension = searchParams.get('extension');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 20);
  const sortBy = searchParams.get('sortBy') || 'registrar';
  const sortOrder = searchParams.get('sortOrder') || 'asc';

  try {
    // Build dynamic WHERE conditions
    const whereConditions: string[] = [];
    
    if (registrar) {
      const regRecords = await prisma.reg.findMany({
        where: { name: { contains: registrar } }
      });
      if (regRecords.length > 0) {
        whereConditions.push(`reg_id IN (${regRecords.map(r => r.id).join(',')})`);
      } else {
        // If no matching registrar found, add an impossible condition
        whereConditions.push('reg_id = 0');
      }
    }
    
    if (extension) {
      const tldRecords = await prisma.tld.findMany({
        where: { 
          name: extension
        }
      });
      if (tldRecords.length > 0) {
        whereConditions.push(`tld_id IN (${tldRecords.map(t => t.id).join(',')})`);
      } else {
        // If no matching domain extension found, add an impossible condition
        whereConditions.push('tld_id = 0');
      }
    }

    // Use window function to get the latest record for each reg_id (performance optimized version)
    const offset = (page - 1) * limit;
    
    const rawQuery = `
      SELECT p.*, r.name as registrar_name, t.name as extension_name
      FROM (
        SELECT *, 
               ROW_NUMBER() OVER (PARTITION BY reg_id ORDER BY created_at DESC) as rn
        FROM price
        ${whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''}
      ) p
      JOIN reg r ON p.reg_id = r.id
      JOIN tld t ON p.tld_id = t.id
      WHERE p.rn = 1
      ORDER BY ${sortBy === 'registrar' ? 'r.name' : sortBy === 'extension' ? 't.name' : 'p.reg_price'} ${sortOrder === 'asc' ? 'ASC' : 'DESC'}
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countQuery = `
      SELECT COUNT(DISTINCT reg_id) as total
      FROM price
      ${whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''}
    `;

    const [prices, countResult] = await Promise.all([
      prisma.$queryRawUnsafe(rawQuery),
      prisma.$queryRawUnsafe(countQuery)
    ]);

    const formattedPrices = (prices as any[]).map(price => ({
      id: Number(price.id),
      registrar: price.registrar_name || 'Unknown',
      extension: price.extension_name || 'Unknown',
      registrationPrice: Number(price.reg_price),
      renewalPrice: Number(price.renew_price),
      transferPrice: Number(price.transfer_price),
      currency: 'USD',
      logo: `https://logo.clearbit.com/${price.registrar_name?.toLowerCase().replace(' ', '') || 'unknown'}.com`,
      createdAt: price.created_at
    }));

    const totalCount = Number((countResult as any[])[0].total);
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
      filters: { registrar, extension },
      message: `Found ${formattedPrices.length} price records (page ${page} of ${totalPages})`
    });
  } catch (error) {
    console.error('Error fetching prices:', error);
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
      message: 'Error fetching pricing data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}