# SpotVault

This project is a web application built using Next.js, TypeScript, and Tailwind CSS.

---

## Getting Started

### Prerequisites

You will need to have [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) installed on your computer.

### Installation & Setup

1. **Clone the repository:**
   Open your terminal and run the following command to clone the project:

   ```bash
   git clone https://github.com/CSCI4830-UNO/SpotVault
   ```

   **Navigate to the project directory:**

2. ```bash
   cd SpotVault/web/
   ```

3. **Install dependencies:**
   Install all the required project dependencies using npm:

   ```bash
   npm install

   ```

5. Setup Environment Variables

   ```bash
   touch .env.local
   ```

   Add the following environment variables for access to the database

   ```.env.local
    NEXT_PUBLIC_SUPABASE_URL = https://rrkuvuinyknyonbkavpw.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJya3V2dWlueWtueW9uYmthdnB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NzczODYsImV4cCI6MjA3ODU1MzM4Nn0.gepBZ4odLppCDiqsWwc1z4I2WGt5wN4aB1q_ZSSy8GU

   ```

6. **Run the development server:**
   Once the dependencies are installed, you can start the development server:

   ```bash
   npm run dev
   ```

   This will start the application in development mode. Open [http://localhost:3000](http://localhost:3000) with your browser to see the running application. The page will auto-update as you edit the code.

---

## 🛠️ Available Scripts

In the project directory, you can run:

* `npm run dev`: Runs the app in development mode.
* `npm run build`: Builds the app for production.
* `npm run start`: Starts a production server.
* `npm run lint`: Runs ESLint to check for code quality issues.
