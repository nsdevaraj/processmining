import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold">Process Mining Dashboard</div>
        </div>
        <div className="flex space-x-6">
          <Link href="/" className="hover:text-blue-200">
            Overview
          </Link>
          <Link href="/conformance" className="hover:text-blue-200">
            Conformance
          </Link>
          <Link href="/lead-time" className="hover:text-blue-200">
            Lead Time
          </Link>
          <Link href="/process-flow" className="hover:text-blue-200">
            Process Flow
          </Link>
          <Link href="/root-causes" className="hover:text-blue-200">
            Root Causes
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
