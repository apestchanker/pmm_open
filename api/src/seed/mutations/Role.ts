import { gql } from '@apollo/client';

export const variables = {
  data: [
    {
      id: 'role-mentor',
      name: 'Mentor',
    },
    {
      id: 'role-proposer',
      name: 'Proposer',
    },
    {
      id: 'role-admin',
      name: 'Admin',
    },
    {
      id: 'role-superadmin',
      name: 'SuperAdmin',
    },
    {
      id: 'role-user',
      name: 'User',
    },
    {
      id: 'role-collaborator',
      name: 'Collaborator',
    },
  ],
};

// MUTATION ROLES
export const mutation = gql`
  mutation ($data: _RoleCreate!) {
    CreateRole(data: $data) {
      id
      name
    }
  }
`;
