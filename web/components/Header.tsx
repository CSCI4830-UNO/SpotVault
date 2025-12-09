"use client";

import Link from 'next/link';
import React from 'react';
import HelpButton from './HelpButton';

interface HeaderProps {
}

const Header: React.FC<HeaderProps> = ({}) => {
  
  return (
    <header >
      <nav className="container mx-auto flex justify-center p-7">
        <Link href="/" className="text-5xl font-bold tracking-widest">
          SpotVault
        </Link>
      </nav>
    </header>
  );
};

export default Header;