export default function DevGuide() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">📝 SpotVault Dev Guide</h1>
        
        <div className="space-y-6">
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
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">📁 Where to Edit Stuff</h2>
            <div className="grid gap-4">
              <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold">🏠 Homepage</h3>
                <p><strong>File:</strong> app/page.tsx</p>
                <p><strong>What:</strong> The main page users see</p>
                <p><strong>Edit:</strong> Change the "Welcome to SpotVault" text, add buttons, etc.</p>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold">🎨 Styling</h3>
                <p><strong>File:</strong> app/globals.css</p>
                <p><strong>What:</strong> Global styles and colors</p>
                <p><strong>Edit:</strong> Change background colors, fonts, etc.</p>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold">📱 Layout & Navigation</h3>
                <p><strong>File:</strong> app/layout.tsx</p>
                <p><strong>What:</strong> Header, footer, navigation</p>
                <p><strong>Edit:</strong> Add menu items, change the "SpotVault" title</p>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold">🧩 Components</h3>
                <p><strong>Folder:</strong> components/</p>
                <p><strong>What:</strong> Reusable pieces (buttons, cards, etc.)</p>
                <p><strong>Create:</strong> Button.tsx, Card.tsx, etc.</p>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold">📄 New Pages</h3>
                <p><strong>Create:</strong> app/about/page.tsx → becomes /about</p>
                <p><strong>Create:</strong> app/contact/page.tsx → becomes /contact</p>
              </div>
            </div>
          </section>

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
                <p>Or edit globals.css for custom colors</p>
              </div>
              
              <div>
                <h3 className="font-semibold">Add a new page:</h3>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Create app/your-page/page.tsx</li>
                  <li>Add a link in layout.tsx or page.tsx</li>
                </ol>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">🔗 Helpful Links</h2>
            <div className="space-y-2">
              <a href="https://tailwindcss.com/docs" target="_blank" rel="noopener noreferrer" 
                 className="text-blue-500 hover:underline block">Tailwind CSS Docs</a>
              <a href="https://nextjs.org/docs" target="_blank" rel="noopener noreferrer" 
                 className="text-blue-500 hover:underline block">Next.js Docs</a>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Just ask in the group chat! 😊</p>
          </section>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <a href="/" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
            ← Back to Homepage
          </a>
        </div>
      </div>
    </div>
  );
}
