# SpotVault - Dev Guide

## Quick Start
```bash
cd web
npm install
npm run dev -- --port 4000
```
Open http://localhost:4000

## Where to Edit Stuff

### 🏠 **Homepage** 
- **File:** `app/page.tsx`
- **What:** The main page users see
- **Edit:** Change the "Welcome to SpotVault" text, add buttons, etc.

### 🎨 **Styling**
- **File:** `app/globals.css` 
- **What:** Global styles and colors
- **Edit:** Change background colors, fonts, etc.

### 📱 **Layout & Navigation**
- **File:** `app/layout.tsx`
- **What:** Header, footer, navigation
- **Edit:** Add menu items, change the "SpotVault" title

### 🧩 **Components**
- **Folder:** `components/`
- **What:** Reusable pieces (buttons, cards, etc.)
- **Create:** `Button.tsx`, `Card.tsx`, etc.

### 📄 **New Pages**
- **Create:** `app/about/page.tsx` → becomes `/about`
- **Create:** `app/contact/page.tsx` → becomes `/contact`

## Common Tasks

**Add a new button:**
```jsx
<button className="bg-blue-500 text-white px-4 py-2 rounded">
  Click me!
</button>
```

**Change colors:**
- Use Tailwind classes: `bg-red-500`, `text-blue-600`, etc.
- Or edit `globals.css` for custom colors

**Add a new page:**
1. Create `app/your-page/page.tsx`
2. Add a link in `layout.tsx` or `page.tsx`

## Need Help?
- Tailwind docs: https://tailwindcss.com/docs
- Next.js docs: https://nextjs.org/docs
- Just ask in the group chat! 😊
