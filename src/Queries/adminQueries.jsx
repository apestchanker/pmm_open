import { gql } from '@apollo/client';

export const GET_TASK_SKILLS = gql`
  query ($search: String!, $order: [_SkillOrdering]) {
    Skill(filter: { name_regexp: $search }, orderBy: $order) {
      id
      name
      isActive
    }
  }
`;

export const BLOCK_TASK_SKILLS = gql`
  mutation ($id: ID) {
    UpdateSkill(where: { id: $id }, data: { isActive: false }) {
      id
    }
  }
`;

export const ENABLE_TASK_SKILLS = gql`
  mutation ($id: ID) {
    UpdateSkill(where: { id: $id }, data: { isActive: true }) {
      id
    }
  }
`;

export const DELETE_TASK_SKILLS = gql`
  mutation ($id: ID) {
    DeleteSkill(where: { id: $id }) {
      id
    }
  }
`;

export const ADD_TASK_SKILLS = gql`
  mutation ($data: _SkillCreate!) {
    CreateSkill(data: $data) {
      id
      name
      isActive
    }
  }
`;

export const GET_CHALLENGES = gql`
  query ($search: String!, $order: [_ChallengeOrdering]) {
    Challenge(filter: { title_regexp: $search }, orderBy: $order) {
      id
      fund {
        fundnumber
      }
      title
      isActive
    }
  }
`;

export const BLOCK_CHALLENGES = gql`
  mutation ($id: ID) {
    UpdateChallenge(where: { id: $id }, data: { isActive: false }) {
      id
    }
  }
`;

export const ENABLE_CHALLENGES = gql`
  mutation ($id: ID) {
    UpdateChallenge(where: { id: $id }, data: { isActive: true }) {
      id
    }
  }
`;

export const DELETE_CHALLENGES = gql`
  mutation ($id: ID) {
    DeleteChallenge(where: { id: $id }) {
      id
    }
  }
`;

export const ADD_CHALLENGE = gql`
  mutation ($data: _ChallengeCreate!) {
    CreateChallenge(data: $data) {
      id
      fund
      title
      isActive
    }
  }
`;

export const GET_INTERESTS = gql`
  query ($search: String!, $order: [_InterestOrdering]) {
    Interest(filter: { name_regexp: $search }, orderBy: $order) {
      id
      name
      isActive
    }
  }
`;

export const BLOCK_INTEREST = gql`
  mutation ($id: ID) {
    UpdateInterest(where: { id: $id }, data: { isActive: false }) {
      id
    }
  }
`;

export const ENABLE_INTEREST = gql`
  mutation ($id: ID) {
    UpdateInterest(where: { id: $id }, data: { isActive: true }) {
      id
    }
  }
`;

export const DELETE_INTEREST = gql`
  mutation ($id: ID) {
    DeleteInterest(where: { id: $id }) {
      id
    }
  }
`;

export const ADD_INTEREST = gql`
  mutation ($data: _InterestCreate!) {
    CreateInterest(data: $data) {
      id
      name
      isActive
    }
  }
`;

export const GET_USERS = gql`
  query ($search: String!, $order: [_UserOrdering]) {
    User(filter: { OR: [{ username_regexp: $search }, { email_regexp: $search }] }, orderBy: $order) {
      id
      username
      email
      roles {
        name
      }
      avgScore
      isActive
      memberSince {
        formatted
      }
    }
  }
`;

export const BLOCK_USER = gql`
  mutation ($id: ID) {
    UpdateUser(where: { id: $id }, data: { isActive: false }) {
      id
    }
  }
`;

export const ENABLE_USER = gql`
  mutation ($id: ID) {
    UpdateUser(where: { id: $id }, data: { isActive: true }) {
      id
    }
  }
`;

export const GET_FLAGS = gql`
  query ($search: String!, $order: [_FlagOrdering]) {
    Flag(
      filter: {
        OR: [{ message_regexp: $search }, { flaggedUser: { username_regexp: $search } }, { flaggingUser: { username_regexp: $search } }]
      }
      orderBy: $order
    ) {
      id
      status
      message
      modifiedOn {
        formatted
      }
      flaggedUser {
        id
        username
      }
      flaggingUser {
        id
        username
      }
    }
  }
`;

export const SET_FLAG_AS_RESOLVED = gql`
  mutation ($flagId: ID!) {
    UpdateFlag(where: { id: $flagId }, data: { status: true }) {
      id
    }
  }
`;

export const SET_FLAG_AS_PENDING_REVIEW = gql`
  mutation ($flagId: ID!) {
    UpdateFlag(where: { id: $flagId }, data: { status: false }) {
      id
    }
  }
`;
