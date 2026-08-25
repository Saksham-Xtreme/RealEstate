# Controller Layer

This directory maps routing requests to specific logic, sanitizes input parameters, and returns response objects.

## Controller Files

* **[`auth.controller.js`](file:///Users/sakshamtripathi/Desktop/Real%20Estate/server/src/controllers/auth.controller.js)** - Manages user signup, signin tokens, profile management, and session logs.
* **[`employee.controller.js`](file:///Users/sakshamtripathi/Desktop/Real%20Estate/server/src/controllers/employee.controller.js)** - Logic for listing ownership, updates, and active session checking.
* **[`listing.controller.js`](file:///Users/sakshamtripathi/Desktop/Real%20Estate/server/src/controllers/listing.controller.js)** - Validates, stores, filters, and deletes real estate listings.
* **[`owner.controller.js`](file:///Users/sakshamtripathi/Desktop/Real%20Estate/server/src/controllers/owner.controller.js)** - High-level admin views tracking lead scores, performance ratios, and user lists.
* **[`interest.controller.js`](file:///Users/sakshamtripathi/Desktop/Real%20Estate/server/src/controllers/interest.controller.js)** - Registers user likes, clicks, and property inquiries.
* **[`activity.controller.js`](file:///Users/sakshamtripathi/Desktop/Real%20Estate/server/src/controllers/activity.controller.js)** - Handles active pings from the client, writing status directly to Redis.
* **[`stats.controller.js`](file:///Users/sakshamtripathi/Desktop/Real%20Estate/server/src/controllers/stats.controller.js)** - Compiles basic database statistics and analytics summaries.
