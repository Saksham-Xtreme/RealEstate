require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");

const redis = require("./config/redis");



// ─── APP INIT ─────────────────────────────────────────
const app = express();
const server = http.createServer(app);

// ─── ENV ──────────────────────────────────────────────
const PORT = process.env.PORT || 8080;
const CLIENT_URL = process.env.CLIENT_URL;

// ─── SOCKET.IO ────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true
  }
});

app.set("io", io);

// ─── MIDDLEWARE ───────────────────────────────────────
const allowedOrigins = [
  "http://localhost:5173/",
  // "https://realestatefull.vercel.app"
];

app.use(cors({
  origin: true,
  credentials: true
}));



app.use(morgan("dev"));
app.use(express.json());


app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/listings", require("./routes/listing.routes.js"));
app.use("/api/activity", require("./routes/activity.routes.js"));
app.use("/api/stats", require("./routes/stats.routes"));

app.use("/api/interests", require("./routes/interest.routes"));

app.use("/api/employee", require("./routes/employee.routes"));
app.use("/api/owner", require("./routes/owner.routes"));

// ─── DB CONNECTION ────────────────────────────────────
const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB Connected:", conn.connection.host);
};

// ─── REDIS TEST (ONLY ON STARTUP) ─────────────────────
const testRedis = async () => {
  try {
    await redis.set("test:key", "working");
    const val = await redis.get("test:key");
    console.log("Redis Test:", val);
  } catch (err) {
    console.error("Redis Test Failed:", err.message);
  }
};

// ─── START SERVER PROPERLY ────────────────────────────
const startServer = async () => {
  try {
    await connectDB();
    await testRedis(); // optional but clean

    server.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
      console.log(CLIENT_URL);
    });

  } catch (err) {
    console.error("Startup Error:", err.message);
    process.exit(1);
  }
};

startServer();

// ─── ROUTES (ENABLE NEXT STEP) ───────────────────────



// ─── TEST ROUTE ───────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    message: "Backend connected",
    server: process.env.SERVER_URL
  });
});

// ─── SOCKET CONNECTION ────────────────────────────────
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ─── GLOBAL ERROR HANDLER ─────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Server Error",
    error: err.message
  });
});