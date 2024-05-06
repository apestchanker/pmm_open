import { gql } from '@apollo/client';

export const CREATE_SKILL = gql`
  mutation ($id: ID!, $skillName: String!) {
    CreateSkill(data: { id: $id, name: $skillName }) {
      name
      id
    }
  }
`;

export const GET_SKILLS = gql`
  query getSkills {
    Skill(filter: { isActive: true }) {
      id
      name
    }
  }
`;

export const UPDATE_USER_SKILLS = gql`
  mutation ($userId: ID!, $skills: [ID!]!) {
    RemoveUserHasSkill(from: { id: $userId }, to: { id_not_in: $skills }) {
      from {
        hasSkill {
          name
        }
      }
    }
    MergeUserHasSkill(from: { id: $userId }, to: { id_in: $skills }) {
      from {
        hasSkill {
          name
        }
      }
    }
  }
`;

export const UPDATE_USER_AVAILABILITY = gql`
  mutation updateUserAvailability($userId: ID!, $availability: Int!) {
    UpdateUserInfo(id: $userId, availability: $availability) {
      availability
    }
  }
`;

export const GET_USER_SKILLS = gql`
  query getUserSkills($username: String!) {
    User(username: $username) {
      id
      username
      hasSkill {
        name
        id
      }
      availability
    }
  }
`;

export const GET_COLLABORATORS_BY_SEARCH = gql`
  query getCollaboratorsBySearch($searchTerm: String!) {
    User(
      filter: {
        roles_some: { id: "role-collaborator" }
        OR: [
          { OR: { username_regexp: $searchTerm } }
          { OR: { hasSkill_some: { name_regexp: $searchTerm } } }
          { OR: { interestedIn_some: { name_regexp: $searchTerm } } }
        ]
      }
    ) {
      id
      bio
      profile
      interestedIn {
        id
        name
      }
      hasSkill {
        id
        name
      }
      username
      URLs
      avgScore
    }
  }
`;

export const GET_TASKS_BY_SEARCH = gql`
  query task($searchTerm: String!, $exclude: String!) {
    Task(
      filter: {
        OR: [
          { OR: { title_regexp: $searchTerm } }
          { OR: { descriptionOfTask_regexp: $searchTerm } }
          { OR: { neededSkills: { name_regexp: $searchTerm } } }
        ]
        AND: { forProposal_not: { proposedBy: { username: $exclude } } }
      }
    ) {
      easytask
      title
      fees
      effort
      forProposal {
        title
        proposedBy {
          username
        }
      }
      id
      neededSkills {
        name
        id
      }
    }
  }
`;

export const GET_RECOMMENDED_COLLABORATORS = gql`
  query ($userSkills: [ID!]!, $exclude: String!, $userInterest: [ID!]!) {
    User(
      filter: {
        roles_some: { id: "role-collaborator" }
        hasSkill_some: { id_in: $userSkills }
        username_not: $exclude
        interestedIn_some: { id_in: $userInterest }
      }
    ) {
      id
      username
      bio
      interestedIn {
        id
      }
      profile
      hasSkill {
        id
        name
      }
      avgScore
      URLs
    }
  }
`;

export const CREATE_CONTRACT_COLLABORATOR_PROPOSER = gql`
  mutation CreateContract($data: _ContractCreate!, $taskId: ID!, $contractId: ID!, $collaboratorId: ID!, $proposerId: ID!) {
    CreateContract(data: $data) {
      id
    }
    AddContractRelatedTask(from: { id: $taskId }, to: { id: $contractId }) {
      to {
        id
      }
    }
    AddContractProposer(from: { id: $proposerId }, to: { id: $contractId }) {
      to {
        id
      }
    }
    AddContractCollaborator(from: { id: $collaboratorId }, to: { id: $contractId }) {
      to {
        id
      }
    }
  }
`;

export const CREATE_CONTRACT_PROPOSER_COLLABORATOR = gql`
  mutation CreateContract(
    $data: _ContractCreate!
    $taskId: ID!
    $contractId: ID!
    $collaboratorId: ID!
    $proposerId: ID!
    $proposalId: ID!
  ) {
    CreateContract(data: $data) {
      id
    }
    AddContractRelatedTask(from: { id: $taskId }, to: { id: $contractId }) {
      to {
        id
      }
    }
    AddContractProposer(from: { id: $proposerId }, to: { id: $contractId }) {
      to {
        id
      }
    }
    AddContractCollaborator(from: { id: $collaboratorId }, to: { id: $contractId }) {
      to {
        id
      }
    }
    AddContractRelatedProposal(from: { id: $proposalId }, to: { id: $contractId }) {
      from {
        id
      }
    }
  }
`;

export const GET_FUNDED_PROPOSALS_TO_REQUEST_COLLABORATOR = gql`
  query GetUserProposals($username: String!) {
    Proposal(filter: { proposedBy: { username: $username }, AND: { fundingStatus: { name: "Funded" } } }) {
      title
      id
      detailedPlan
      inChallenge {
        title
      }
      status {
        type
      }
      fundingStatus {
        value
        name
      }
    }
  }
`; //? Ok

