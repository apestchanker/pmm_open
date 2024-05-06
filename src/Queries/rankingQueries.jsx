import { gql } from '@apollo/client';

export const TOP_USERS = gql`
  query {
    User(orderBy: avgScore_desc, filter: { rating_not: null }) {
      username
      avgScore
    }
  }
`;
export const TOP_MENTORS = gql`
  query {
    User(orderBy: avgScore_desc, filter: { rating_not: null, roles_some: { id: "role-mentor" } }) {
      username
      avgScore
    }
  }
`;
export const TOP_PROPOSERS = gql`
  query {
    User(orderBy: avgScore_desc, filter: { rating_not: null, roles_some: { id: "role-proposer" } }) {
      username
      avgScore
    }
  }
`;
