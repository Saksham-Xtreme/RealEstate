# RealEstate CRM + Analytics Platform

## Overview

This project is a full-stack Real Estate platform enhanced with a **CRM (Customer Relationship Management) system and real-time employee activity tracking**. It enables property listing, user interaction tracking, lead scoring, and employee performance monitoring.

The system is designed to go beyond basic listing platforms by providing **data-driven insights** for owners and employees.

---

## Core Features

### 🔹 User Features

* Property browsing (buy / rent)
* Advanced listing details and filtering
* Interest tracking (user engagement system)

### 🔹 Employee Features

* Create and manage property listings
* Track assigned leads
* Activity tracking via backend instrumentation

### 🔹 Owner / Admin Features

* Real-time dashboard with analytics
* Employee performance monitoring
* Lead scoring system (High / Medium / Low)
* Employee activity tracking using Redis
* Multi-user management (users, employees)

---

## 🔥 Advanced System Features

### 1. Real-Time Employee Tracking

* Tracks active sessions using Redis
* Activity updated periodically from frontend
* Status classification:

  * Active
  * Idle
  * Offline

### 2. Lead Scoring Engine

* Based on:

  * Time spent
  * Visits
  * Interactions
* Categorizes users into:

  * HIGH
  * MEDIUM
  * LOW

### 3. Employee Performance System

* Combines:

  * Active time (Redis)
  * Leads assigned (MongoDB)
* Enables ranking and monitoring

---

## Architecture

The system follows a **modular monolith architecture with service separation principles**:

* **Frontend (React)** → UI + interaction tracking
* **Backend (Node.js + Express)** → APIs, business logic
* **MongoDB** → persistent data (users, employees, listings)
* **Redis** → real-time session tracking & analytics

---

## Directory Structure

This repository is organized into two main workspaces:

* **[ev-management/](file:///Users/sakshamtripathi/Desktop/Real%20Estate/ev-management)** - React & Vite frontend application for managing listings, employee sessions, and visitor engagement tracking.
* **[server/](file:///Users/sakshamtripathi/Desktop/Real%20Estate/server)** - Express and Node.js backend handling API requests, business logic, MongoDB storage, and Redis session tracking.

---

## Tech Stack

### Frontend

* React.js
* Axios
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB (primary data)
* Redis (real-time analytics & caching)

### Authentication

* JWT-based authentication system

### Deployment

* Frontend: Vercel
* Backend: Render

---

## Key Engineering Concepts Used

* REST API Design
* Role-based Access Control (User / Employee / Owner)
* Redis-based real-time tracking
* Behavioral analytics (user activity tracking)
* Lead scoring algorithms
* Modular backend architecture

---

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/Saksham-Xtreme/RealEstate.git
   ```

2. Install dependencies:

   ```bash
   cd ev-management && npm install
   cd ../server && npm install
   ```

3. Configure environment variables:
   Create `.env` in the `server` directory:

   ```
   MONGO_URI=your_mongodb_url
   REDIS_URL=your_redis_url
   JWT_SECRET=your_secret
   ```

4. Run the project:

   **Backend (Server):**
   ```bash
   cd server && npm run dev
   ```

   **Frontend (EV Management):**
   ```bash
   cd ev-management && npm run dev
   ```

---

## Live Demo

https://realestatefull.vercel.app/

---

## Current Status

🚧 Active Development

Upcoming improvements:

* Real-time dashboards (Socket.IO)
* Advanced employee analytics
* Image optimization & management
* Scalable API design
