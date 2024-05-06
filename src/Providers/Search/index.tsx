import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { Interest, Proposal, User } from 'Types';
import { GET_USERS_MPB } from 'Queries';
export interface SearchContextState {
  search?: { id: string; value: string }[];
  mentors?: User[];
  proposers?: User[];
  proposals?: Proposal[];
}

export interface SearchContextValue extends SearchContextState {
  setSearch?: (search: { id: string; value: string }[]) => void;
  getSearchTerms?: () => { id: string; value: string }[];
  findMentors?: () => void;
  findProposers?: () => void;
  findProposals?: (username: string) => void;
}

export const SearchContext = createContext<SearchContextValue>({});

export const useSearch = () => useContext(SearchContext);

export const GET_SEARCH_OPTIONS = gql`
  query GetSearchOptions {
    Interest {
      id
      name
    }
  }
`;
export interface WhereClause {
  roles: { name: string };
  interestedIn?: { id_IN: string[] };
}
export const GET_SIMILAR_PROPOSALS = gql`
  query UserSimilarProposals($where: UserWhere) {
    users(where: $where) {
      proposalsWithSimilarInterests {
        id
        title
        problem
        solution
        descriptionOfSolution
        howAddressesChallenge
        mainChallengesOrRisks
        inChallenge {
          id
          title
        }
        fundingStatus {
          id
          name
          value
        }
        relevantExperience
        repo
        isTemplate
        detailedPlan
        detailedBudget
        teamRequired
        continuationOrNew
        sDGRating
        requestedFunds
        describedByInterests {
          name
          id
        }
        proposedBy {
          id
          username
          preferences {
            id
          }
        }
        status {
          id
          type
        }
        relatedContracts {
          id
        }
        ratings {
          id
          score
        }
      }
    }
  }
`;

export default function SearchProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SearchContextState>();
  const { data } = useQuery(GET_SEARCH_OPTIONS);
  // get Users Mentors Proposers or Both
  const [getUsersMPB, { data: mentorData }] = useLazyQuery(GET_USERS_MPB, { fetchPolicy: 'no-cache' });
  const setSearch = useCallback((search: { id: string; value: string }[]) => setState({ ...state, search }), [state]);
  const [searchTerms, setSearchTerms] = useState<{ id: string; value: string }[]>([]);
  const [getProposals, { data: proposalsData }] = useLazyQuery(GET_SIMILAR_PROPOSALS, { fetchPolicy: 'no-cache' });
  const getSearchTerms = useCallback(() => {
    return searchTerms;
  }, [searchTerms]);
  const findMentors = useCallback(() => {
    const where: WhereClause = { roles: { name: 'Mentor' } };
    if (state?.search?.length) {
      where.interestedIn = { id_IN: state?.search?.map((i) => i.id) };
    }
    getUsersMPB({
      variables: { where },
    });
  }, [state]);
  const findProposers = useCallback(() => {
    const where: WhereClause = { roles: { name: 'Proposer' } };
    if (state?.search?.length) {
      where.interestedIn = { id_IN: state?.search?.map((i) => i.id) };
    }
    getUsersMPB({ variables: { where } });
  }, [state]);
  const findProposals = useCallback(
    (username: string) => {
      if (username) {
        getProposals({ variables: { where: { username } } });
      }
    },
    [state],
  );
  useEffect(() => {
    if (data) {
      const interests = data.Interest as Interest[];
      setSearchTerms(interests.map((interest) => ({ id: interest.id, value: interest.name })));
    }
  }, [data]);
  useEffect(() => {
    if (mentorData) {
      setState((state) => ({ ...state, mentors: mentorData.users, proposers: [], proposals: [] }));
    }
  }, [mentorData]);

  useEffect(() => {
    if (proposalsData?.users?.length) {
      setState((state) => ({
        ...state,
        proposals: proposalsData.users[0].proposalsWithSimilarInterests,
        mentors: [],
        proposers: [],
      }));
    }
  }, [proposalsData]);
  return (
    <SearchContext.Provider
      value={{
        ...state,
        setSearch,
        findMentors,
        findProposals,
        findProposers,
        getSearchTerms,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
