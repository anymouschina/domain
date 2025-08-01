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

      return NextResponse.json({
        type: 'tlds',
        tlds: latestTLDs,
        totalResults: latestTLDs.length,
        message: 'Latest TLDs'
      });
    }

    // If name provided, search for specific TLD
    const tld = await prisma.tld.findFirst({
      where: {
        name: name.startsWith('.') ? name : `.${name}`
      },
      include: {
        prices: {
          include: {
            reg: true
          }
        }
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

    return NextResponse.json({
      type: 'tld',
      tld: tld,
      prices: tld.prices,
      totalResults: tld.prices.length,
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