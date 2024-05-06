import { gql } from '@apollo/client';

export const GET_TASK_STATUSES = gql`
  query getTaskStatuses {
    TaskStatus {
      type
      id
    }
  }
`;
export const CREATE_TASK = gql`
  mutation ($id: ID!, $title: String!, $effort: String!, $fees: Float!, $description: String!, $isTemplate: Boolean!, $easytask: Boolean!) {
    CreateTask(
      data: {
        id: $id
        title: $title
        effort: $effort
        fees: $fees
        descriptionOfTask: $description
        isTemplate: $isTemplate
        easytask: $easytask
      }
    ) {
      title
      id
      descriptionOfTask
    }
  }
`;

export const ADD_STATUS_TO_TASK = gql`
  mutation ($taskId: ID!, $taskStatus: ID!) {
    AddTaskStatus(from: { id: $taskId }, to: { id: $taskStatus }) {
      from {
        status {
          type
        }
        title
      }
    }
  }
`;

export const LINK_PROPOSAL_TO_TASK = gql`
  mutation ($taskId: ID!, $proposalId: ID!) {
    AddTaskForProposal(from: { id: $proposalId }, to: { id: $taskId }) {
      from {
        title
        relatedTasks {
          title
        }
      }
    }
  }
`;

export const ADD_NEEDED_SKILLS_TO_TASK = gql`
  mutation ($taskId: ID!, $skills: [ID!]!) {
    AddTaskNeededSkills(from: { id: $taskId }, to: { id_in: $skills }) {
      from {
        title
        neededSkills {
          name
        }
      }
    }
  }
`;

export const UPDATE_NEEDED_SKILLS_IN_TASK = gql`
  mutation ($taskId: ID!, $skills: [ID!]!) {
    RemoveTaskNeededSkills(from: { id: $taskId }, to: { id_not_in: $skills }) {
      from {
        title
        neededSkills {
          name
        }
      }
    }
    MergeTaskNeededSkills(from: { id: $taskId }, to: { id_in: $skills }) {
      from {
        title
        neededSkills {
          name
        }
      }
    }
  }
`;

export const GET_USER_TASKS = gql`
  query ($username: String!) {
    User(username: $username) {
      proposals(filter: { fundingStatus: { id: "funding-status-004" }, AND: { status: { id: "proposal-status-active" } } }) {
        title
        relatedTasks(filter: { status_not: { id: "task-removed" } }) {
          title
          status {
            id
          }
          neededSkills {
            name
            id
          }
          status {
            id
            type
          }
          id
          effort
          fees
          descriptionOfTask
          forProposal {
            title
          }
        }
      }
    }
  }
`;

export const GET_ALL_USER_TASKS = gql`
  query ($username: String!) {
    Task(
      filter: {
        status_not: { OR: [{ OR: { id: "task-removed" } }, { OR: { id: "task-inactive" } }] }
        forProposal: { proposedBy: { username: $username } }
      }
    ) {
      title
      neededSkills {
        name
        id
      }
      status {
        id
        type
      }
      id
      effort
      fees
      descriptionOfTask
      forProposal {
        title
      }
    }
  }
`;

export const GET_TASK_BY_ID = gql`
  query ($id: ID!) {
    Task(filter: { id: $id }) {
      id
      title
      effort
      fees
      descriptionOfTask
      forProposal {
        title
        id
        proposedBy {
          id
          username
          URLs
          languages {
            name
            id
          }
        }
      }
      neededSkills {
        name
        id
      }
      status {
        id
      }
    }
  }
`;

export const GET_TASK_CREATOR = gql`
  query ($id: ID) {
    Task(filter: { id: $id }) {
      id
      title
      forProposal {
        id
        proposedBy {
          username
          id
        }
      }
    }
  }
`;

