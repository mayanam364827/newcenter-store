import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Upsert all series
  const seriesData = [
    { key: 'XSM', name: 'iPhone XS Max', order: 1 },
    { key: '11', name: 'iPhone 11', order: 2 },
    { key: '12', name: 'iPhone 12', order: 3 },
    { key: '13', name: 'iPhone 13', order: 4 },
    { key: '14', name: 'iPhone 14', order: 5 },
    { key: '15', name: 'iPhone 15', order: 6 },
    { key: '16', name: 'iPhone 16', order: 7 },
    { key: '17', name: 'iPhone 17', order: 8 },
    { key: '17PRM', name: 'iPhone 17 Pro Max', order: 9 },
  ];

  for (const s of seriesData) {
    await prisma.series.upsert({
      where: { key: s.key },
      update: { name: s.name, order: s.order },
      create: s,
    });
  }

  const series = await prisma.series.findMany();
  const byKey = Object.fromEntries(series.map((s) => [s.key, s.id]));

  // Clear existing models for clean seed
  await prisma.model.deleteMany({});

  const models = [
    // iPhone XS Max
    {
      seriesId: byKey['XSM'],
      name: 'iPhone XS Max 64GB',
      price: 3_200_000,
      storages: ['64GB'],
      colors: ['Đen', 'Trắng', 'Vàng'],
      status: 'in_stock',
      note: 'Máy cũ 90%, pin 85%',
      imageUrl: '',
    },
    {
      seriesId: byKey['XSM'],
      name: 'iPhone XS Max 256GB',
      price: 4_000_000,
      storages: ['256GB'],
      colors: ['Đen', 'Trắng', 'Vàng'],
      status: 'in_stock',
      note: 'Máy cũ 92%, pin 88%',
      imageUrl: '',
    },
    {
      seriesId: byKey['XSM'],
      name: 'iPhone XS Max 512GB',
      price: 4_800_000,
      storages: ['512GB'],
      colors: ['Đen', 'Vàng'],
      status: 'out_of_stock',
      note: 'Hàng hiếm',
      imageUrl: '',
    },

    // iPhone 11
    {
      seriesId: byKey['11'],
      name: 'iPhone 11 64GB',
      price: 4_500_000,
      storages: ['64GB'],
      colors: ['Đen', 'Trắng', 'Đỏ', 'Xanh Lá', 'Vàng', 'Tím'],
      status: 'in_stock',
      note: 'Máy cũ 90%, pin 90%',
      imageUrl: '',
    },
    {
      seriesId: byKey['11'],
      name: 'iPhone 11 128GB',
      price: 5_200_000,
      storages: ['128GB'],
      colors: ['Đen', 'Trắng', 'Đỏ', 'Xanh Lá'],
      status: 'in_stock',
      note: 'Máy cũ 95%',
      imageUrl: '',
    },
    {
      seriesId: byKey['11'],
      name: 'iPhone 11 256GB',
      price: 6_000_000,
      storages: ['256GB'],
      colors: ['Đen', 'Trắng'],
      status: 'in_stock',
      note: 'Máy cũ 95%, pin 92%',
      imageUrl: '',
    },

    // iPhone 12
    {
      seriesId: byKey['12'],
      name: 'iPhone 12 64GB',
      price: 6_500_000,
      storages: ['64GB'],
      colors: ['Đen', 'Trắng', 'Đỏ', 'Xanh Lam', 'Xanh Lá'],
      status: 'in_stock',
      note: 'Máy cũ 95%, pin 90%',
      imageUrl: '',
    },
    {
      seriesId: byKey['12'],
      name: 'iPhone 12 128GB',
      price: 7_500_000,
      storages: ['128GB'],
      colors: ['Đen', 'Trắng', 'Đỏ', 'Xanh Lam'],
      status: 'in_stock',
      note: 'Máy cũ 96%, pin 93%',
      imageUrl: '',
    },
    {
      seriesId: byKey['12'],
      name: 'iPhone 12 256GB',
      price: 8_800_000,
      storages: ['256GB'],
      colors: ['Đen', 'Trắng'],
      status: 'out_of_stock',
      note: '',
      imageUrl: '',
    },

    // iPhone 13
    {
      seriesId: byKey['13'],
      name: 'iPhone 13 128GB',
      price: 9_000_000,
      storages: ['128GB'],
      colors: ['Đen', 'Trắng', 'Đỏ', 'Xanh Lam', 'Hồng', 'Xanh Lá'],
      status: 'in_stock',
      note: 'Máy cũ 97%',
      imageUrl: '',
    },
    {
      seriesId: byKey['13'],
      name: 'iPhone 13 256GB',
      price: 10_500_000,
      storages: ['256GB'],
      colors: ['Đen', 'Trắng', 'Đỏ', 'Xanh Lam'],
      status: 'in_stock',
      note: 'Máy cũ 97%, pin 95%',
      imageUrl: '',
    },
    {
      seriesId: byKey['13'],
      name: 'iPhone 13 512GB',
      price: 13_000_000,
      storages: ['512GB'],
      colors: ['Đen', 'Trắng'],
      status: 'in_stock',
      note: '',
      imageUrl: '',
    },

    // iPhone 14
    {
      seriesId: byKey['14'],
      name: 'iPhone 14 128GB',
      price: 13_500_000,
      storages: ['128GB'],
      colors: ['Đen', 'Trắng', 'Đỏ', 'Xanh Lam', 'Vàng', 'Tím'],
      status: 'in_stock',
      note: 'Máy mới 99%',
      imageUrl: '',
    },
    {
      seriesId: byKey['14'],
      name: 'iPhone 14 256GB',
      price: 15_500_000,
      storages: ['256GB'],
      colors: ['Đen', 'Trắng', 'Xanh Lam', 'Tím'],
      status: 'in_stock',
      note: 'Máy mới 99%',
      imageUrl: '',
    },
    {
      seriesId: byKey['14'],
      name: 'iPhone 14 512GB',
      price: 18_000_000,
      storages: ['512GB'],
      colors: ['Đen', 'Trắng'],
      status: 'out_of_stock',
      note: '',
      imageUrl: '',
    },

    // iPhone 15
    {
      seriesId: byKey['15'],
      name: 'iPhone 15 128GB',
      price: 16_500_000,
      storages: ['128GB'],
      colors: ['Đen', 'Trắng', 'Hồng', 'Vàng', 'Xanh Lam'],
      status: 'in_stock',
      note: 'Chính hãng VN/A',
      imageUrl: '',
    },
    {
      seriesId: byKey['15'],
      name: 'iPhone 15 256GB',
      price: 18_500_000,
      storages: ['256GB'],
      colors: ['Đen', 'Trắng', 'Hồng', 'Vàng'],
      status: 'in_stock',
      note: 'Chính hãng VN/A',
      imageUrl: '',
    },
    {
      seriesId: byKey['15'],
      name: 'iPhone 15 512GB',
      price: 22_000_000,
      storages: ['512GB'],
      colors: ['Đen', 'Trắng'],
      status: 'in_stock',
      note: 'Chính hãng VN/A',
      imageUrl: '',
    },

    // iPhone 16
    {
      seriesId: byKey['16'],
      name: 'iPhone 16 128GB',
      price: 19_990_000,
      storages: ['128GB'],
      colors: ['Đen', 'Trắng', 'Hồng', 'Xanh', 'Tím'],
      status: 'in_stock',
      note: 'Chính hãng VN/A, bảo hành 12 tháng',
      imageUrl: '',
    },
    {
      seriesId: byKey['16'],
      name: 'iPhone 16 256GB',
      price: 22_990_000,
      storages: ['256GB'],
      colors: ['Đen', 'Trắng', 'Hồng', 'Xanh'],
      status: 'in_stock',
      note: 'Chính hãng VN/A, bảo hành 12 tháng',
      imageUrl: '',
    },
    {
      seriesId: byKey['16'],
      name: 'iPhone 16 512GB',
      price: 27_990_000,
      storages: ['512GB'],
      colors: ['Đen', 'Trắng'],
      status: 'in_stock',
      note: 'Chính hãng VN/A',
      imageUrl: '',
    },

    // iPhone 17
    {
      seriesId: byKey['17'],
      name: 'iPhone 17 128GB',
      price: 24_990_000,
      storages: ['128GB'],
      colors: ['Titan Tự Nhiên', 'Titan Trắng', 'Titan Đen', 'Titan Sa Mạc'],
      status: 'preorder',
      note: 'Đặt trước - dự kiến ra mắt Q3/2025',
      imageUrl: '',
    },
    {
      seriesId: byKey['17'],
      name: 'iPhone 17 256GB',
      price: 27_990_000,
      storages: ['256GB'],
      colors: ['Titan Tự Nhiên', 'Titan Trắng', 'Titan Đen'],
      status: 'preorder',
      note: 'Đặt trước - dự kiến ra mắt Q3/2025',
      imageUrl: '',
    },
    {
      seriesId: byKey['17'],
      name: 'iPhone 17 512GB',
      price: 32_990_000,
      storages: ['512GB'],
      colors: ['Titan Tự Nhiên', 'Titan Đen'],
      status: 'preorder',
      note: 'Đặt trước - dự kiến ra mắt Q3/2025',
      imageUrl: '',
    },

    // iPhone 17 Pro Max
    {
      seriesId: byKey['17PRM'],
      name: 'iPhone 17 Pro Max 256GB',
      price: 35_990_000,
      storages: ['256GB'],
      colors: ['Titan Tự Nhiên', 'Titan Trắng', 'Titan Đen', 'Titan Sa Mạc'],
      status: 'preorder',
      note: 'Đặt trước - dự kiến ra mắt Q3/2025',
      imageUrl: '',
    },
    {
      seriesId: byKey['17PRM'],
      name: 'iPhone 17 Pro Max 512GB',
      price: 40_990_000,
      storages: ['512GB'],
      colors: ['Titan Tự Nhiên', 'Titan Trắng', 'Titan Đen'],
      status: 'preorder',
      note: 'Đặt trước - dự kiến ra mắt Q3/2025',
      imageUrl: '',
    },
    {
      seriesId: byKey['17PRM'],
      name: 'iPhone 17 Pro Max 1TB',
      price: 46_990_000,
      storages: ['1TB'],
      colors: ['Titan Tự Nhiên', 'Titan Đen'],
      status: 'preorder',
      note: 'Đặt trước - dự kiến ra mắt Q3/2025',
      imageUrl: '',
    },
  ];

  for (const m of models) {
    await prisma.model.create({ data: m });
  }

  console.log(`✅ Seeded ${seriesData.length} series and ${models.length} models`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
