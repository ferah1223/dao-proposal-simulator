'use client';

import { VoteResults } from '@/lib/types';

interface VoteResultsCardProps {
  results: VoteResults;
  choices: string[];
  end: number;
}

export function VoteResultsCard({ results, choices, end }: VoteResultsCardProps) {
  const endDate = new Date(end * 1000);
  const now = new Date();
  const isActive = endDate > now;
  const timeDiff = endDate.getTime() - now.getTime();
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div className="bg-surface rounded-lg border border-gray-200 p-6">
      <h3 className="font-display font-semibold text-lg text-primary mb-4">Vote Results</h3>

      {/* Stacked Bar */}
      <div className="flex h-6 rounded-sm overflow-hidden bg-gray-100 mb-4">
        <div
          className="bg-success flex items-center justify-center text-white text-xs font-medium vote-bar-animate"
          style={{ width: `${results.forPercent}%` }}
        >
          {results.forPercent > 10 && `${results.forPercent.toFixed(1)}%`}
        </div>
        <div
          className="bg-danger flex items-center justify-center text-white text-xs font-medium vote-bar-animate"
          style={{ width: `${results.againstPercent}%` }}
        >
          {results.againstPercent > 10 && `${results.againstPercent.toFixed(1)}%`}
        </div>
        <div
          className="bg-abstain flex items-center justify-center text-white text-xs font-medium vote-bar-animate"
          style={{ width: `${results.abstainPercent}%` }}
        >
          {results.abstainPercent > 10 && `${results.abstainPercent.toFixed(1)}%`}
        </div>
      </div>

      {/* Percentage Labels */}
      <div className="flex justify-between mb-6">
        <div className="text-center">
          <div className="flex items-center gap-1.5 justify-center">
            <span className="w-3 h-3 rounded-sm bg-success" />
            <span className="text-xs font-medium text-primary">✓ For</span>
          </div>
          <div className="font-mono text-sm text-primary mt-1">{results.forPercent.toFixed(1)}%</div>
          <div className="text-xs text-secondary">{results.for.toLocaleString(undefined, { maximumFractionDigits: 0 })} votes</div>
        </div>
        <div className="text-center">
          <div className="flex items-center gap-1.5 justify-center">
            <span className="w-3 h-3 rounded-sm bg-danger" />
            <span className="text-xs font-medium text-primary">✗ Against</span>
          </div>
          <div className="font-mono text-sm text-primary mt-1">{results.againstPercent.toFixed(1)}%</div>
          <div className="text-xs text-secondary">{results.against.toLocaleString(undefined, { maximumFractionDigits: 0 })} votes</div>
        </div>
        <div className="text-center">
          <div className="flex items-center gap-1.5 justify-center">
            <span className="w-3 h-3 rounded-sm bg-abstain" />
            <span className="text-xs font-medium text-primary">○ Abstain</span>
          </div>
          <div className="font-mono text-sm text-primary mt-1">{results.abstainPercent.toFixed(1)}%</div>
          <div className="text-xs text-secondary">{results.abstain.toLocaleString(undefined, { maximumFractionDigits: 0 })} votes</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface-alt rounded-md p-3">
          <div className="text-xs text-secondary mb-1">Total Votes</div>
          <div className="font-mono font-medium text-primary">{results.totalVoters.toLocaleString()}</div>
        </div>
        <div className="bg-surface-alt rounded-md p-3">
          <div className="text-xs text-secondary mb-1">Voting Power</div>
          <div className="font-mono font-medium text-primary">{results.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        </div>
      </div>

      {/* Quorum */}
      {results.quorum > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-secondary">Quorum</span>
            <span className={`font-mono font-medium ${results.quorumReached ? 'text-success' : 'text-danger'}`}>
              {results.quorumReached ? 'Reached' : 'Not Reached'}
            </span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${results.quorumReached ? 'bg-success' : 'bg-tertiary'}`}
              style={{ width: `${Math.min((results.for / results.quorum) * 100, 100)}%` }}
            />
          </div>
          <div className="text-xs text-secondary mt-1 font-mono">
            {results.for.toLocaleString(undefined, { maximumFractionDigits: 0 })} / {results.quorum.toLocaleString()}
          </div>
        </div>
      )}

      {/* Time Remaining */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        {isActive ? (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-primary">
              <span className="font-mono font-medium">{days}d {hours}h {minutes}m</span> remaining
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-secondary">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm">Voting ended on {endDate.toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}
