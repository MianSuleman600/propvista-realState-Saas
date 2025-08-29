// D:\MERN\propvista\propvista-backend\src\prisma\seed.ts
import { PrismaClient } from '../../generated/prisma/client.js';
import { hash } from "bcryptjs";
import slugify from "@sindresorhus/slugify";

const prisma = new PrismaClient();

const PropertyType = {
  APARTMENT: "APARTMENT",
  HOUSE: "HOUSE",
  VILLA: "VILLA",
  COMMERCIAL: "COMMERCIAL",
} as const;

const Status = {
  FOR_SALE: "FOR_SALE",
  FOR_RENT: "FOR_RENT",
  SOLD: "SOLD",
} as const;

async function main() {
  // Create admin user
  const adminPass = await hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@propvista.com" },
    update: {},
    create: {
      email: "admin@propvista.com",
      username: "admin",
      password: adminPass,
      role: "ADMIN",
    },
  });

  // Create 3 agents
  const agents = await Promise.all([
    prisma.agent.create({
      data: {
        name: "Aisha Khan",
        role: "Senior Agent",
        email: "aisha@propvista.com",
        phone: "+92-300-1234567",
        rating: 4.8,
      },
    }),
    prisma.agent.create({
      data: {
        name: "Bilal Ahmed",
        role: "Agent",
        email: "bilal@propvista.com",
        phone: "+92-300-2345678",
        rating: 4.5,
      },
    }),
    prisma.agent.create({
      data: {
        name: "Sara Ali",
        role: "Junior Agent",
        email: "sara@propvista.com",
        phone: "+92-300-3456789",
        rating: 4.2,
      },
    }),
  ]);

  // Create 10 properties
  const propertiesData = [
    {
      title: "Luxury Apartment in DHA Phase 8",
      description: "Sea-facing apartment with modern amenities.",
      location: "DHA Phase 8, Karachi",
      address: "Plot 12, DHA Phase 8",
      city: "Karachi",
      state: "Sindh",
      zipCode: "75500",
      price: 90000000,
      bedrooms: 3,
      bathrooms: 3,
      areaSqft: 2400,
      propertyType: PropertyType.APARTMENT,
      status: Status.FOR_SALE,
      mainImage: "/images/properties/property1.jpg",
      images: ["/images/properties/property1.jpg", "/images/properties/property1-2.jpg"],
      agentId: agents[0].id,
    },
    {
      title: "Affordable Family Home in Gulshan-e-Iqbal",
      description: "Perfect starter home in a peaceful neighborhood.",
      location: "Gulshan-e-Iqbal, Karachi",
      address: "House 45, Gulshan-e-Iqbal",
      city: "Karachi",
      state: "Sindh",
      zipCode: "75300",
      price: 12500000,
      bedrooms: 4,
      bathrooms: 3,
      areaSqft: 1800,
      propertyType: PropertyType.HOUSE,
      status: Status.FOR_SALE,
      mainImage: "/images/properties/property2.jpg",
      images: ["/images/properties/property2.jpg", "/images/properties/property2-2.jpg"],
      agentId: agents[0].id,
    },
    {
      title: "Modern Villa in Bahria Town",
      description: "Spacious villa with garden and pool.",
      location: "Bahria Town, Karachi",
      address: "Villa 9, Bahria Town",
      city: "Karachi",
      state: "Sindh",
      zipCode: "75550",
      price: 35000000,
      bedrooms: 5,
      bathrooms: 4,
      areaSqft: 5000,
      propertyType: PropertyType.VILLA,
      status: Status.FOR_SALE,
      mainImage: "/images/properties/property3.jpg",
      images: ["/images/properties/property3.jpg", "/images/properties/property3-2.jpg"],
      agentId: agents[1].id,
    },
    {
      title: "Office Space in Clifton",
      description: "Commercial office space in prime location.",
      location: "Clifton, Karachi",
      address: "Block 5, Clifton",
      city: "Karachi",
      state: "Sindh",
      zipCode: "75600",
      price: 50000000,
      bedrooms: 0,
      bathrooms: 2,
      areaSqft: 3000,
      propertyType: PropertyType.COMMERCIAL,
      status: Status.FOR_RENT,
      mainImage: "/images/properties/property4.jpg",
      images: ["/images/properties/property4.jpg"],
      agentId: agents[1].id,
    },
    {
      title: "Beachfront Apartment in Karachi",
      description: "Relaxing view of the sea from every room.",
      location: "Clifton, Karachi",
      address: "Apartment 101, Beach Tower",
      city: "Karachi",
      state: "Sindh",
      zipCode: "75610",
      price: 80000000,
      bedrooms: 3,
      bathrooms: 3,
      areaSqft: 2200,
      propertyType: PropertyType.APARTMENT,
      status: Status.FOR_SALE,
      mainImage: "/images/properties/property5.jpg",
      images: ["/images/properties/property5.jpg", "/images/properties/property5-2.jpg"],
      agentId: agents[2].id,
    },
    {
      title: "Cozy Home in PECHS",
      description: "A warm and cozy home ideal for families.",
      location: "PECHS, Karachi",
      address: "House 12, PECHS",
      city: "Karachi",
      state: "Sindh",
      zipCode: "75400",
      price: 18000000,
      bedrooms: 3,
      bathrooms: 2,
      areaSqft: 1600,
      propertyType: PropertyType.HOUSE,
      status: Status.FOR_SALE,
      mainImage: "/images/properties/property6.jpg",
      images: ["/images/properties/property6.jpg"],
      agentId: agents[2].id,
    },
    {
      title: "Modern Villa with Pool in DHA",
      description: "Villa with modern architecture and private pool.",
      location: "DHA Phase 5, Karachi",
      address: "Villa 22, DHA Phase 5",
      city: "Karachi",
      state: "Sindh",
      zipCode: "75510",
      price: 45000000,
      bedrooms: 5,
      bathrooms: 4,
      areaSqft: 5500,
      propertyType: PropertyType.VILLA,
      status: Status.FOR_SALE,
      mainImage: "/images/properties/property7.jpg",
      images: ["/images/properties/property7.jpg"],
      agentId: agents[0].id,
    },
    {
      title: "Commercial Shop in Saddar",
      description: "High footfall area ideal for retail business.",
      location: "Saddar, Karachi",
      address: "Shop 7, Saddar Market",
      city: "Karachi",
      state: "Sindh",
      zipCode: "74000",
      price: 20000000,
      bedrooms: 0,
      bathrooms: 1,
      areaSqft: 1200,
      propertyType: PropertyType.COMMERCIAL,
      status: Status.FOR_RENT,
      mainImage: "/images/properties/property8.jpg",
      images: ["/images/properties/property8.jpg"],
      agentId: agents[1].id,
    },
    {
      title: "Penthouse Apartment in Clifton",
      description: "Luxury penthouse with city views.",
      location: "Clifton, Karachi",
      address: "Penthouse 5, Tower A",
      city: "Karachi",
      state: "Sindh",
      zipCode: "75620",
      price: 120000000,
      bedrooms: 4,
      bathrooms: 4,
      areaSqft: 3500,
      propertyType: PropertyType.APARTMENT,
      status: Status.FOR_SALE,
      mainImage: "/images/properties/property9.jpg",
      images: ["/images/properties/property9.jpg"],
      agentId: agents[2].id,
    },
    {
      title: "Spacious Family Home in Korangi",
      description: "Comfortable home in a quiet area.",
      location: "Korangi, Karachi",
      address: "House 30, Korangi",
      city: "Karachi",
      state: "Sindh",
      zipCode: "74900",
      price: 15000000,
      bedrooms: 4,
      bathrooms: 3,
      areaSqft: 2000,
      propertyType: PropertyType.HOUSE,
      status: Status.FOR_SALE,
      mainImage: "/images/properties/property10.jpg",
      images: ["/images/properties/property10.jpg"],
      agentId: agents[0].id,
    },
  ];

  for (const prop of propertiesData) {
    await prisma.property.create({
      data: {
        ...prop,
        slug: slugify(prop.title),
      },
    });
  }

  // Add some inquiries
  await prisma.inquiry.create({
    data: {
      name: "Ali Raza",
      email: "ali@example.com",
      phone: "+92-300-9876543",
      message: "I am interested in this property, please contact me.",
      propertyId: (await prisma.property.findFirst()).id,
      agentId: agents[0].id,
    },
  });

  await prisma.inquiry.create({
    data: {
      name: "Sara Khan",
      email: "sara@example.com",
      phone: "+92-300-8765432",
      message: "Can I schedule a visit for this property?",
      propertyId: (await prisma.property.findFirst({ where: { title: "Modern Villa in Bahria Town" } })).id,
      agentId: agents[1].id,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seeding complete.");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
