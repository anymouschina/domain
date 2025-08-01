import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const registrar = searchParams.get('registrar');
  const extension = searchParams.get('extension');

  try {
    // Build dynamic where conditions
    const whereConditions: any = {};
    
    if (registrar) {
      const regRecord = await prisma.reg.findFirst({
        where: { name: { contains: registrar } }
      });
      if (regRecord) {
        whereConditions.reg_id = Number(regRecord.id);
      }
    }
    
    if (extension) {
      const tldRecord = await prisma.tld.findFirst({
        where: { 
          name: extension.startsWith('.') ? extension : `.${extension}`
        }
      });
      if (tldRecord) {
        whereConditions.tld_id = Number(tldRecord.id);
      }
    }

    // Get all matching prices
    const prices = await prisma.price.findMany({
      where: Object.keys(whereConditions).length > 0 ? whereConditions : undefined,
      orderBy: [
        { reg_id: 'asc' },
        { tld_id: 'asc' },
        { reg_price: 'asc' }
      ]
    });

    // Get registrar and TLD info
    const pricesWithDetails = await Promise.all(
      prices.map(async (price) => {
        const [reg, tld] = await Promise.all([
          prisma.reg.findUnique({ where: { id: BigInt(price.reg_id) } }),
          prisma.tld.findUnique({ where: { id: BigInt(price.tld_id) } })
        ]);
        return {
          ...price,
          registrar: reg,
          tld
        };
      })
    );

    const formattedPrices = pricesWithDetails.map(price => ({
      registrar: price.registrar?.name || 'Unknown',
      extension: price.tld?.name || 'Unknown',
      registrationPrice: Number(price.reg_price),
      renewalPrice: Number(price.renew_price),
      transferPrice: Number(price.transfer_price),
      currency: 'USD',
      logo: `https://logo.clearbit.com/${price.registrar?.name?.toLowerCase().replace(' ', '') || 'unknown'}.com`
    }));

    return NextResponse.json({
      prices: formattedPrices,
      totalResults: formattedPrices.length,
      filters: { registrar, extension },
      message: `Found ${formattedPrices.length} price records`
    });
  } catch (error) {
    console.error('Error fetching prices:', error);
    return NextResponse.json({
      prices: [],
      totalResults: 0,
      message: 'Error fetching pricing data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}