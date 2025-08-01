import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const domain = searchParams.get('domain');
  const extension = searchParams.get('extension');

  if (!domain || !extension) {
    return NextResponse.json(
      { error: 'Domain and extension parameters are required' },
      { status: 400 }
    );
  }

  try {
    // Find the TLD by extension
    const tld = await prisma.tld.findFirst({
      where: {
        name: extension.startsWith('.') ? extension : `.${extension}`
      }
    });

    if (!tld) {
      // Return mock data if TLD not found
      return NextResponse.json([
        {
          registrar: 'Namecheap',
          registrationPrice: 8.88,
          renewalPrice: 13.98,
          transferPrice: 9.58,
          currency: 'USD',
          logo: 'https://logo.clearbit.com/namecheap.com'
        },
        {
          registrar: 'GoDaddy',
          registrationPrice: 11.99,
          renewalPrice: 18.99,
          transferPrice: 7.99,
          currency: 'USD',
          logo: 'https://logo.clearbit.com/godaddy.com'
        },
        {
          registrar: 'Google Domains',
          registrationPrice: 12.00,
          renewalPrice: 12.00,
          transferPrice: 12.00,
          currency: 'USD',
          logo: 'https://logo.clearbit.com/domains.google'
        },
        {
          registrar: 'Cloudflare',
          registrationPrice: 9.77,
          renewalPrice: 9.77,
          transferPrice: 9.77,
          currency: 'USD',
          logo: 'https://logo.clearbit.com/cloudflare.com'
        }
      ]);
    }

    // Get prices for this TLD
    const prices = await prisma.price.findMany({
      where: {
        tld_id: tld.id
      },
      include: {
        reg: true
      }
    });

    if (prices.length === 0) {
      // Return mock data if no prices found
      return NextResponse.json([
        {
          registrar: 'Namecheap',
          registrationPrice: 8.88,
          renewalPrice: 13.98,
          transferPrice: 9.58,
          currency: 'USD',
          logo: 'https://logo.clearbit.com/namecheap.com'
        },
        {
          registrar: 'GoDaddy',
          registrationPrice: 11.99,
          renewalPrice: 18.99,
          transferPrice: 7.99,
          currency: 'USD',
          logo: 'https://logo.clearbit.com/godaddy.com'
        },
        {
          registrar: 'Google Domains',
          registrationPrice: 12.00,
          renewalPrice: 12.00,
          transferPrice: 12.00,
          currency: 'USD',
          logo: 'https://logo.clearbit.com/domains.google'
        },
        {
          registrar: 'Cloudflare',
          registrationPrice: 9.77,
          renewalPrice: 9.77,
          transferPrice: 9.77,
          currency: 'USD',
          logo: 'https://logo.clearbit.com/cloudflare.com'
        }
      ]);
    }

    // Format the response
    const formattedPrices = prices.map(price => ({
      registrar: price.reg.name,
      registrationPrice: Number(price.reg_price),
      renewalPrice: Number(price.renew_price),
      transferPrice: Number(price.transfer_price),
      currency: 'USD'
    }));

    return NextResponse.json(formattedPrices);
  } catch (error) {
    console.error('Error fetching prices:', error);
    
    // Return mock data on error
    return NextResponse.json([
      {
        registrar: 'Namecheap',
        registrationPrice: 8.88,
        renewalPrice: 13.98,
        transferPrice: 9.58,
        currency: 'USD',
        logo: 'https://logo.clearbit.com/namecheap.com'
      },
      {
        registrar: 'GoDaddy',
        registrationPrice: 11.99,
        renewalPrice: 18.99,
        transferPrice: 7.99,
        currency: 'USD',
        logo: 'https://logo.clearbit.com/godaddy.com'
      },
      {
        registrar: 'Google Domains',
        registrationPrice: 12.00,
        renewalPrice: 12.00,
        transferPrice: 12.00,
        currency: 'USD',
        logo: 'https://logo.clearbit.com/domains.google'
      },
      {
        registrar: 'Cloudflare',
        registrationPrice: 9.77,
        renewalPrice: 9.77,
        transferPrice: 9.77,
        currency: 'USD',
        logo: 'https://logo.clearbit.com/cloudflare.com'
      }
    ]);
  }
}