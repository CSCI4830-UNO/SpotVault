// Homepage - First page users see
import Map from "@/components/Map";

export default function Home() {


  return (
    <div className="h-full p-2 text-white flex flex-col gap-2">
      

        <div className="flex gap-2 overflow-hidden h-[70vh]">
          
          <main className="flex-[2.7] rounded-lg bg-black p-4">
            <Map />
          </main>

          <aside className="flex-[1.3] rounded-lg bg-black p-4">
            Sidebar
          </aside>
        </div>

        <footer className="h-[20vh] flex-shrink-0 rounded-lg bg-black p-4">
          Player Bar / Footer
        </footer>
    </div>
  );
}
