import { gql } from '@apollo/client';

export const variables = {
  data: [
    {
      id: 'funding-status-000',
      name: 'Draft',
      value: 0,
    },
    {
      id: 'funding-status-001',
      name: 'Looking For Mentor',
      value: 1,
    },
    {
      id: 'funding-status-002',
      name: 'Mentor Assigned',
      value: 2,
    },
    {
      id: 'funding-status-003',
      name: 'Presented',
      value: 3,
    },
    {
      id: 'funding-status-004',
      name: 'Funded',
      value: 4,
    },
  ],
};

// MUTATION FUNDING STATUS
export const mutation = gql`
  mutation ($data: _FundingStatusCreate!) {
    CreateFundingStatus(data: $data) {
      id
      name
      value
    }
  }
`;
