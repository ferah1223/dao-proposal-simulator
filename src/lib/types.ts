export interface Space {
  id: string;
  name: string;
  about: string;
  network: string;
  symbol: string;
  members: string[];
  strategies: Strategy[];
  admins: string[];
  filters: Record<string, unknown>;
  plugins: Record<string, unknown>;
  avatar: string | null;
  skin: string;
  private: boolean;
}

export interface Strategy {
  name: string;
  network?: string;
  params: Record<string, unknown>;
}

export interface Proposal {
  id: string;
  ipfs: string;
  author: string;
  created: number;
  type: string;
  space: {
    id: string;
    name: string;
    members: string[];
    avatar: string | null;
  };
  network: string;
  choices: string[];
  start: number;
  end: number;
  quorum: number;
  snapshot: string;
  state: 'pending' | 'active' | 'closed';
  title: string;
  body: string;
  scores: number[];
  scores_total: number;
  votes: number;
}

export interface Vote {
  id: string;
  voter: string;
  created: number;
  choice: number;
  vp: number;
  reason: string;
  space: {
    id: string;
  };
  proposal: {
    id: string;
  };
}

export interface VoteResults {
  for: number;
  against: number;
  abstain: number;
  total: number;
  forPercent: number;
  againstPercent: number;
  abstainPercent: number;
  quorum: number;
  quorumReached: boolean;
  totalVoters: number;
}

export interface SimulateResult {
  choice: 'for' | 'against' | 'abstain';
  beforeFor: number;
  beforeAgainst: number;
  beforeAbstain: number;
  afterFor: number;
  afterAgainst: number;
  afterAbstain: number;
  beforeForPercent: number;
  afterForPercent: number;
  deltaFor: number;
  beforeAgainstPercent: number;
  afterAgainstPercent: number;
  deltaAgainst: number;
  beforeAbstainPercent: number;
  afterAbstainPercent: number;
  deltaAbstain: number;
}