export const SET_TASK_AS_DRAFT = gql`
  mutation SetTaskAsDraft($taskId: ID, $taskStatusId: ID) {
    RemoveTaskStatus(from: { id: $taskId }, to: { id: $taskStatusId }) {
      from {
        id
      }
      to {
        id
      }
    }
    AddTaskStatus(from: { id: $taskId }, to: { id: "task-draft" }) {
      from {
        id
      }
      to {
        id
      }
    }
  }
`; //? New

export const SET_TASK_AS_PUBLISHED = gql`
  mutation SetTaskAsPublished($taskId: ID, $taskStatusId: ID) {
    RemoveTaskStatus(from: { id: $taskId }, to: { id: $taskStatusId }) {
      from {
        id
      }
      to {
        id
      }
    }
    AddTaskStatus(from: { id: $taskId }, to: { id: "task-published" }) {
      from {
        id
      }
      to {
        id
      }
    }
  }
`; //? New

export const SET_TASK_AS_STAFFED = gql`
  mutation SetTaskAsStaffed($taskId: ID, $taskStatusId: ID) {
    RemoveTaskStatus(from: { id: $taskId }, to: { id: $taskStatusId }) {
      from {
        id
      }
      to {
        id
      }
    }
    AddTaskStatus(from: { id: $taskId }, to: { id: "task-staffed" }) {
      from {
        id
      }
      to {
        id
      }
    }
  }
`; //? New

export const SET_TASK_AS_REMOVED = gql`
  mutation SetTaskAsRemoved($taskId: ID, $taskStatusId: ID) {
    RemoveTaskStatus(from: { id: $taskId }, to: { id: $taskStatusId }) {
      from {
        id
      }
      to {
        id
      }
    }
    AddTaskStatus(from: { id: $taskId }, to: { id: "task-removed" }) {
      from {
        id
      }
      to {
        id
      }
    }
  }
`; //? New

export const UPDATE_TASK = gql`
  mutation ($id: ID, $data: _TaskUpdate!) {
    UpdateTask(where: { id: $id }, data: $data) {
      id
    }
  }
`; //? New

export const GET_TASK_SKILLS = gql`
  query {
    Skill(filter: { isActive: true }) {
      id
      name
      isActive
    }
  }
`;

//currently not used
export const GET_FILTERED_TASKS_PREV = gql`
  query ($taskIds: [ID!]!, $skillsIds: [ID!]!, $challengeId: ID!, $timezoneId: ID!) {
    Task(
      filter: {
        id_in: $taskIds
        neededSkills_some: { id_in: $skillsIds }
        forProposal: { inChallenge: { id: $challengeId }, proposedBy: { inZone: { id: $timezoneId } } }
      }
    ) {
      id
      title
      fees
      effort
      easytask
      descriptionOfTask
      neededSkills {
        id
        name
      }
      forProposal {
        title
        proposedBy {
          username
          id
        }
        descriptionOfSolution
      }
    }
  }
`;

export const GET_FILTERED_TASKS = gql`
  query ($filterFields: _TaskFilter!) {
    Task(filter: $filterFields) {
      id
      title
      fees
      effort
      easytask
      descriptionOfTask
      neededSkills {
        id
        name
      }
      forProposal {
        title
        proposedBy {
          username
          id
        }
        descriptionOfSolution
      }
    }
  }
`;

export const GET_MY_WORKING_TASKS = gql`
  query ($username: String!) {
    Task(filter: { relatedContracts_some: { status: "ACCEPTED", collaborator: { username: $username } } }) {
      title
      neededSkills {
        name
        id
      }
      status {
        id
        type
      }
      id
      effort
      fees
      descriptionOfTask
      forProposal {
        title
      }
    }
  }
`;

export const GET_MY_AWAITING_TASKS = gql`
  query ($username: String!) {
    Task(filter: { relatedContracts_some: { status: "PENDING", collaborator: { username: $username } } }) {
      title
      neededSkills {
        name
        id
      }
      status {
        id
        type
      }
      id
      effort
      fees
      descriptionOfTask
      forProposal {
        title
      }
    }
  }
`;
