# Middleware Filters

This directory houses verification filters executed before matching routes run.

## Middleware Files

* **[`auth.middleware.js`](file:///Users/sakshamtripathi/Desktop/Real%20Estate/server/src/middlewares/auth.middleware.js)** - Verifies JWT authorization keys, attaching the verified user payload to context.
* **[`roles.middleware.js`](file:///Users/sakshamtripathi/Desktop/Real%20Estate/server/src/middlewares/roles.middleware.js)** - Validates roles (e.g. Employee or Owner permissions) to lock down backend endpoints.
