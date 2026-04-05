
const dotenv = require("dotenv");
dotenv.config({ path: "../../.env" });


const Listing = require("../models/listing.model");
const { data } = require("./data");
const mongoose = require("mongoose");
dotenv.config();

console.log("MONGO_URI:", process.env.MONGO_URI);
// 🔷 CONNECT DB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};


// 🔷 SEED FUNCTION
const seedListings = async () => {
  try {
    await connectDB();

    // ⚠️ Clear old data (optional but recommended)
    await Listing.deleteMany();

    // 🔷 Insert new data
    const listings = await Listing.insertMany(data);

    console.log(`Inserted ${listings.length} listings`);

    process.exit();
  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
};

seedListings();