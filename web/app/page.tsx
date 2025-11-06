// Homepage - First page users see
// To edit: Change the title, add/remove buttons, change button colors or links
export default function Home() {
  return (
    <div className="font-sans min-h-screen flex items-center justify-center p-8">
      <main className="flex flex-col gap-8 items-center">
        {/* Change "SpotVault" to whatever you want */}
        <h1 className="text-5xl font-bold">SpotVault</h1>

        {/* Add more buttons here or change the existing ones */}
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          {/* Button to create new spot - change href to go to a different page */}
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-green-500 text-white gap-2 hover:bg-green-600 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/spots/new"
          >
            + New Spot
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
            href="/spots"
          >
            View My Spots
          </a>
          <a
            className="rounded-full border border-solid border-green-500 bg-green-500 text-white transition-colors flex items-center justify-center hover:bg-green-600 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
            href="/dev-guide"
          >
            📝 Dev Guide
          </a>
        </div>
      </main>
    </div>
  );
}
