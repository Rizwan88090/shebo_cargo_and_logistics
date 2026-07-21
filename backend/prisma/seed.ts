import 'dotenv/config';
import { PrismaClient, Role, ServiceStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // ===== Create Super Admin =====
  const hashedPassword = await bcrypt.hash('Admin123', 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'itxsheboo@gmail.com' },
    update: { password: hashedPassword, role: Role.SUPER_ADMIN, isActive: true },
    create: {
      email: 'itxsheboo@gmail.com',
      password: hashedPassword,
      firstName: 'Shebo',
      lastName: 'Admin',
      phone: '+971527540249',
      role: Role.SUPER_ADMIN,
    },
  });
  console.log(`✅ Super Admin created: ${superAdmin.email}`);

  // ===== Seed Countries =====
  const countriesData = [
    { name: 'United Arab Emirates', code: 'AE', flag: '🇦🇪', description: 'Headquarters and primary logistics hub', sortOrder: 1 },
    { name: 'Saudi Arabia', code: 'SA', flag: '🇸🇦', description: 'Major GCC partner with full cargo coverage', sortOrder: 2 },
    { name: 'Qatar', code: 'QA', flag: '🇶🇦', description: 'Premium air and sea freight services', sortOrder: 3 },
    { name: 'Oman', code: 'OM', flag: '🇴🇲', description: 'Cross-border land and sea shipping routes', sortOrder: 4 },
    { name: 'Bahrain', code: 'BH', flag: '🇧🇭', description: 'Regular cargo and relocation services', sortOrder: 5 },
    { name: 'Kuwait', code: 'KW', flag: '🇰🇼', description: 'Full-service freight forwarding hub', sortOrder: 6 },
  ];

  for (const c of countriesData) {
    await prisma.country.upsert({
      where: { code: c.code },
      update: {},
      create: c,
    });
  }
  console.log(`✅ ${countriesData.length} countries seeded`);

  // ===== Seed Cities =====
  const uae = await prisma.country.findUnique({ where: { code: 'AE' } });
  const sa = await prisma.country.findUnique({ where: { code: 'SA' } });

  if (uae) {
    const uaeCities = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah'];
    for (const [i, name] of uaeCities.entries()) {
      await prisma.city.upsert({
        where: { name_countryId: { name, countryId: uae.id } },
        update: {},
        create: { name, countryId: uae.id, sortOrder: i + 1 },
      });
    }
    console.log(`✅ ${uaeCities.length} UAE cities seeded`);
  }

  if (sa) {
    const saCities = ['Riyadh', 'Jeddah', 'Dammam', 'Makkah', 'Madinah'];
    for (const [i, name] of saCities.entries()) {
      await prisma.city.upsert({
        where: { name_countryId: { name, countryId: sa.id } },
        update: {},
        create: { name, countryId: sa.id, sortOrder: i + 1 },
      });
    }
    console.log(`✅ ${saCities.length} Saudi cities seeded`);
  }

  // ===== Seed Services =====
  const servicesData = [
    {
      title: 'Air Cargo Services',
      slug: 'air-cargo',
      shortDescription: 'Express worldwide air freight with real-time tracking',
      description: 'Our air cargo services provide the fastest route for your shipments worldwide. With partnerships across major airlines and freight carriers, we offer door-to-door, airport-to-airport, and charter solutions for urgent and valuable cargo.',
      icon: 'MdFlight',
      features: ['Express next-day delivery', 'Temperature-controlled cargo', 'Customs clearance', 'Real-time GPS tracking', 'Dangerous goods certified'],
      sortOrder: 1,
    },
    {
      title: 'Sea Cargo Services',
      slug: 'sea-cargo',
      shortDescription: 'Cost-effective ocean freight for bulk and container shipments',
      description: 'Full Container Load (FCL) and Less than Container Load (LCL) options for global sea freight. Our established relationships with major shipping lines ensure competitive rates and reliable schedules.',
      icon: 'MdDirectionsBoat',
      features: ['FCL & LCL options', 'Port-to-port delivery', 'Container tracking', 'Customs brokerage', 'Reefer containers available'],
      sortOrder: 2,
    },
    {
      title: 'Land Cargo Services',
      slug: 'land-cargo',
      shortDescription: 'Reliable ground transportation across the GCC region',
      description: 'Our fleet of modern GPS-tracked trucks provides efficient overland shipping services across the entire GCC region. From full truckloads to partial shipments, we cover all ground logistics needs.',
      icon: 'MdLocalShipping',
      features: ['GPS-tracked fleet', 'Cross-border shipping', 'Full & partial loads', 'Same-day delivery options', 'Flatbed and enclosed trailers'],
      sortOrder: 3,
    },
    {
      title: 'Villa Shifting',
      slug: 'villa-shifting',
      shortDescription: 'Professional home and villa relocation with care',
      description: 'Complete residential relocation services including professional packing, furniture disassembly, safe transportation, unpacking, and setup at your new home. We treat your belongings as our own.',
      icon: 'MdHome',
      features: ['Professional packing', 'Furniture dismantling & assembly', 'Fragile item handling', 'Insurance coverage', 'Storage options available'],
      sortOrder: 4,
    },
    {
      title: 'Office Relocation',
      slug: 'office-relocation',
      shortDescription: 'Seamless corporate and office moving solutions',
      description: 'Minimize downtime with our expert office relocation services. We handle IT equipment, furniture, files, and sensitive documents with systematic planning and execution to get your business back up and running quickly.',
      icon: 'MdBusiness',
      features: ['IT equipment handling', 'Systematic labeling system', 'Weekend/after-hours moves', 'Project management', 'Confidential document handling'],
      sortOrder: 5,
    },
    {
      title: 'Packing Services',
      slug: 'packing',
      shortDescription: 'Expert packing for all types of goods and materials',
      description: 'Our certified packing team uses premium-quality materials and techniques to ensure your items are protected throughout transit. From delicate antiques to heavy machinery, we have the expertise to pack it all.',
      icon: 'MdInventory',
      features: ['Custom crating', 'Industrial packing', 'Fragile item specialists', 'Eco-friendly materials', 'Unpacking services'],
      sortOrder: 6,
    },
    {
      title: 'Warehousing',
      slug: 'warehousing',
      shortDescription: 'Secure climate-controlled storage and distribution',
      description: 'State-of-the-art warehousing facilities with 24/7 security, climate control, and modern inventory management systems. Short-term and long-term storage solutions available for all cargo types.',
      icon: 'MdWarehouse',
      features: ['Climate controlled', '24/7 security & CCTV', 'Inventory management', 'Short & long term', 'Distribution services'],
      sortOrder: 7,
    },
    {
      title: 'International Moving',
      slug: 'international-moving',
      shortDescription: 'Complete door-to-door international relocation',
      description: 'End-to-end international moving services including pre-move surveys, customs documentation, international shipping, destination services, and settling-in assistance. We make moving abroad stress-free.',
      icon: 'MdPublic',
      features: ['Pre-move survey', 'Customs documentation', 'Door-to-door service', 'Pet relocation', 'Vehicle shipping'],
      sortOrder: 8,
    },
  ];

  for (const s of servicesData) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        ...s,
        status: ServiceStatus.ACTIVE,
      },
    });
  }
  console.log(`✅ ${servicesData.length} services seeded`);

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
