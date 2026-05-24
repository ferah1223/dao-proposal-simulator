'use client';

interface ProposalStatusBadgeProps {
  state: 'active' | 'pending' | 'closed';
}

const statusConfig = {
  active: {
    bg: 'bg-success-light',
    text: 'text-success',
    label: 'Active',
  },
  pending: {
    bg: 'bg-abstain-light',
    text: 'text-abstain',
    label: 'Pending',
  },
  closed: {
    bg: 'bg-surface-alt',
    text: 'text-secondary',
    label: 'Closed',
  },
};

export function ProposalStatusBadge({ state }: ProposalStatusBadgeProps) {
  const config = statusConfig[state] || statusConfig.closed;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}

interface ProposalCardProps {
  id: string;
  title: string;
  body: string;
  state: 'active' | 'pending' | 'closed';
  author: string;
  created: number;
  end: number;
  scores: number[];
  scores_total: number;
  votes: number;
  choices: string[];
  quorum: number;
  spaceId: string;
}

export function ProposalCard({
  id,
  title,
  body,
  state,
  author,
  created,
  end,
  scores,
  scores_total,
  votes,
  choices,
  quorum,
  spaceId,
}: ProposalCardProps) {
  const totalVotes = scores_total || (scores || []).reduce((a, b) => a + b, 0) || 1;
  const forPct = scores?.[0] ? (scores[0] / totalVotes) * 100 : 0;
  const againstPct = scores?.[1] ? (scores[1] / totalVotes) * 100 : 0;
  const abstainPct = scores?.[2] ? (scores[2] / totalVotes) * 100 : 0;
  const quorumPct = quorum > 0 ? Math.min(((scores?.[0] || 0) / quorum) * 100, 100) : 0;

  const stateBorder = state === 'active'
    ? 'border-l-4 border-l-success'
    : state === 'pending'
    ? 'border-l-4 border-l-abstain'
    : '';

  const endDate = new Date(end * 1000);
  const now = new Date();
  const timeRemaining = endDate > now
    ? `${Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))}d left`
    : 'Ended';

  return (
    <a
      href={`/dao/${spaceId}/proposal/${id}`}
      className={`block bg-surface rounded-lg border border-gray-200 p-5 hover:shadow-md hover:border-gray-300 transition-all group focus:outline-none focus:ring-2 focus:ring-tertiary ${stateBorder}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <ProposalStatusBadge state={state} />
            <span className="text-xs text-secondary font-mono">
              {timeRemaining}
            </span>
          </div>
          <h3 className="font-display font-semibold text-base text-primary group-hover:text-tertiary transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-secondary mt-1.5 line-clamp-2">
            {body?.replace(/[#*_`]/g, '').slice(0, 160) || 'No description provided.'}
          </p>
        </div>
      </div>

      {/* Vote Preview Bar */}
      <div className="mt-4">
        <div className="flex h-2 rounded-full overflow-hidden bg-gray-100">
          {forPct > 0 && (
            <div className="bg-success transition-all rounded-l-full" style={{ width: `${forPct}%` }} />
          )}
          {againstPct > 0 && (
            <div className="bg-danger transition-all" style={{ width: `${againstPct}%` }} />
          )}
          {abstainPct > 0 && (
            <div className="bg-abstain transition-all" style={{ width: `${abstainPct}%` }} />
          )}
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-secondary">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-success inline-block" />
              {forPct.toFixed(1)}%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-danger inline-block" />
              {againstPct.toFixed(1)}%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-abstain inline-block" />
              {abstainPct.toFixed(1)}%
            </span>
          </div>
          <span className="font-mono">{votes.toLocaleString()} votes</span>
        </div>
      </div>

      {/* Quorum indicator */}
      {quorum > 0 && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-secondary">Quorum</span>
            <span className={`font-mono ${quorumPct >= 100 ? 'text-success' : 'text-secondary'}`}>
              {((scores?.[0] || 0)).toLocaleString()} / {quorum.toLocaleString()}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${quorumPct >= 100 ? 'bg-success' : 'bg-tertiary'}`}
              style={{ width: `${quorumPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center gap-3 mt-3 text-xs text-secondary">
        <span className="font-mono" title={author}>
          {author.slice(0, 6)}...{author.slice(-4)}
        </span>
        <span>·</span>
        <span>{new Date(created * 1000).toLocaleDateString()}</span>
      </div>
    </a>
  );
}
