'use client';

interface DAOCardProps {
  id: string;
  name: string;
  about: string;
  members: string[];
  avatar: string | null;
  symbol: string;
}

export function DAOCard({ id, name, about, members, avatar, symbol }: DAOCardProps) {
  return (
    <a
      href={`/dao/${id}`}
      className="block bg-surface rounded-lg border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all group focus:outline-none focus:ring-2 focus:ring-tertiary focus:ring-offset-2"
    >
      <div className="flex items-start gap-4">
        {/* DAO Logo */}
        <div className="w-12 h-12 rounded-full bg-surface-alt flex-shrink-0 overflow-hidden flex items-center justify-center">
          {avatar ? (
            <img
              src={`https://cdn.stamp.fyi/space/${id}?s=96`}
              alt={name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <span className="text-lg font-bold text-secondary">
              {name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-semibold text-base text-primary truncate group-hover:text-tertiary transition-colors">
              {name}
            </h3>
            {symbol && (
              <span className="text-xs font-mono text-secondary bg-surface-alt px-1.5 py-0.5 rounded">
                {symbol}
              </span>
            )}
          </div>
          <p className="text-sm text-secondary mt-1 line-clamp-2">
            {about || 'A decentralized autonomous organization.'}
          </p>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-xs text-secondary font-medium">
                {members.length.toLocaleString()} members
              </span>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
