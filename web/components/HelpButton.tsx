"use client";

import { useState } from "react";
import HelpModal from "./HelpModal";

export default function HelpButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center text-xl font-bold shadow-lg transition-colors"
        title="Help & Reports"
        style={{ cursor: 'pointer' }}
      >
        ?
      </button>
      {isOpen && <HelpModal onClose={() => setIsOpen(false)} />}
    </>
  );
}

