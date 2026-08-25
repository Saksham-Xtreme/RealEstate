# Frontend Application (EV Management)

This directory contains the React + Vite frontend workspace for the **RealEstate CRM + Analytics Platform**. It is responsible for rendering the UI, capturing user interaction metrics (used for lead scoring), and reporting employee active sessions to the backend.

## Folder Directory Structure

* **[public/](file:///Users/sakshamtripathi/Desktop/Real%20Estate/ev-management/public)**: Static assets, icons, and logo images.
* **[src/](file:///Users/sakshamtripathi/Desktop/Real%20Estate/ev-management/src)**: The main source code directory of the React application.
  * **[assets/](file:///Users/sakshamtripathi/Desktop/Real%20Estate/ev-management/src/assets)**: Images, font files, and icons imported directly into React components.
  * **[auth/](file:///Users/sakshamtripathi/Desktop/Real%20Estate/ev-management/src/auth)**: Contexts, hooks, and helpers related to user authorization and state.
  * **[components/](file:///Users/sakshamtripathi/Desktop/Real%20Estate/ev-management/src/components)**: Reusable UI components (Navbar, Footer, Hero, Route Protectors, Forms).
  * **[hooks/](file:///Users/sakshamtripathi/Desktop/Real%20Estate/ev-management/src/hooks)**: Custom React hooks (e.g., tracking idle state, fetching metrics, managing intervals).
  * **[layouts/](file:///Users/sakshamtripathi/Desktop/Real%20Estate/ev-management/src/layouts)**: Layout components defining page shells (e.g., Sidebar setups, Dashboard wraps).
  * **[pages/](file:///Users/sakshamtripathi/Desktop/Real%20Estate/ev-management/src/pages)**: Core views (Auth forms, Home, Listing directory, Detail page, Owner console, Employee tracking portal).
  * **[styles/](file:///Users/sakshamtripathi/Desktop/Real%20Estate/ev-management/src/styles)**: Custom styling definitions.
  * **[utils/](file:///Users/sakshamtripathi/Desktop/Real%20Estate/ev-management/src/utils)**: Utility helper functions, validators, formatting helpers, and Axios instance configurations.

---

## Technical Stack & Libraries

- **Vite** - High-performance build tool and dev server.
- **React Router DOM** - Client-side declarative routing.
- **Axios** - HTTP client for interacting with the backend APIs.
- **Tailwind CSS** - Utility-first styling framework.
- **Lucide React** - Vector icons for modern visual aesthetics.

---

## Getting Started

1. Ensure packages are installed:
   ```bash
   npm install
   ```

2. Start the hot-reloading development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```
