import mongoose from "mongoose";
import { Room } from "./src/models/Room";

// Run with: npx tsx --env-file=.env.local seed.ts

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is missing in .env.local");
  process.exit(1);
}

const SEED_ROOMS = [
  // Villas
  {
    title: "The Grand Estate Villa",
    category: "villa",
    type: "Estate",
    price: 1,
    capacity: 6,
    totalRooms: 1,
    sizeSqFt: 3500,
    description: "A sprawling private estate with a personal pool and butler service. The ultimate luxury experience.",
    images: ["/villa-hero-1.png", "/room2.jpeg"],
    amenities: ["Private Pool", "Butler Service", "Wifi", "Kitchen", "Home Theater"],
    featured: true,
    status: "active"
  },
  {
    title: "Serene Garden Villa",
    category: "villa",
    type: "Garden",
    price: 1,
    capacity: 4,
    totalRooms: 1,
    sizeSqFt: 2200,
    description: "Nestled in lush greenery, this villa offers peace and privacy with a modern touch.",
    images: ["/villa-hero-2.png", "/poolview4.jpeg"],
    amenities: ["Garden View", "Wifi", "Air Conditioning", "Outdoor Shower"],
    featured: true,
    status: "active"
  },
  // Rooms (for the villas)
  {
    title: "Royal Suite - East Wing",
    category: "room",
    type: "Suite",
    price: 1,
    capacity: 2,
    totalRooms: 1,
    sizeSqFt: 850,
    description: "Luxury suite in the East Wing of the estate with marble bathrooms and premium linens.",
    images: ["/room3.jpeg", "/Bathroom.jpeg"],
    amenities: ["Wifi", "Minibar", "AC", "Bathtub"],
    featured: true,
    status: "active"
  },
  {
    title: "Royal Suite - West Wing",
    category: "room",
    type: "Suite",
    price: 1,
    capacity: 2,
    totalRooms: 1,
    sizeSqFt: 850,
    description: "Spacious and elegant room in the West Wing with a private balcony overlooking the pool.",
    images: ["/room4.jpeg", "/poolview2.jpeg"],
    amenities: ["Wifi", "Minibar", "AC", "Balcony"],
    featured: true,
    status: "active"
  },
  {
    title: "Garden Room Alpha",
    category: "room",
    type: "Deluxe",
    price: 1,
    capacity: 2,
    totalRooms: 1,
    sizeSqFt: 550,
    description: "A cozy yet luxurious room with direct access to the villa's private garden.",
    images: ["/poolview3.jpeg"],
    amenities: ["Wifi", "AC", "Garden Access"],
    featured: true,
    status: "active"
  },
  {
    title: "Garden Room Beta",
    category: "room",
    type: "Deluxe",
    price: 1,
    capacity: 2,
    totalRooms: 1,
    sizeSqFt: 550,
    description: "Quiet and refined room perfect for couples seeking tranquility.",
    images: ["/Hero3.jpeg"],
    amenities: ["Wifi", "AC", "Soundproof"],
    featured: true,
    status: "active"
  }
];

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI!);
    console.log("Connected.");

    console.log("Clearing existing rooms...");
    await Room.deleteMany({});
    console.log("Cleared.");

    console.log("Seeding new rooms...");
    await Room.insertMany(SEED_ROOMS);
    console.log("Seeding complete!");

    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

seed();
