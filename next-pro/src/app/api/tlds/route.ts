import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get('name');

  try {
    // If no name provided, return latest TLDs
    if (!name) {
      const latestTLDs = await prisma.tld.findMany({
        orderBy: {
          created_at: 'desc'
        },
        take: 20
      });

      // Handle BigInt serialization issue
      const formattedTLDs = latestTLDs.map(tld => ({
        id: Number(tld.id),
        name: tld.name,
        createdAt: tld.created_at,
        updatedAt: tld.updated_at
      }));

      return NextResponse.json({
        type: 'tlds',
        tlds: formattedTLDs,
        totalResults: formattedTLDs.length,
        message: 'Latest TLDs'
      });
    }

    // If name provided, search for specific TLD
    const tld = await prisma.tld.findFirst({
      where: {
        name: name.startsWith('.') ? name : `.${name}`
      }
    });

    if (!tld) {
      return NextResponse.json({
        type: 'tld',
        tld: null,
        prices: [],
        totalResults: 0,
        message: 'TLD not found'
      });
    }

    // Get prices for this TLD
    const prices = await prisma.price.findMany({
      where: {
        tld_id: Number(tld.id)
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    // Get registrars for the prices
    const registrarIds = [...new Set(prices.map(p => p.reg_id))];
    const registrars = await prisma.reg.findMany({
      where: {
        id: { in: registrarIds.map(id => BigInt(id)) }
      }
    });

    const registrarMap = new Map(registrars.map(r => [r.id, r.name]));

    // Handle BigInt serialization issue
    const formattedTLD = {
      id: Number(tld.id),
      name: tld.name,
      createdAt: tld.created_at,
      updatedAt: tld.updated_at
    };

    const formattedPrices = prices.map(price => ({
      id: Number(price.id),
      regId: Number(price.reg_id),
      tldId: Number(price.tld_id),
      registrationPrice: Number(price.reg_price),
      renewalPrice: Number(price.renew_price),
      transferPrice: Number(price.transfer_price),
      currency: 'USD',
      registrar: registrarMap.get(BigInt(price.reg_id)) || 'Unknown',
      createdAt: price.created_at
    }));

    return NextResponse.json({
      type: 'tld',
      tld: formattedTLD,
      prices: formattedPrices,
      totalResults: formattedPrices.length,
      message: 'TLD found'
    });

  } catch (error) {
    console.error('Error fetching TLDs:', error);
    
    return NextResponse.json({
      type: 'tlds',
      tlds: [],
      totalResults: 0,
      message: 'Error fetching TLD data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}