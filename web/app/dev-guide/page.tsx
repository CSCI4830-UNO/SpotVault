import Link from "next/link";

export default function DevGuide() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">📝 SpotVault Dev Guide</h1>
        
        <div className="space-y-8">
          {/* Quick Start */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">🚀 Quick Start</h2>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <code className="text-sm">
                cd web<br/>
                npm install<br/>
                npm run dev -- --port 4000
              </code>
            </div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Open http://localhost:4000</p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">To stop the server: Press Ctrl + C in your terminal</p>
          </section>

          {/* Main Parts */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">📁 Main Parts of the Project</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">🏠 Homepage</h3>
                <p><strong>File:</strong> app/page.tsx</p>
                <p className="mt-2">The first page users see when they visit the site.</p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Change: Title text, add/remove buttons, change button colors or links</p>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">📍 Spot Management Pages</h3>
                <p><strong>View All Spots:</strong> app/spots/page.tsx</p>
                <p><strong>Create New Spot:</strong> app/spots/new/page.tsx</p>
                <p><strong>Edit Spot:</strong> app/spots/[id]/edit/page.tsx</p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Change: How spots are displayed, form fields, validation, buttons</p>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">🗺️ Map Component</h3>
                <p><strong>File:</strong> components/Map.tsx</p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Change: Default location (initialLat, initialLng), zoom level (initialZoom), map height (h-[400px])</p>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">💾 Spot Data Storage</h3>
                <p><strong>File:</strong> utils/spotStorage.ts</p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Currently uses browser localStorage. Will be replaced with database later.</p>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">📊 Spot Data Type</h3>
                <p><strong>File:</strong> types/spot.ts</p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Defines what information a spot contains. Add new fields here first.</p>
              </div>
            </div>
          </section>

          {/* Common Tasks */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">💡 Common Tasks</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Add a new button:</h3>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded mt-2">
                  <code className="text-sm">
                    &lt;button className="bg-blue-500 text-white px-4 py-2 rounded"&gt;<br/>
                    &nbsp;&nbsp;Click me!<br/>
                    &lt;/button&gt;
                  </code>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold">Change colors:</h3>
                <p>Use Tailwind classes: bg-red-500, text-blue-600, etc.</p>
              </div>
              
              <div>
                <h3 className="font-semibold">Add a new page:</h3>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Create app/your-page/page.tsx</li>
                  <li>Add a link using &lt;Link href="/your-page"&gt;</li>
                </ol>
              </div>
            </div>
          </section>

          {/* Future Goals */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">🎯 Future Goals / Things to Work On</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">🚀 Deployment & Hosting</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Deploy to Vercel</li>
                  <li>Set up environment variables</li>
                </ul>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">💾 Backend & Database</h3>
                <p className="text-sm mb-2">Replace localStorage with a real database</p>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-sm">
                  <p className="font-semibold mb-2">When we start on backend: Gonna use Next.js API Routes & Supabase, do this:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Sign up for Supabase and create a new project</li>
                    <li>Create a spots table in the database</li>
                    <li>Create app/api/spots/route.ts for API endpoints</li>
                    <li>Update utils/spotStorage.ts to use fetch('/api/spots') instead of localStorage</li>
                    <li>Connect Supabase client to the API routes</li>
                  </ol>
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                  <li>Add user accounts</li>
                  <li>User-specific spots</li>
                </ul>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">📸 Photo Upload</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Add photo upload functionality</li>
                  <li>Image storage (Cloudinary, AWS S3, or Vercel Blob)</li>
                  <li>Photo display on spots list and detail pages</li>
                </ul>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">🔍 Search & Filter</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Search spots by name or description</li>
                  <li>Filter by location, date created, etc.</li>
                  <li>Sort by name, date, location, etc.</li>
                </ul>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">📍 Map Features</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Show all spots on map</li>
                  <li>Spot detail page</li>
                  <li>Better map styling</li>
                </ul>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">🎨 UI Improvements</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Better empty states</li>
                  <li>Loading states</li>
                  <li>Error messages</li>
                  <li>Responsive design</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Helpful Links */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">🔗 Need Help?</h2>
            <div className="space-y-2">
              <a href="https://tailwindcss.com/docs" target="_blank" rel="noopener noreferrer" 
                 className="text-blue-500 hover:underline block">Tailwind CSS Docs</a>
              <a href="https://nextjs.org/docs" target="_blank" rel="noopener noreferrer" 
                 className="text-blue-500 hover:underline block">Next.js Docs</a>
              <a href="https://maplibre.org/maplibre-gl-js-docs/" target="_blank" rel="noopener noreferrer" 
                 className="text-blue-500 hover:underline block">MapLibre GL Docs</a>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Ask in the group chat! 😊</p>
          </section>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <Link href="/" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
