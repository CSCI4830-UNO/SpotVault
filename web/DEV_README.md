# SpotVault - Dev Guide

## Quick Start
```bash
cd web
npm install
npm run dev -- --port 4000
```
Open http://localhost:4000

**To stop the server:** Press `Ctrl + C` in your terminal

---

## Main Parts of the Project

### 🏠 Homepage
**File:** `app/page.tsx`

This is the first page users see when they visit the site.

**What you can change:**
- The "SpotVault" title text
- Add/remove buttons
- Change button colors or text
- Add new links

**Example:** To change the title, find `<h1 className="text-5xl font-bold">SpotVault</h1>` and change "SpotVault" to whatever you want.

---

### 📍 Spot Management Pages

#### View All Spots
**File:** `app/spots/page.tsx`

This page shows a list of all saved spots.

**What you can change:**
- How spots are displayed (cards, list, grid, etc.)
- What information is shown for each spot
- The delete/edit buttons
- Add new buttons or links

#### Create New Spot
**File:** `app/spots/new/page.tsx`

This is the form where users create new spots.

**What you can change:**
- Add/remove form fields (name, description, etc.)
- Change the form layout
- Add validation rules
- Modify the submit button

#### Edit Spot
**File:** `app/spots/[id]/edit/page.tsx`

This is the form where users edit existing spots.

**What you can change:**
- Same as create page above
- How existing data is loaded and displayed

---

### 🗺️ Map Component
**File:** `components/Map.tsx`

This is the interactive map that shows on the create/edit spot pages.

**What you can change:**
- Default location (currently set to Omaha, NE)
- Map zoom level
- Map height (currently 400px)
- Map style/tiles (currently using OpenStreetMap)

**Common modifications:**
- **Change default location:** Find `initialLat = 41.2565` and `initialLng = -95.9345` and change the numbers
- **Change map height:** Find `h-[400px]` and change to `h-[500px]` or whatever height you want
- **Change zoom level:** Find `initialZoom = 12` and change the number (higher = more zoomed in)

**Important:** The map uses MapLibre GL JS. If you want to change the map style, you'll need to modify the `style` object in the map initialization.

---

### 💾 Spot Data Storage
**File:** `utils/spotStorage.ts`

This file handles saving and loading spots from the browser's storage.

**What it does:**
- Saves spots to localStorage
- Loads all spots
- Deletes spots
- Generates unique IDs for new spots

**Note:** This currently uses browser localStorage (data stays in the browser). Later, this will be replaced with a real database.

**What you can change:**
- How spots are stored
- Add new storage functions
- Change how IDs are generated

---

### 📊 Spot Data Type
**File:** `types/spot.ts`

This defines what a "spot" looks like - what information it contains.

**Current fields:**
- `id` - unique identifier
- `name` - spot name
- `description` - optional description
- `latitude` - location latitude
- `longitude` - location longitude
- `photos` - array of photo URLs (not implemented yet)
- `createdAt` - when it was created
- `updatedAt` - when it was last updated

**To add a new field:**
1. Add it to the `Spot` interface in this file
2. Update the create/edit forms to include the new field
3. Update the storage functions if needed

---

### 🎨 Styling
**File:** `app/globals.css`

This file contains global styles that apply to the whole app.

**What you can change:**
- Background colors
- Text colors
- Font settings
- Dark mode colors

**How to style components:**
- Use Tailwind CSS classes (like `bg-blue-500`, `text-white`, etc.)
- Or add custom CSS in this file

---

### 📱 App Layout
**File:** `app/layout.tsx`

This wraps all pages and sets up the overall app structure.

**What you can change:**
- Page title (currently "SpotVault")
- Add a header/navigation bar
- Add a footer
- Change fonts

---

## Common Tasks

### Add a New Button
Just add this anywhere in a page:
```jsx
<button className="bg-blue-500 text-white px-4 py-2 rounded">
  Click me!
</button>
```

### Change Colors
Use Tailwind classes like:
- `bg-red-500` - red background
- `text-blue-600` - blue text
- `hover:bg-green-500` - green on hover

### Add a New Page
1. Create a new folder in `app/` (e.g., `app/about/`)
2. Create `page.tsx` inside it
3. Add a link to it from another page using `<Link href="/about">About</Link>`

### Modify the Map
1. Open `components/Map.tsx`
2. Find what you want to change (default location, zoom, height, etc.)
3. Change the numbers/values
4. Save and refresh the page

---

## Project Structure
```
web/
├── app/                    # All pages and routes
│   ├── page.tsx           # Homepage
│   ├── spots/             # Spot-related pages
│   │   ├── page.tsx       # View all spots
│   │   ├── new/           # Create new spot
│   │   └── [id]/edit/     # Edit existing spot
│   └── layout.tsx         # App layout
├── components/            # Reusable components
│   └── Map.tsx            # Map component
├── types/                 # TypeScript type definitions
│   └── spot.ts            # Spot data type
├── utils/                 # Helper functions
│   └── spotStorage.ts     # Storage functions
└── package.json           # Dependencies
```

---

## Need Help?

- **Tailwind CSS:** https://tailwindcss.com/docs
- **Next.js:** https://nextjs.org/docs
- **MapLibre GL:** https://maplibre.org/maplibre-gl-js-docs/
- **Ask in the group chat!** 😊

---

## Future Goals / Things to Work On

Here are some things that haven't been done yet that someone could work on:

### 🚀 Deployment & Hosting
- **Deploy to Vercel** - Deploy the Next.js app to Vercel
- **Set up environment variables** - Add API keys and database connection strings

### 💾 Backend & Database
- **Replace localStorage with a real database** - Currently spots are stored in the browser

**When we start on backend: Gonna use Next.js API Routes & Supabase, do this:**
1. Sign up for Supabase and create a new project
2. Create a `spots` table in the database
3. Create `app/api/spots/route.ts` for API endpoints
4. Update `utils/spotStorage.ts` to use `fetch('/api/spots')` instead of localStorage
5. Connect Supabase client to the API routes

- **Add user accounts** - Users should be able to sign up and log in
- **User-specific spots** - Each user should only see their own spots

### 📸 Photo Upload
- **Add photo upload functionality** - The Spot type has a `photos` field but it's not implemented
- **Image storage** - Use Cloudinary, AWS S3, or Vercel Blob Storage
- **Photo display** - Show photos on spots list and detail pages

### 🔍 Search & Filter
- **Search spots** - Add search by name or description
- **Filter spots** - Filter by location, date created, etc.
- **Sort spots** - Sort by name, date, location, etc.

### 📍 Map Features
- **Show all spots on map** - Display all spots as markers on a map view
- **Spot detail page** - Create a detail page for individual spots
- **Map styling** - Customize map colors and styles

### 🎨 UI Improvements
- **Empty states** - Improve the "no spots" message
- **Loading states** - Add loading spinners when saving/deleting
- **Error messages** - Add error handling and user-friendly messages
- **Responsive design** - Improve mobile/tablet layout

### 🔐 Security & Data Protection
- **Input validation** - Add validation on frontend and backend
- **Data encryption** - Encrypt sensitive data
- **Rate limiting** - Add rate limiting to prevent abuse

### 📊 Other Features
- **Spot categories/tags** - Add categories for spots (restaurant, park, etc.)
- **Favorites** - Add ability to mark spots as favorites
- **Share spots** - Add sharing functionality
- **Export data** - Export spots as CSV or JSON

### 📝 Documentation
- **API documentation** - Document API endpoints
- **Component documentation** - Add comments to complex components
