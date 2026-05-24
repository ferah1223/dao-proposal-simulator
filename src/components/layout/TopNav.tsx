'use client';

import Link from 'next/link';
import { useState } from 'react';

export function TopNav() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  return (
    <nav className="bg-surface border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-tertiary rounded-md flex items-center justify-center">
              <span className="text-white font-bold font-display text-sm">G</span>
            </div>
            <span className="font-display font-bold text-xl text-primary">GovSim</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form
              action="/"
              className="w-full"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search DAOs..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearch(e.target.value.length > 0);
                  }}
                  onFocus={() => searchQuery.length > 0 && setShowSearch(true)}
                  onBlur={() => setTimeout(() => setShowSearch(false), 200)}
                  className="w-full bg-surface-alt rounded-full py-2.5 pl-10 pr-4 text-sm text-primary placeholder-secondary focus:outline-none focus:ring-2 focus:ring-tertiary focus:bg-surface transition-colors"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {showSearch && searchQuery && (
                <div className="absolute mt-1 w-full max-w-md bg-surface rounded-lg shadow-modal border border-gray-200 p-2">
                  <a
                    href={`/?search=${encodeURIComponent(searchQuery)}`}
                    className="block px-3 py-2 text-sm text-primary hover:bg-surface-alt rounded-md"
                  >
                    Search for &quot;{searchQuery}&quot;
                  </a>
                </div>
              )}
            </form>
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium text-secondary hover:text-primary transition-colors">
              Browse DAOs
            </Link>
            <button className="bg-tertiary hover:bg-tertiary-hover text-white text-sm font-medium px-4 py-2 rounded-md transition-colors">
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
