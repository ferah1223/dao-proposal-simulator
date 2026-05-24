import { GraphQLClient, gql } from 'graphql-request';

const SNAPSHOT_URL = 'https://hub.snapshot.org/graphql';
const client = new GraphQLClient(SNAPSHOT_URL);

// Fetch popular DAO spaces
export async function getSpaces(first = 24, skip = 0) {
  const query = gql`
    query Spaces($first: Int!, $skip: Int!) {
      spaces(
        first: $first
        skip: $skip
        orderBy: "followers"
        orderDirection: desc
      ) {
        id
        name
        about
        network
        symbol
        members
        avatar
        private
        admins
      }
    }
  `;
  const data = await client.request<{ spaces: Space[] }>(query, { first, skip });
  return data.spaces;
}

// Fetch a single space
export async function getSpace(id: string) {
  const query = gql`
    query Space($id: String!) {
      space(id: $id) {
        id
        name
        about
        network
        symbol
        members
        avatar
        private
        admins
      }
    }
  `;
  const data = await client.request<{ space: Space | null }>(query, { id });
  return data.space;
}

// Search spaces
export async function searchSpaces(query: string) {
  const q = gql`
    query SearchSpaces($query: String!) {
      spaces(
        first: 20
        where: { name_contains: $query }
        orderBy: "followers"
        orderDirection: desc
      ) {
        id
        name
        about
        network
        symbol
        members
        avatar
      }
    }
  `;
  const data = await client.request<{ spaces: Space[] }>(q, { query });
  return data.spaces;
}

// Fetch proposals for a space
export async function getProposals(
  spaceId: string,
  state: 'all' | 'active' | 'pending' | 'closed' = 'all',
  first = 20,
  skip = 0
) {
  const stateFilter = state !== 'all' ? `state: "${state}",` : '';
  const query = gql`
    query Proposals($space: String!, $first: Int!, $skip: Int!) {
      proposals(
        where: { space_in: [$space], ${stateFilter} flagged: false }
        orderBy: "created"
        orderDirection: desc
        first: $first
        skip: $skip
      ) {
        id
        ipfs
        author
        created
        type
        space {
          id
          name
          members
          avatar
        }
        network
        choices
        start
        end
        quorum
        snapshot
        state
        title
        body
        scores
        scores_total
        votes
      }
    }
  `;
  const data = await client.request<{ proposals: Proposal[] }>(query, {
    space: spaceId,
    first,
    skip,
  });
  return data.proposals;
}

// Fetch a single proposal
export async function getProposal(id: string) {
  const query = gql`
    query Proposal($id: String!) {
      proposal(id: $id) {
        id
        ipfs
        author
        created
        type
        space {
          id
          name
          members
          avatar
        }
        network
        choices
        start
        end
        quorum
        snapshot
        state
        title
        body
        scores
        scores_total
        votes
      }
    }
  `;
  const data = await client.request<{ proposal: Proposal | null }>(query, { id });
  return data.proposal;
}

// Fetch votes for a proposal
export async function getVotes(proposalId: string, first = 100, skip = 0) {
  const query = gql`
    query Votes($proposal: String!, $first: Int!, $skip: Int!) {
      votes(
        where: { proposal: $proposal }
        orderBy: "vp"
        orderDirection: desc
        first: $first
        skip: $skip
      ) {
        id
        voter
        created
        choice
        vp
        reason
        space {
          id
        }
        proposal {
          id
        }
      }
    }
  `;
  const data = await client.request<{ votes: Vote[] }>(query, {
    proposal: proposalId,
    first,
    skip,
  });
  return data.votes;
}

// Get user voting power
export async function getVotingPower(voter: string, space: string, proposal: string) {
  try {
    const resp = await fetch(
      `https://score.snapshot.org/?params=${encodeURIComponent(
        JSON.stringify({
          space,
          voter,
          proposal,
        })
      )}`
    );
    const data = await resp.json();
    return data?.result?.[0]?.vp || 0;
  } catch {
    return 0;
  }
}

// Compute vote results from scores and proposal data
export function computeVoteResults(proposal: Proposal, quorum?: number): VoteResults {
  const scores = proposal.scores || [0, 0, 0];
  const total = proposal.scores_total || scores.reduce((a, b) => a + b, 0) || 1;
  
  const forVotes = scores[0] || 0;
  const againstVotes = scores[1] || 0;
  const abstainVotes = scores[2] || 0;

  return {
    for: forVotes,
    against: againstVotes,
    abstain: abstainVotes,
    total,
    forPercent: total > 0 ? (forVotes / total) * 100 : 0,
    againstPercent: total > 0 ? (againstVotes / total) * 100 : 0,
    abstainPercent: total > 0 ? (abstainVotes / total) * 100 : 0,
    quorum: quorum || proposal.quorum || 0,
    quorumReached: quorum ? forVotes >= quorum : (proposal.quorum ? forVotes >= proposal.quorum : true),
    totalVoters: proposal.votes || 0,
  };
}

// Simulate a vote
export function simulateVote(
  results: VoteResults,
  choice: 'for' | 'against' | 'abstain',
  userVP: number
): import('./types').SimulateResult {
  const beforeFor = results.for;
  const beforeAgainst = results.against;
  const beforeAbstain = results.abstain;
  const beforeTotal = results.total || 1;

  let afterFor = beforeFor;
  let afterAgainst = beforeAgainst;
  let afterAbstain = beforeAbstain;

  if (choice === 'for') afterFor += userVP;
  else if (choice === 'against') afterAgainst += userVP;
  else afterAbstain += userVP;

  const afterTotal = beforeTotal + userVP;

  const beforeForPercent = (beforeFor / beforeTotal) * 100;
  const afterForPercent = afterTotal > 0 ? (afterFor / afterTotal) * 100 : 0;

  const beforeAgainstPercent = (beforeAgainst / beforeTotal) * 100;
  const afterAgainstPercent = afterTotal > 0 ? (afterAgainst / afterTotal) * 100 : 0;

  const beforeAbstainPercent = (beforeAbstain / beforeTotal) * 100;
  const afterAbstainPercent = afterTotal > 0 ? (afterAbstain / afterTotal) * 100 : 0;

  return {
    choice,
    beforeFor,
    beforeAgainst,
    beforeAbstain,
    afterFor,
    afterAgainst,
    afterAbstain,
    beforeForPercent,
    afterForPercent,
    deltaFor: afterForPercent - beforeForPercent,
    beforeAgainstPercent,
    afterAgainstPercent,
    deltaAgainst: afterAgainstPercent - beforeAgainstPercent,
    beforeAbstainPercent,
    afterAbstainPercent,
    deltaAbstain: afterAbstainPercent - beforeAbstainPercent,
  };
}

import { Space, Proposal, Vote, VoteResults } from './types';
