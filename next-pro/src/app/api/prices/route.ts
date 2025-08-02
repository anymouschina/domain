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
    // 获取所有符合条件的最新价格记录
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

    // 获取所有符合条件的记录，按reg_id分组获取最新的一条
    const allPrices = await prisma.price.findMany({
      where: Object.keys(whereConditions).length > 0 ? whereConditions : undefined,
      include: {
        reg: true,
        tld: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    // 按reg_id去重，保留最新的记录
    const uniquePrices = allPrices.reduce((acc, price) => {
      const key = price.reg_id;
      if (!acc[key] || acc[key].created_at < price.created_at) {
        acc[key] = price;
      }
      return acc;
    }, {} as Record<string, any>);

    const deduplicatedPrices = Object.values(uniquePrices);

    // 排序
    const sortedPrices = deduplicatedPrices.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'registrar':
          aValue = a.reg.name.toLowerCase();
          bValue = b.reg.name.toLowerCase();
          break;
        case 'extension':
          aValue = a.tld.name.toLowerCase();
          bValue = b.tld.name.toLowerCase();
          break;
        case 'price':
          aValue = Number(a.reg_price);
          bValue = Number(b.reg_price);
          break;
        default:
          aValue = a.reg.name.toLowerCase();
          bValue = b.reg.name.toLowerCase();
      }

      if (sortOrder === 'desc') {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }
    });

    // 分页
    const totalCount = sortedPrices.length;
    const totalPages = Math.ceil(totalCount / limit);
    const offset = (page - 1) * limit;
    const paginatedPrices = sortedPrices.slice(offset, offset + limit);

    const formattedPrices = paginatedPrices.map(price => ({
      id: Number(price.id),
      registrar: price.reg.name || 'Unknown',
      extension: price.tld.name || 'Unknown',
      registrationPrice: Number(price.reg_price),
      renewalPrice: Number(price.renew_price),
      transferPrice: Number(price.transfer_price),
      currency: 'USD',
      logo: `https://logo.clearbit.com/${price.reg.name?.toLowerCase().replace(' ', '') || 'unknown'}.com`,
      createdAt: price.created_at
    }));

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