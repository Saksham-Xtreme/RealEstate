# Backend Server

This directory contains the Node.js + Express backend for the **RealEstate CRM + Analytics Platform**. It manages business logic, data persistence in MongoDB, caching & real-time sessions in Redis, and security authorizations.

## Folder Directory Structure

* **[src/](file:///Users/sakshamtripathi/Desktop/Real%20Estate/server/src)**: The main application code.
  * **[config/](file:///Users/sakshamtripathi/Desktop/Real%20Estate/server/src/config)**: Redis and Cloudinary client initializations and database configs.
  * **[controllers/](file:///Users/sakshamtripathi/Desktop/Real%20Estate/server/src/controllers)**: Controllers resolving routes, processing data, and generating API responses.
  * **[data/](file:///Users/sakshamtripathi/Desktop/Real%20Estate/server/src/data)**: Static data, mock listing details, and seeding script files.
  * **[jobs/](file:///Users/sakshamtripathi/Desktop/Real%20Estate/server/src/jobs)**: Background tasks and analytics synchronizations (e.g., MongoDB/Redis syncing).
  * **[middlewares/](file:///Users/sakshamtripathi/Desktop/Real%20Estate/server/src/middlewares)**: Auth checking and Role-based access control (RBAC) middlewares.
  * **[models/](file:///Users/sakshamtripathi/Desktop/Real%20Estate/server/src/models)**: Mongoose schemas representing database collections.
  * **[routes/](file:///Users/sakshamtripathi/Desktop/Real%20Estate/server/src/routes)**: API endpoint path definitions mapping to their respective controllers.
  * **[services/](file:///Users/sakshamtripathi/Desktop/Real%20Estate/server/src/services)**: Business logic, Lead Scoring computations, OTP verification utilities, and Employee state calculations.
* **[uploads/](file:///Users/sakshamtripathi/Desktop/Real%20Estate/server/uploads)**: Temporary storage path for local file/image processing before upload.

---

## Technical Stack & Libraries

- **Express** - Fast, unopinionated minimalist web framework for Node.js.
- **Mongoose / MongoDB** - ODM wrapper and database to persist entities (Users, Listings, Leads).
- **Redis** - High-speed in-memory database used for tracking real-time employee sessions (Active/Idle/Offline).
- **jsonwebtoken** - Sign and verify user tokens for stateless backend sessions.
- **Cloudinary** - Media management service for hosting property pictures.

---

## Setup & Running

1. Ensure packages are installed:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root of the server directory:
   ```
   PORT=5001
   MONGO_URI=mongodb://localhost:27017/realestate
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=your_secret_key
   CLOUDINARY_CLOUD_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   ```

3. Run in development mode with live reload:
   ```bash
   npm run dev
   ```

4. Seed the database with default properties:
   ```bash
   npm run seed
   ```
