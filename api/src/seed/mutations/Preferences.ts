import { gql } from '@apollo/client';

export const variables = {
  data: [
    {
      id: 'preference-online',
      type: 'Online mentoring',
    },
    {
      id: 'preference-available-weekends',
      type: 'Available on weekends',
    },
    {
      id: 'preference-email',
      type: 'Mostly email',
    },
    {
      id: 'preference-offline',
      type: 'Offline mentoring',
    },
    {
      id: 'preference-similar-timezones',
      type: 'Similar timezones',
    },
    {
      id: 'preference-calls',
      type: 'Mostly calls',
    },
  ],
};

// MUTATION CREATE PREFERENCES
export const mutation = gql`
  mutation ($data: _UserPreferenceCreate!) {
    CreateUserPreference(data: $data) {
      id
      type
    }
  }
`;
