import { gql } from '@apollo/client';

export const variables = {
  data: [
    {
      id: 'proposal-status-active',
      type: 'Active',
    },
    {
      id: 'proposal-status-inactive',
      type: 'Inactive',
    },
    {
      id: 'proposal-status-removed',
      type: 'Removed',
    },
  ],
};

// MUTATION CREATE PROPOSAL STATUS
export const mutation = gql`
  mutation ($data: _ProposalStatusCreate!) {
    CreateProposalStatus(data: $data) {
      id
      type
    }
  }
`;
