import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const domain = searchParams.get('domain');
  const extension = searchParams.get('extension');

  // If no domain or extension provided, return latest registrars
  if (!domain || !extension) {
    try {
      const latestRegistrars = await prisma.reg.findMany({
        orderBy: {
          created_at: 'desc'
        },
        take: 20
      });

      return NextResponse.json({
        type: 'registrars',
        registrars: latestRegistrars,
        totalResults: latestRegistrars.length,
        message: 'Latest registrars'
      });
    } catch (error) {
      console.error('Error fetching registrars:', error);
      return NextResponse.json({
        type: 'registrars',
        registrars: [],
        totalResults: 0,
        message: 'Error fetching registrars'
      }, { status: 500 });
    }
  }

  try {
    // Find the TLD by extension
    const tld = await prisma.tld.findFirst({
      where: {
        name: extension.startsWith('.') ? extension : `.${extension}`
      }
    });

    if (!tld) {
      return NextResponse.json({
        domain: `${domain}${extension}`,
        tld: extension,
        searchQuery: { domain, extension },
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
      include: {
        reg: true
      }
    });

    if (prices.length === 0) {
      return NextResponse.json({
        domain: `${domain}${extension}`,
        tld: extension,
        searchQuery: { domain, extension },
        prices: [],
        totalResults: 0,
        message: 'No pricing data found for this TLD'
      });
    }

    // Format the response
    const formattedPrices = prices.map(price => ({
      registrar: price.reg.name,
      registrationPrice: Number(price.reg_price),
      renewalPrice: Number(price.renew_price),
      transferPrice: Number(price.transfer_price),
      currency: 'USD',
      logo: `https://logo.clearbit.com/${price.reg.name.toLowerCase().replace(' ', '')}.com`
    }));

    return NextResponse.json({
      domain: `${domain}${extension}`,
      tld: extension,
      searchQuery: { domain, extension },
      prices: formattedPrices,
      totalResults: formattedPrices.length
    });
  } catch (error) {
    console.error('Error fetching prices:', error);
    
    return NextResponse.json({
      domain: `${domain}${extension}`,
      tld: extension,
      searchQuery: { domain, extension },
      prices: [],
      totalResults: 0,
      message: 'Error fetching pricing data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}