import { gql } from '@apollo/client';

export const variables = {
  data: [
    {
      id: 'f8-dev-ecosystem',
      fund: 8,
      title: 'Developer Ecosystem',
      isActive: true,
    },
    {
      id: 'f8-open-source-dev-ecosystem',
      fund: 8,
      title: 'Open Source Developer Ecosystem',
      isActive: true,
    },
    {
      id: 'f8-nation-building-dapps',
      fund: 8,
      title: 'Nation Building Dapps',
      isActive: true,
    },
    {
      id: 'f8-cross-chain-collaboration',
      fund: 8,
      title: 'Cross Chain Collaboration',
      isActive: true,
    },
    {
      id: 'f8-cardano-scaling-solutions',
      fund: 8,
      title: 'Cardano Scaling Solutions',
      isActive: true,
    },
    {
      id: 'f8-dapps-and-integrations',
      fund: 8,
      title: 'DApps and Integrations',
      isActive: true,
    },
    {
      id: 'f8-scale-up-cardanos-community-hubs',
      fund: 8,
      title: "Scale-UP Cardano's Community Hubs",
      isActive: true,
    },
    {
      id: 'f8-gamers-on-chained',
      fund: 8,
      title: 'Gamers On-Chained',
      isActive: true,
    },
    {
      id: 'f8-miscellaneous-challenge',
      fund: 8,
      title: 'Miscellaneous Challenge',
      isActive: true,
    },
  ],
};

// MUTATION CHALLENGE
export const mutation = gql`
  mutation ($data: _ChallengeCreate!) {
    CreateChallenge(data: $data) {
      id
      title
      fund
      isActive
    }
  }
`;
