import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface PromoRecord {
  id: number;
  code: string;
  price: number;
  type: number;
  is_limit: number;
  is_only_for_new_user: number;
  created_at: Date | null;
  reg_id: number;
  tld_id: number;
}

interface PriceRecord {
  id: number;
  reg_id: number;
  tld_id: number;
  registrar_name: string;
  extension_name: string;
  reg_price: number;
  renew_price: number;
  transfer_price: number;
  created_at: Date | null;
}

interface CountResult {
  total: number;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const registrar = searchParams.get('registrar');
  const extension = searchParams.get('extension');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.max(parseInt(searchParams.get('limit') || '20'), 20);
  const sortBy = searchParams.get('sortBy') || 'registrar';
  const sortOrder = searchParams.get('sortOrder') || 'asc';

  try {
    // 构建动态查询条件
    const whereConditions: string[] = [];
    
    if (registrar) {
      const regRecords = await prisma.reg.findMany({
        where: { name: { contains: registrar } }
      });
      if (regRecords.length > 0) {
        whereConditions.push(`p.reg_id IN (${regRecords.map(r => r.id).join(',')})`);
      } else {
        whereConditions.push('p.reg_id = 0');
      }
    }
    
    if (extension) {
      const tldRecords = await prisma.tld.findMany({
        where: { name: extension }
      });
      if (tldRecords.length > 0) {
        whereConditions.push(`p.tld_id IN (${tldRecords.map(t => t.id).join(',')})`);
      } else {
        whereConditions.push('p.tld_id = 0');
      }
    }

    const offset = (page - 1) * limit;
    
    // 主查询：按(reg_id, tld_id)分组取最新价格（修复点1）
    const rawQuery = `
      SELECT 
        p.*, 
        r.name as registrar_name, 
        t.name as extension_name
      FROM (
        -- 按注册商+域名后缀组合分组，取最新记录（修复点：修改PARTITION BY）
        SELECT *, 
               ROW_NUMBER() OVER (PARTITION BY reg_id, tld_id ORDER BY created_at DESC) as rn
        FROM price
      ) p
      -- 左连接：避免因关联表无数据导致记录丢失（修复点2）
      LEFT JOIN reg r ON p.reg_id = r.id
      LEFT JOIN tld t ON p.tld_id = t.id
      WHERE p.rn = 1
      ${whereConditions.length > 0 ? `AND ${whereConditions.join(' AND ')}` : ''}
      ORDER BY 
        ${sortBy === 'registrar' ? 'r.name' : 
          sortBy === 'extension' ? 't.name' : 
          sortBy === 'price' ? 'p.reg_price' : 'p.reg_price'} 
        ${sortOrder === 'asc' ? 'ASC' : 'DESC'}
      LIMIT ${limit} OFFSET ${offset}
    `;

    // 计数查询：按(reg_id, tld_id)组合统计（修复点3）
    const countQuery = `
      SELECT COUNT(DISTINCT CONCAT(reg_id, '-', tld_id)) as total  -- 兼容多数数据库的组合去重
      FROM price p
      ${whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''}
    `;

    const [prices, countResult] = await Promise.all([
      prisma.$queryRawUnsafe(rawQuery),
      prisma.$queryRawUnsafe(countQuery)
    ]);

    // 处理促销信息（逻辑不变）
    const priceRecords = prices as PriceRecord[];
    const regTldPairs = priceRecords.map(p => ({ reg_id: p.reg_id, tld_id: p.tld_id }));
    
    let allPromos: PromoRecord[] = [];
    if (regTldPairs.length > 0) {
      const promoConditions = regTldPairs.map(pair => 
        `(reg_id = ${pair.reg_id} AND tld_id = ${pair.tld_id})`
      ).join(' OR ');
      
      const promosQuery = `
        SELECT * FROM promo
        WHERE ${promoConditions}
        ORDER BY created_at DESC
      `;
      
      allPromos = await prisma.$queryRawUnsafe<PromoRecord[]>(promosQuery);
    }

    const promosMap = new Map<string, PromoRecord[]>();
    allPromos.forEach(promo => {
      const key = `${promo.reg_id}-${promo.tld_id}`;
      if (!promosMap.has(key)) {
        promosMap.set(key, []);
      }
      promosMap.get(key)!.push(promo);
    });

    // 格式化返回数据
    const formattedPrices = priceRecords.map(price => ({
      id: Number(price.id),
      registrar: price.registrar_name || 'Unknown',
      extension: price.extension_name || 'Unknown',
      registrationPrice: Number(price.reg_price),
      renewalPrice: Number(price.renew_price),
      transferPrice: Number(price.transfer_price),
      currency: 'USD',
      logo: `https://logo.clearbit.com/${price.registrar_name?.toLowerCase().replace(' ', '') || 'unknown'}.com`,
      createdAt: price.created_at,
      promos: (promosMap.get(`${price.reg_id}-${price.tld_id}`) || []).map(promo => ({
        id: Number(promo.id),
        code: promo.code || '',
        price: Number(promo.price) || 0,
        type: Number(promo.type) || 0,
        isLimited: Number(promo.is_limit) === 1,
        isOnlyForNewUser: Number(promo.is_only_for_new_user) === 1,
        createdAt: promo.created_at
      }))
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
      filters: { registrar, extension },
      message: `Found ${formattedPrices.length} price records (page ${page} of ${totalPages})`
    });
  } catch (error) {
    console.error('Error fetching prices with promos:', error);
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
      message: 'Error fetching pricing data with promotions',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
