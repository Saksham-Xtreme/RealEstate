# Core Business Services

This directory contains standalone modules that implement core business algorithms and transactional logic.

## Services

* **[`leadScore.js`](file:///Users/sakshamtripathi/Desktop/Real%20Estate/server/src/services/leadScore.js)** / **[`scoring.service.js`](file:///Users/sakshamtripathi/Desktop/Real%20Estate/server/src/services/scoring.service.js)** - Evaluation engine combining visitor visit frequency, click events, and overall session lengths to classify lead interest levels (High / Medium / Low).
* **[`activity.service.js`](file:///Users/sakshamtripathi/Desktop/Real%20Estate/server/src/services/activity.service.js)** - Active monitoring wrapper tracking idle times and session state writes inside the Redis engine.
* **[`employee.service.js`](file:///Users/sakshamtripathi/Desktop/Real%20Estate/server/src/services/employee.service.js)** - Business services managing employee onboarding and performance scoring.
* **[`otp.service.js`](file:///Users/sakshamtripathi/Desktop/Real%20Estate/server/src/services/otp.service.js)** - Verification code handling and validation logic.
