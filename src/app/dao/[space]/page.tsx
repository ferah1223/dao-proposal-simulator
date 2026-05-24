'use client';

import { useQuery } from '@tanstack/react-query';
import { getSpace, getProposals } from '@/lib/snapshot';
import { ProposalCard } from '@/components/proposal/ProposalCard';
import { TopNav } from '@/components/layout/TopNav';
import { useState } from 'react';
import Link from 'next/link';

type StatusFilter = 'all' | 'active' | 'pending' | 'closed';

interface PageProps {
  params: Promise<{ space: string }>;
}

export default async function DAOSpacePage({ params }: PageProps) {
  const { space } = await params;
  const decodedSpace = decodeURIComponent(space);

  return <DAOSpaceContent spaceId={decodedSpace} />;
}

function DAOSpaceContent({ spaceId }: { spaceId: string }) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('active');

  const { data: space, isLoading: spaceLoading } = useQuery({
    queryKey: ['space', spaceId],
    queryFn: () => getSpace(spaceId),
  });

  const { data: proposals, isLoading: proposalsLoading, error } = useQuery({
    queryKey: ['proposals', spaceId, statusFilter],
    queryFn: () => getProposals(spaceId, statusFilter, 20, 0),
  });

  const isLoading = spaceLoading || proposalsLoading;

  return (
    <>
      <TopNav />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-secondary mb-6">
          <Link href="/" className="hover:text-primary transition-colors">DAOs</Link>
          <span>/</span>
          <span className="text-primary font-medium">{space?.name || spaceId}</span>
        </nav>

        {/* DAO Header */}
        <div className="bg-surface rounded-lg border border-gray-200 p-6 mb-6">
          {spaceLoading ? (
            <div className="animate-pulse flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-surface-alt" />
              <div>
                <div className="h-5 bg-surface-alt rounded w-48 mb-2" />
                <div className="h-3 bg-surface-alt rounded w-64" />
              </div>
            </div>
          ) : space ? (
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-surface-alt flex-shrink-0 overflow-hidden flex items-center justify-center">
                {space.avatar ? (
                  <img
                    src={`https://cdn.stamp.fyi/space/${spaceId}?s=96`}
                    alt={space.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <span className="text-lg font-bold text-secondary">{(space.name || spaceId).charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="flex-1">
                <h1 className="font-display font-bold text-2xl text-primary">{space.name || spaceId}</h1>
                {space.about && (
                  <p className="text-sm text-secondary mt-1 line-clamp-2">{space.about}</p>
                )}
                <div className="flex items-center gap-4 mt-3 text-xs text-secondary">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-mono">{space.members?.length?.toLocaleString() || 0}</span> members
                  </span>
                  {space.symbol && (
                    <span className="font-mono bg-surface-alt px-1.5 py-0.5 rounded">{space.symbol}</span>
                  )}
                  <a
                    href={`https://snapshot.org/#/${spaceId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-tertiary hover:underline"
                  >
                    View on Snapshot ↗
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-secondary">Space not found.</p>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {(['active', 'pending', 'closed', 'all'] as StatusFilter[]).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-tertiary text-white'
                  : 'bg-surface border border-gray-200 text-secondary hover:text-primary'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-surface rounded-lg border border-gray-200 p-5 animate-pulse">
                <div className="h-4 bg-surface-alt rounded w-24 mb-3" />
                <div className="h-5 bg-surface-alt rounded w-3/4 mb-2" />
                <div className="h-3 bg-surface-alt rounded w-full mb-4" />
                <div className="h-2 bg-surface-alt rounded-full w-full" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-danger-light text-danger rounded-lg p-6 text-center">
            <h3 className="font-semibold mb-2">Unable to load proposals</h3>
            <p className="text-sm">Please try again later.</p>
          </div>
        )}

        {/* Proposal List */}
        {proposals && !isLoading && (
          <div className="space-y-4">
            {proposals.length === 0 ? (
              <div className="text-center py-12 bg-surface rounded-lg border border-gray-200">
                <p className="text-secondary">No {statusFilter !== 'all' ? statusFilter : ''} proposals found.</p>
              </div>
            ) : (
              proposals.map((proposal) => (
                <ProposalCard
                  key={proposal.id}
                  id={proposal.id}
                  title={proposal.title}
                  body={proposal.body || ''}
                  state={proposal.state}
                  author={proposal.author}
                  created={proposal.created}
                  end={proposal.end}
                  scores={proposal.scores || [0, 0, 0]}
                  scores_total={proposal.scores_total || 0}
                  votes={proposal.votes || 0}
                  choices={proposal.choices || ['For', 'Against', 'Abstain']}
                  quorum={proposal.quorum || 0}
                  spaceId={spaceId}
                />
              ))
            )}
          </div>
        )}
      </main>
    </>
  );
}