export const GET_TASKS_BY_PROPOSAL_ID = gql`
  query ($proposalId: ID) {
    Task(filter: { forProposal: { id: $proposalId } }) {
      title
      id
    }
  }
`;

export const GET_COLLABORATOR_PENDING_SENT_CONTRACT = gql`
  query ($collaborator: String!) {
    Contract(filter: { collaborator: { username: $collaborator }, AND: { status: "PENDING" }, proposer_not: null }) {
      id
      isMentorApprover
      status
      terms
      relatedTask {
        id
        title
        forProposal {
          proposedBy(filter: { username_not: $collaborator }) {
            id
            username
          }
        }
      }
    }
  }
`;

export const GET_COLLABORATOR_ACC_SENT_CONTRACT = gql`
  query ($collaborator: String!) {
    Contract(filter: { collaborator: { username: $collaborator }, AND: { status: "ACCEPTED" }, proposer_not: null }) {
      id
      isMentorApprover
      status
      terms
      relatedTask {
        id
        title
        forProposal {
          proposedBy(filter: { username_not: $collaborator }) {
            id
            username
          }
        }
      }
    }
  }
`;

export const GET_COLLABORATOR_REJ_SENT_CONTRACT = gql`
  query ($collaborator: String!) {
    Contract(filter: { collaborator: { username: $collaborator }, AND: { status: "REJECTED" }, proposer_not: null }) {
      id
      status
      terms
      relatedTask {
        id
        title
        forProposal {
          proposedBy(filter: { username_not: $collaborator }) {
            id
            username
          }
        }
      }
    }
  }
`;

export const GET_PROPOSER_PENDING_RECEIVED_COLLABORATOR_CONTRACT = gql`
  query ($proposer: String) {
    Contract(filter: { proposer: { username: $proposer }, AND: { status: "PENDING" }, collaborator_not: null }) {
      id
      status
      terms
      collaborator(filter: { username_not: $proposer }) {
        username
        id
      }
      relatedTask {
        id
        title
        forProposal {
          proposedBy(filter: { username: $proposer }) {
            username
            id
          }
        }
      }
    }
  }
`;

export const GET_PROPOSER_ACC_RECEIVED_COLLABORATOR_CONTRACT = gql`
  query ($proposer: String) {
    Contract(filter: { proposer: { username: $proposer }, AND: { status: "ACCEPTED" }, collaborator_not: null }) {
      id
      status
      terms
      collaborator(filter: { username_not: $proposer }) {
        username
      }
      relatedTask {
        id
        title
        forProposal {
          proposedBy(filter: { username_not: $proposer }) {
            username
          }
        }
      }
    }
  }
`;

export const GET_PROPOSER_REJ_RECEIVED_COLLABORATOR_CONTRACT = gql`
  query ($proposer: String) {
    Contract(filter: { proposer: { username: $proposer }, AND: { status: "REJECTED" }, collaborator_not: null }) {
      id
      status
      terms
      collaborator(filter: { username_not: $proposer }) {
        username
        id
      }
      relatedTask {
        id
        title
        forProposal {
          proposedBy(filter: { username_not: $proposer }) {
            username
            id
          }
        }
      }
    }
  }
`;

export const GET_PROPOSER_PENDING_SENT_COLLABORATOR_CONTRACT = gql`
  query ($proposer: String) {
    Contract(
      filter: {
        proposer: { username: $proposer }
        AND: { status: "PENDING" }
        collaborator_not: null
        relatedTask: { forProposal: { proposedBy: { username_not: $proposer } } }
      }
    ) {
      id
      status
      terms
      proposer(filter: { username: $proposer }) {
        username
        id
      }
      collaborator {
        username
        id
      }
      relatedTask {
        id
        title
        forProposal {
          proposedBy(filter: { username: $proposer }) {
            username
            id
          }
        }
      }
    }
  }
`;

export const GET_PROPOSER_ACC_SENT_COLLABORATOR_CONTRACT = gql`
  query ($proposer: String) {
    Contract(filter: { proposer: { username: $proposer }, AND: { status: "ACCEPTED" }, collaborator_not: null }) {
      id
      status
      terms
      proposer(filter: { username: $proposer }) {
        username
        id
      }
      collaborator {
        username
        id
      }
      relatedTask {
        id
        title
        forProposal {
          proposedBy(filter: { username: $proposer }) {
            username
            id
          }
        }
      }
    }
  }
`;

export const GET_PROPOSER_REJ_SENT_COLLABORATOR_CONTRACT = gql`
  query ($proposer: String) {
    Contract(filter: { proposer: { username: $proposer }, AND: { status: "REJECTED" }, collaborator_not: null }) {
      id
      status
      terms
      proposer(filter: { username: $proposer }) {
        username
        id
      }
      collaborator {
        username
        id
      }
      relatedTask {
        id
        title
        forProposal {
          proposedBy(filter: { username: $proposer }) {
            username
            id
          }
        }
      }
    }
  }
`;
