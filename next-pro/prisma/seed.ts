import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 清空现有数据
  await prisma.price.deleteMany();
  await prisma.tld.deleteMany();
  await prisma.reg.deleteMany();

  // 创建TLD
  const tlds = [
    { name: '.com', status: 1 },
    { name: '.net', status: 1 },
    { name: '.org', status: 1 },
    { name: '.io', status: 1 },
    { name: '.co', status: 1 },
    { name: '.ai', status: 1 },
  ];

  const createdTlds = await Promise.all(
    tlds.map(tld => 
      prisma.tld.create({
        data: tld,
      })
    )
  );

  // 创建注册商
  const registrars = [
    { name: 'Namecheap', status: 1, icann_fee: 0.18 },
    { name: 'GoDaddy', status: 1, icann_fee: 0.18 },
    { name: 'Google Domains', status: 1, icann_fee: 0.18 },
    { name: 'Cloudflare', status: 1, icann_fee: 0.18 },
    { name: 'Name.com', status: 1, icann_fee: 0.18 },
  ];

  const createdRegs = await Promise.all(
    registrars.map(reg => 
      prisma.reg.create({
        data: reg,
      })
    )
  );

  // 创建价格数据
  const prices = [];
  
  // .com 价格
  createdRegs.forEach(reg => {
    prices.push({
      reg_id: Number(reg.id),
      tld_id: Number(createdTlds[0].id),
      reg_price: reg.name === 'Namecheap' ? 8.88 : reg.name === 'GoDaddy' ? 11.99 : reg.name === 'Google Domains' ? 12.00 : reg.name === 'Cloudflare' ? 9.77 : 10.99,
      renew_price: reg.name === 'Namecheap' ? 13.98 : reg.name === 'GoDaddy' ? 18.99 : reg.name === 'Google Domains' ? 12.00 : reg.name === 'Cloudflare' ? 9.77 : 12.99,
      transfer_price: reg.name === 'Namecheap' ? 9.58 : reg.name === 'GoDaddy' ? 7.99 : reg.name === 'Google Domains' ? 12.00 : reg.name === 'Cloudflare' ? 9.77 : 10.99,
      created_at: new Date(),
      updated_at: new Date(),
    });
  });

  // .net 价格
  createdRegs.forEach(reg => {
    prices.push({
      reg_id: Number(reg.id),
      tld_id: Number(createdTlds[1].id),
      reg_price: reg.name === 'Namecheap' ? 9.98 : reg.name === 'GoDaddy' ? 12.99 : reg.name === 'Google Domains' ? 12.00 : reg.name === 'Cloudflare' ? 10.77 : 11.99,
      renew_price: reg.name === 'Namecheap' ? 14.98 : reg.name === 'GoDaddy' ? 19.99 : reg.name === 'Google Domains' ? 12.00 : reg.name === 'Cloudflare' ? 10.77 : 13.99,
      transfer_price: reg.name === 'Namecheap' ? 10.58 : reg.name === 'GoDaddy' ? 8.99 : reg.name === 'Google Domains' ? 12.00 : reg.name === 'Cloudflare' ? 10.77 : 11.99,
      created_at: new Date(),
      updated_at: new Date(),
    });
  });

  // .org 价格
  createdRegs.forEach(reg => {
    prices.push({
      reg_id: Number(reg.id),
      tld_id: Number(createdTlds[2].id),
      reg_price: reg.name === 'Namecheap' ? 7.48 : reg.name === 'GoDaddy' ? 9.99 : reg.name === 'Google Domains' ? 12.00 : reg.name === 'Cloudflare' ? 8.77 : 9.99,
      renew_price: reg.name === 'Namecheap' ? 14.98 : reg.name === 'GoDaddy' ? 20.99 : reg.name === 'Google Domains' ? 12.00 : reg.name === 'Cloudflare' ? 8.77 : 14.99,
      transfer_price: reg.name === 'Namecheap' ? 10.58 : reg.name === 'GoDaddy' ? 8.99 : reg.name === 'Google Domains' ? 12.00 : reg.name === 'Cloudflare' ? 8.77 : 10.99,
      created_at: new Date(),
      updated_at: new Date(),
    });
  });

  await Promise.all(
    prices.map(price => 
      prisma.price.create({
        data: price,
      })
    )
  );

  console.log('Database seeded successfully!');
  console.log('Created:');
  console.log('-', createdTlds.length, 'TLDs');
  console.log('-', createdRegs.length, 'registrars');
  console.log('-', prices.length, 'prices');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });