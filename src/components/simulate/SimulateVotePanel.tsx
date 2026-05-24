'use client';

import { useState, useMemo } from 'react';
import { VoteResults, SimulateResult } from '@/lib/types';
import { simulateVote } from '@/lib/snapshot';

interface SimulateVotePanelProps {
  results: VoteResults;
  choices: string[];
  userVP?: number;
  isActive: boolean;
}

type VoteChoice = 'for' | 'against' | 'abstain';

const choiceIcons: Record<VoteChoice, string> = {
  for: '✓',
  against: '✗',
  abstain: '○',
};

const choiceColors: Record<VoteChoice, { bg: string; hover: string; ring: string; text: string }> = {
  for: { bg: 'bg-success', hover: 'hover:bg-emerald-700', ring: 'ring-success', text: 'text-success' },
  against: { bg: 'bg-danger', hover: 'hover:bg-red-700', ring: 'ring-danger', text: 'text-danger' },
  abstain: { bg: 'bg-abstain', hover: 'hover:bg-violet-700', ring: 'ring-abstain', text: 'text-abstain' },
};

export function SimulateVotePanel({ results, choices, userVP = 100, isActive }: SimulateVotePanelProps) {
  const [selectedChoice, setSelectedChoice] = useState<VoteChoice | null>(null);

  const simulation: SimulateResult | null = useMemo(() => {
    if (!selectedChoice) return null;
    return simulateVote(results, selectedChoice, userVP);
  }, [selectedChoice, results, userVP]);

  const deltaLabel = (delta: number) => {
    const sign = delta > 0 ? '+' : '';
    return `${sign}${delta.toFixed(2)}%`;
  };

  return (
    <div className="simulate-panel">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <h3 className="font-display font-semibold text-lg text-primary">What if you voted...?</h3>
      </div>

      {/* Vote Choice Buttons */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {(['for', 'against', 'abstain'] as VoteChoice[]).map((choice, i) => (
          <button
            key={choice}
            onClick={() => setSelectedChoice(choice === selectedChoice ? null : choice)}
            className={`
              flex flex-col items-center gap-2 py-4 px-3 rounded-md font-medium text-white transition-all
              ${choiceColors[choice].bg} ${choiceColors[choice].hover}
              ${selectedChoice === choice ? `ring-2 ring-offset-2 ${choiceColors[choice].ring}` : ''}
              focus:outline-none focus:ring-2 focus:ring-offset-2 ${choiceColors[choice].ring}
            `}
            aria-pressed={selectedChoice === choice}
          >
            <span className="text-xl">{choiceIcons[choice]}</span>
            <span className="text-xs font-bold tracking-wider uppercase">
              {choices[i] || choice.charAt(0).toUpperCase() + choice.slice(1)}
            </span>
          </button>
        ))}
      </div>

      {/* Simulate Result */}
      {simulation && (
        <div className="animate-fade-in space-y-4">
          <div className="text-center text-sm text-secondary mb-2">
            Voting power: <span className="font-mono font-medium text-primary">{userVP.toLocaleString()}</span>
          </div>

          {/* Before / After Comparison */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
            {/* Before */}
            <div className="bg-surface rounded-md p-3 border border-gray-200">
              <div className="text-xs text-secondary text-center mb-2 font-medium">Before</div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success" /> For</span>
                  <span className="font-mono">{simulation.beforeForPercent.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-danger" /> Against</span>
                  <span className="font-mono">{simulation.beforeAgainstPercent.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-abstain" /> Abstain</span>
                  <span className="font-mono">{simulation.beforeAbstainPercent.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center gap-1">
              <svg className="w-6 h-6 text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <span className="text-xs text-secondary">shift</span>
            </div>

            {/* After */}
            <div className="bg-surface rounded-md p-3 border-2 border-tertiary/20">
              <div className="text-xs text-secondary text-center mb-2 font-medium">After</div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success" /> For</span>
                  <span className="font-mono font-medium">{simulation.afterForPercent.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-danger" /> Against</span>
                  <span className="font-mono font-medium">{simulation.afterAgainstPercent.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-abstain" /> Abstain</span>
                  <span className="font-mono font-medium">{simulation.afterAbstainPercent.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delta Display */}
          <div className="flex justify-center gap-6 py-3">
            <div className="text-center">
              <div className={`font-mono text-sm font-medium ${simulation.deltaFor > 0 ? 'text-success' : simulation.deltaFor < 0 ? 'text-danger' : 'text-secondary'}`}>
                {deltaLabel(simulation.deltaFor)} For
              </div>
            </div>
            <div className="text-center">
              <div className={`font-mono text-sm font-medium ${simulation.deltaAgainst > 0 ? 'text-danger' : simulation.deltaAgainst < 0 ? 'text-success' : 'text-secondary'}`}>
                {deltaLabel(simulation.deltaAgainst)} Against
              </div>
            </div>
            <div className="text-center">
              <div className={`font-mono text-sm font-medium ${simulation.deltaAbstain > 0 ? 'text-abstain' : 'text-secondary'}`}>
                {deltaLabel(simulation.deltaAbstain)} Abstain
              </div>
            </div>
          </div>

          {/* Impact Summary */}
          <div className="bg-surface rounded-md p-4 border border-gray-200 text-center">
            <p className="text-sm text-secondary">
              Your vote would shift <span className="font-semibold text-primary">For</span> from{' '}
              <span className="font-mono">{simulation.beforeForPercent.toFixed(1)}%</span> to{' '}
              <span className="font-mono">{simulation.afterForPercent.toFixed(1)}%</span>
              {simulation.deltaFor !== 0 && (
                <span className={simulation.deltaFor > 0 ? 'text-success' : 'text-danger'}>
                  {' '}({simulation.deltaFor > 0 ? '↑' : '↓'} {Math.abs(simulation.deltaFor).toFixed(2)}%)
                </span>
              )}
            </p>
          </div>

          {/* Cast Vote Button */}
          {isActive && (
            <button className="w-full bg-tertiary hover:bg-tertiary-hover text-white font-medium py-3.5 px-6 rounded-md transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-tertiary focus:ring-offset-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Vote Now
            </button>
          )}
        </div>
      )}

      {!simulation && (
        <p className="text-sm text-secondary text-center py-6">
          Select a vote option above to simulate the impact.
        </p>
      )}

      {/* Security Explanation */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-xs text-secondary">
            No gas, no risk — voting is a message signature, not a transaction. No funds are at risk.
          </p>
        </div>
      </div>
    </div>
  );
}
