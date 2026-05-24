'use client';

import { useQuery } from '@tanstack/react-query';
import { getSpaces, searchSpaces } from '@/lib/snapshot';
import { DAOCard } from '@/components/dao/DAOCard';
import { TopNav } from '@/components/layout/TopNav';
import { useState } from 'react';

const categories = ['All', 'DeFi', 'Protocol', 'Social', 'NFT', 'Infrastructure'];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [page, setPage] = useState(0);

  const { data: spaces, isLoading, error } = useQuery({
    queryKey: ['spaces', searchQuery, page],
    queryFn: () =>
      searchQuery
        ? searchSpaces(searchQuery)
        : getSpaces(24, page * 24),
  });

  return (
    <>
      <TopNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="font-display font-bold text-3xl md:text-4xl text-primary mb-3">
            Browse DAOs
          </h1>
          <p className="text-secondary max-w-2xl mx-auto">
            Explore decentralized autonomous organizations, view their proposals, and simulate your vote impact before casting it.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search DAOs by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface rounded-full py-3 pl-12 pr-4 text-sm text-primary placeholder-secondary border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent shadow-sm"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-tertiary text-white'
                  : 'bg-surface border border-gray-200 text-secondary hover:text-primary hover:border-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-surface rounded-lg border border-gray-200 p-6 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-surface-alt" />
                  <div className="flex-1">
                    <div className="h-4 bg-surface-alt rounded w-3/4 mb-2" />
                    <div className="h-3 bg-surface-alt rounded w-full mb-3" />
                    <div className="h-3 bg-surface-alt rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-danger-light text-danger rounded-lg p-6 max-w-md mx-auto">
              <h3 className="font-semibold mb-2">Unable to load DAOs</h3>
              <p className="text-sm">
                Snapshot&apos;s API is currently unavailable. Please try again later.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 text-sm font-medium underline"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* DAO Grid */}
        {spaces && !isLoading && (
          <>
            {spaces.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-secondary">No DAOs found. Try a different search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {spaces.map((space) => (
                  <DAOCard
                    key={space.id}
                    id={space.id}
                    name={space.name || space.id}
                    about={space.about || ''}
                    members={space.members || []}
                    avatar={space.avatar}
                    symbol={space.symbol || ''}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!searchQuery && (
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 rounded-md text-sm font-medium bg-surface border border-gray-200 text-primary hover:bg-surface-alt disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm text-secondary">
                  Page {page + 1}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded-md text-sm font-medium bg-surface border border-gray-200 text-primary hover:bg-surface-alt transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
