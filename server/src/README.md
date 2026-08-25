# Backend Source Code (`src/`)

This directory houses the main Express server logic, divided into specialized packages.

## Directory Structure

* **[config/](file:///Users/sakshamtripathi/Desktop/Real%20Estate/server/src/config)** - Configurations and initial connections for Redis, Mongoose, and Cloudinary.
* **[controllers/](file:///Users/sakshamtripathi/Desktop/Real%20Estate/server/src/controllers)** - Request handlers that process user input and hand off execution flow to services.
* **[data/](file:///Users/sakshamtripathi/Desktop/Real%20Estate/server/src/data)** - Base/static dataset files and seeding logic.
* **[jobs/](file:///Users/sakshamtripathi/Desktop/Real%20Estate/server/src/jobs)** - Background workers and automation scripts (e.g. periodically writing analytics to persistent DB storage).
* **[middlewares/](file:///Users/sakshamtripathi/Desktop/Real%20Estate/server/src/middlewares)** - Express middlewares for role inspection, security headers, and authentication validation.
* **[models/](file:///Users/sakshamtripathi/Desktop/Real%20Estate/server/src/models)** - Mongoose schemas representing database structures (User, Property Listing, Employee, Analytics logs).
* **[routes/](file:///Users/sakshamtripathi/Desktop/Real%20Estate/server/src/routes)** - Maps REST endpoints to corresponding controllers.
* **[services/](file:///Users/sakshamtripathi/Desktop/Real%20Estate/server/src/services)** - Core business domain rules, lead score evaluation engines, and session handlers.

## Entry Point

- **[`server.js`](file:///Users/sakshamtripathi/Desktop/Real%20Estate/server/src/server.js)** - Spawns the Express listener, connects standard middlewares, establishes connections to Redis and MongoDB databases, and maps global router scopes.
