import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { galleryPhotos } from './drizzle/schema.ts';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

const samplePhotos = [
  {
    title: "Elegant Wedding Reception",
    description: "A stunning wedding reception at a luxury London venue with our premium service team",
    imageUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=800&fit=crop",
    imageKey: "gallery/sample-wedding-1.jpg",
    category: "weddings",
    isFeatured: true,
    displayOrder: 1,
  },
  {
    title: "Corporate Gala Dinner",
    description: "High-profile corporate event with VIP service and elite hospitality staff",
    imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=800&fit=crop",
    imageKey: "gallery/sample-corporate-1.jpg",
    category: "corporate_events",
    isFeatured: true,
    displayOrder: 2,
  },
  {
    title: "Private Party Excellence",
    description: "Exclusive private celebration with bespoke cocktail service and premium catering",
    imageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=800&fit=crop",
    imageKey: "gallery/sample-party-1.jpg",
    category: "private_parties",
    isFeatured: true,
    displayOrder: 3,
  },
  {
    title: "Luxury Conference Service",
    description: "International business conference with multilingual staff and white-glove service",
    imageUrl: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&h=800&fit=crop",
    imageKey: "gallery/sample-conference-1.jpg",
    category: "conferences",
    isFeatured: true,
    displayOrder: 4,
  },
  {
    title: "Garden Wedding Ceremony",
    description: "Beautiful outdoor wedding with professional coordination and service excellence",
    imageUrl: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=800&fit=crop",
    imageKey: "gallery/sample-wedding-2.jpg",
    category: "weddings",
    isFeatured: false,
    displayOrder: 5,
  },
  {
    title: "Executive Board Dinner",
    description: "Intimate executive dinner with discreet service and fine dining standards",
    imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=800&fit=crop",
    imageKey: "gallery/sample-corporate-2.jpg",
    category: "corporate_events",
    isFeatured: false,
    displayOrder: 6,
  },
  {
    title: "Birthday Celebration",
    description: "Memorable birthday party with creative mixology and entertainment coordination",
    imageUrl: "https://images.unsplash.com/photo-1464347744102-11db6282f854?w=800&h=800&fit=crop",
    imageKey: "gallery/sample-party-2.jpg",
    category: "private_parties",
    isFeatured: false,
    displayOrder: 7,
  },
  {
    title: "Charity Gala Evening",
    description: "Prestigious charity gala with full event management and premium hospitality",
    imageUrl: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=800&fit=crop",
    imageKey: "gallery/sample-gala-1.jpg",
    category: "gala_dinners",
    isFeatured: false,
    displayOrder: 8,
  },
  {
    title: "Product Launch Event",
    description: "High-energy product launch with brand ambassadors and promotional staff",
    imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=800&fit=crop",
    imageKey: "gallery/sample-corporate-3.jpg",
    category: "corporate_events",
    isFeatured: false,
    displayOrder: 9,
  },
  {
    title: "Rooftop Wedding Reception",
    description: "Spectacular rooftop wedding with panoramic views and exceptional service",
    imageUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=800&fit=crop",
    imageKey: "gallery/sample-wedding-3.jpg",
    category: "weddings",
    isFeatured: false,
    displayOrder: 10,
  },
  {
    title: "VIP Networking Event",
    description: "Exclusive networking reception with champagne service and canapés",
    imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=800&fit=crop",
    imageKey: "gallery/sample-party-3.jpg",
    category: "private_parties",
    isFeatured: false,
    displayOrder: 11,
  },
  {
    title: "Annual Awards Ceremony",
    description: "Prestigious awards gala with red carpet service and celebrity hospitality",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=800&fit=crop",
    imageKey: "gallery/sample-gala-2.jpg",
    category: "gala_dinners",
    isFeatured: false,
    displayOrder: 12,
  },
];

console.log("🌱 Seeding gallery photos...");

for (const photo of samplePhotos) {
  await db.insert(galleryPhotos).values(photo);
  console.log(`✅ Added: ${photo.title}`);
}

console.log("✨ Gallery seeded successfully!");
await connection.end();
