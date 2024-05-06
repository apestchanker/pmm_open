import { gql } from '@apollo/client';

export const variables = {
  data: [
    {
      id: 'task-draft',
      type: 'Draft',
    },
    {
      id: 'task-published',
      type: 'Published',
    },
    {
      id: 'task-staffed',
      type: 'Staffed',
    },
    {
      id: 'task-removed',
      type: 'Removed',
    },
  ],
};
// MUTATION TASK STATUS
export const mutation = gql`
  mutation ($data: _TaskStatusCreate!) {
    CreateTaskStatus(data: $data) {
      id
      type
    }
  }
`;
