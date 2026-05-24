'use client';

import { useQuery } from '@tanstack/react-query';
import { getProposal, getVotes, computeVoteResults, getProposals } from '@/lib/snapshot';
import { VoteResultsCard } from '@/components/proposal/VoteResultsCard';
import { SimulateVotePanel } from '@/components/simulate/SimulateVotePanel';
import { ProposalStatusBadge } from '@/components/proposal/ProposalCard';
import { TopNav } from '@/components/layout/TopNav';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface PageProps {
  params: Promise<{ space: string; id: string }>;
}

export default async function ProposalDetailPage({ params }: PageProps) {
  const { space, id } = await params;
  return <ProposalDetailContent spaceId={decodeURIComponent(space)} proposalId={decodeURIComponent(id)} />;
}

function ProposalDetailContent({ spaceId, proposalId }: { spaceId: string; proposalId: string }) {
  const { data: proposal, isLoading: proposalLoading, error: proposalError } = useQuery({
    queryKey: ['proposal', proposalId],
    queryFn: () => getProposal(proposalId),
  });

  const { data: votes, isLoading: votesLoading } = useQuery({
    queryKey: ['votes', proposalId],
    queryFn: () => getVotes(proposalId, 100),
    enabled: !!proposal,
  });

  const { data: relatedProposals } = useQuery({
    queryKey: ['proposals', spaceId, 'active'],
    queryFn: () => getProposals(spaceId, 'all', 5, 0),
    enabled: !!proposal,
  });

  const isLoading = proposalLoading;

  // Compute vote results
  const voteResults = proposal ? computeVoteResults(proposal) : null;
  const isActive = proposal ? proposal.state === 'active' : false;
  const userVP = 100; // Simulated user voting power

  if (proposalError) {
    return (
      <>
        <TopNav />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-danger-light text-danger rounded-lg p-6 text-center max-w-md mx-auto">
            <h3 className="font-semibold mb-2">Unable to load proposal</h3>
            <p className="text-sm">The proposal could not be found or Snapshot is unavailable.</p>
            <Link href={`/dao/${spaceId}`} className="inline-block mt-4 text-sm font-medium underline">
              Back to proposals
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <TopNav />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-secondary mb-6">
          <Link href="/" className="hover:text-primary transition-colors">DAOs</Link>
          <span>/</span>
          <Link href={`/dao/${spaceId}`} className="hover:text-primary transition-colors">
            {proposal?.space?.name || spaceId}
          </Link>
          <span>/</span>
          <span className="text-primary font-medium">Proposal</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Proposal Header */}
            {isLoading ? (
              <div className="bg-surface rounded-lg border border-gray-200 p-6 animate-pulse">
                <div className="h-5 bg-surface-alt rounded w-20 mb-3" />
                <div className="h-8 bg-surface-alt rounded w-3/4 mb-4" />
                <div className="h-4 bg-surface-alt rounded w-48" />
              </div>
            ) : proposal ? (
              <div className="bg-surface rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <ProposalStatusBadge state={proposal.state} />
                  <span className="text-xs font-mono text-secondary">#{proposal.id.slice(0, 8)}</span>
                </div>
                <h1 className="font-display font-bold text-2xl md:text-3xl text-primary mb-4 leading-tight">
                  {proposal.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-secondary">
                  <div className="flex items-center gap-1.5">
                    <span>by</span>
                    <a
                      href={`https://etherscan.io/address/${proposal.author}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-tertiary hover:underline"
                    >
                      {proposal.author.slice(0, 6)}...{proposal.author.slice(-4)}
                    </a>
                  </div>
                  <span>·</span>
                  <span>{new Date(proposal.created * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span>·</span>
                  <span>Ends {new Date(proposal.end * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <a
                    href={`https://snapshot.org/#/${spaceId}/proposal/${proposalId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-tertiary hover:underline flex items-center gap-1"
                  >
                    View on Snapshot
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <button className="text-sm text-secondary hover:text-primary flex items-center gap-1 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share
                  </button>
                </div>
              </div>
            ) : null}

            {/* Proposal Body */}
            {isLoading ? (
              <div className="bg-surface rounded-lg border border-gray-200 p-6 animate-pulse">
                <div className="space-y-3">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="h-4 bg-surface-alt rounded" style={{ width: `${Math.random() * 40 + 60}%` }} />
                  ))}
                </div>
              </div>
            ) : proposal ? (
              <div className="bg-surface rounded-lg border border-gray-200 p-6">
                <h2 className="font-display font-semibold text-lg text-primary mb-4">Description</h2>
                <div className="prose prose-sm max-w-none text-primary/90 prose-headings:font-display prose-a:text-tertiary">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {proposal.body || 'No description provided.'}
                  </ReactMarkdown>
                </div>

                {/* Voting Choices */}
                {proposal.choices && proposal.choices.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h3 className="font-display font-semibold text-sm text-primary mb-3 uppercase tracking-wider">Voting Options</h3>
                    <div className="flex flex-wrap gap-2">
                      {proposal.choices.map((choice, i) => (
                        <span
                          key={i}
                          className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                            i === 0 ? 'bg-success-light text-success' :
                            i === 1 ? 'bg-danger-light text-danger' :
                            'bg-abstain-light text-abstain'
                          }`}
                        >
                          {choice}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            {/* Vote Results */}
            {voteResults && proposal && (
              <VoteResultsCard
                results={voteResults}
                choices={proposal.choices}
                end={proposal.end}
              />
            )}

            {/* Recent Votes */}
            {votes && votes.length > 0 && (
              <div className="bg-surface rounded-lg border border-gray-200 p-6">
                <h3 className="font-display font-semibold text-lg text-primary mb-4">Recent Votes</h3>
                <div className="space-y-3">
                  {votes.slice(0, 10).map((vote) => (
                    <div key={vote.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm text-tertiary">
                          {vote.voter.slice(0, 6)}...{vote.voter.slice(-4)}
                        </span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          vote.choice === 1 ? 'bg-success-light text-success' :
                          vote.choice === 2 ? 'bg-danger-light text-danger' :
                          'bg-abstain-light text-abstain'
                        }`}>
                          {proposal?.choices?.[vote.choice - 1] || `Option ${vote.choice}`}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-sm text-primary">{vote.vp.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                        <div className="text-xs text-secondary">{new Date(vote.created * 1000).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Simulate Vote Panel */}
            {voteResults && proposal && (
              <SimulateVotePanel
                results={voteResults}
                choices={proposal.choices}
                userVP={userVP}
                isActive={isActive}
              />
            )}

            {/* DAO Quick Info */}
            {proposal && (
              <div className="bg-surface rounded-lg border border-gray-200 p-5">
                <h3 className="font-display font-semibold text-sm text-secondary uppercase tracking-wider mb-3">DAO Info</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-surface-alt flex items-center justify-center overflow-hidden">
                    <img
                      src={`https://cdn.stamp.fyi/space/${spaceId}?s=80`}
                      alt={proposal.space?.name || spaceId}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                  <div>
                    <Link href={`/dao/${spaceId}`} className="font-display font-semibold text-primary hover:text-tertiary transition-colors">
                      {proposal.space?.name || spaceId}
                    </Link>
                    <p className="text-xs text-secondary">{proposal.space?.members?.length || 0} members</p>
                  </div>
                </div>
                <Link
                  href={`/dao/${spaceId}`}
                  className="block w-full text-center py-2 rounded-md bg-surface-alt text-sm font-medium text-primary hover:bg-gray-200 transition-colors"
                >
                  View All Proposals
                </Link>
              </div>
            )}

            {/* Related Proposals */}
            {relatedProposals && relatedProposals.length > 0 && (
              <div className="bg-surface rounded-lg border border-gray-200 p-5">
                <h3 className="font-display font-semibold text-sm text-secondary uppercase tracking-wider mb-3">Related Proposals</h3>
                <div className="space-y-3">
                  {relatedProposals
                    .filter((p) => p.id !== proposalId)
                    .slice(0, 3)
                    .map((p) => (
                      <Link
                        key={p.id}
                        href={`/dao/${spaceId}/proposal/${p.id}`}
                        className="block p-3 rounded-md hover:bg-surface-alt transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <ProposalStatusBadge state={p.state} />
                        </div>
                        <h4 className="text-sm font-medium text-primary line-clamp-2">{p.title}</h4>
                        <p className="text-xs text-secondary mt-1">{new Date(p.created * 1000).toLocaleDateString()}</p>
                      </Link>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
