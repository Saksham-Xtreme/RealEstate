# Frontend Source (`src/`)

This directory houses the core client-side React code of the RealEstate app. Below is the purpose of each directory and entry-point:

## Folder Structure

* **[assets/](file:///Users/sakshamtripathi/Desktop/Real%20Estate/ev-management/src/assets)** - Local icons, pictures, and other media assets.
* **[auth/](file:///Users/sakshamtripathi/Desktop/Real%20Estate/ev-management/src/auth)** - Auth contexts and state management configuration for handling logged-in user tokens, roles, and sign-outs.
* **[components/](file:///Users/sakshamtripathi/Desktop/Real%20Estate/ev-management/src/components)** - Reusable components (e.g. Navigation bar, custom forms, listing input fields).
* **[hooks/](file:///Users/sakshamtripathi/Desktop/Real%20Estate/ev-management/src/hooks)** - React hooks for side-effects, such as automatic pinging of employee active state and user interaction logging.
* **[layouts/](file:///Users/sakshamtripathi/Desktop/Real%20Estate/ev-management/src/layouts)** - Global layouts (e.g., standard layout, dashboard view wrapping).
* **[pages/](file:///Users/sakshamtripathi/Desktop/Real%20Estate/ev-management/src/pages)** - Pages rendered by routes (Landing, Auth, Properties list, Details, Owner dashboard, etc.).
* **[styles/](file:///Users/sakshamtripathi/Desktop/Real%20Estate/ev-management/src/styles)** - Styling configs and globally imported styles.
* **[utils/](file:///Users/sakshamtripathi/Desktop/Real%20Estate/ev-management/src/utils)** - API clients, interceptors, and data formatting functions.

## Main Entry Points

- **[`main.jsx`](file:///Users/sakshamtripathi/Desktop/Real%20Estate/ev-management/src/main.jsx)** - Application entry point. Hooks React to the DOM.
- **[`App.jsx`](file:///Users/sakshamtripathi/Desktop/Real%20Estate/ev-management/src/App.jsx)** - Main Router container defining application pages and path resolution rules.
- **[`App.css` / `index.css`](file:///Users/sakshamtripathi/Desktop/Real%20Estate/ev-management/src/index.css)** - Main styling imports and tailwind declarations.
