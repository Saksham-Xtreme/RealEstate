const mongoose = require("mongoose");
require("dotenv").config();

const Employee = require("../models/employee.model");

const employees = [
  {
    phone: "8888888888",
    name: "Employee 1",
    email: "emp@test.com",
    password: "$2b$10$RjjcCo4XVOJjRuXt935YhOszM6x4Uu.n99Py/E2t94oAZIBs8hfwO", // already hashed
    role: "employee",
    isVerified: true,
  },
];

const seedEmployees = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Mongo connected");

    // 🔴 Remove duplicates (optional but recommended)
    await Employee.deleteMany({
      phone: { $in: employees.map((e) => e.phone) },
    });

    // 🔴 Insert fresh data
    const result = await Employee.insertMany(employees);

    console.log("Employees seeded:", result.length);

    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedEmployees();