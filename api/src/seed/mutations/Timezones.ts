import { gql } from '@apollo/client';

export const variables = {
  data: [
    {
      id: 'timezone-03',
      name: 'UTC-3',
    },
    {
      id: 'timezone-04',
      name: 'UTC-4',
    },
    {
      id: 'timezone+02',
      name: 'UTC+2',
    },
    {
      id: 'timezone+01',
      name: 'UTC+1',
    },
    {
      id: 'timezone',
      name: 'UTC',
    },
    {
      id: 'timezone+03',
      name: 'UTC+3',
    },
    {
      id: 'timezone+04',
      name: 'UTC+4',
    },
    {
      id: 'timezone-01',
      name: 'UTC-1',
    },
    {
      id: 'timezone-02',
      name: 'UTC-2',
    },
    {
      id: 'timezone-05',
      name: 'UTC-5',
    },
    {
      id: 'timezone-06',
      name: 'UTC-6',
    },
    {
      id: 'timezone-07',
      name: 'UTC-7',
    },
    {
      id: 'timezone-08',
      name: 'UTC-8',
    },
    {
      id: 'timezone-09',
      name: 'UTC-9',
    },
    {
      id: 'timezone-10',
      name: 'UTC-10',
    },
    {
      id: 'timezone-11',
      name: 'UTC-11',
    },
    {
      id: 'timezone-12',
      name: 'UTC-12',
    },
    {
      id: 'timezone+14',
      name: 'UTC+14',
    },
    {
      id: 'timezone+13',
      name: 'UTC+13',
    },
    {
      id: 'timezone+12',
      name: 'UTC+12',
    },
    {
      id: 'timezone+11',
      name: 'UTC+11',
    },
    {
      id: 'timezone+10',
      name: 'UTC+10',
    },
    {
      id: 'timezone+09',
      name: 'UTC+9',
    },
    {
      id: 'timezone+08',
      name: 'UTC+8',
    },
    {
      id: 'timezone+07',
      name: 'UTC+7',
    },
    {
      id: 'timezone+06',
      name: 'UTC+6',
    },
    {
      id: 'timezone+05',
      name: 'UTC+5',
    },
    {
      id: 'timezone+1245',
      name: 'UTC+12.45',
    },
    {
      id: 'timezone+1030',
      name: 'UTC+10.30',
    },
    {
      id: 'timezone+0930',
      name: 'UTC+9.30',
    },
    {
      id: 'timezone+0845',
      name: 'UTC+8.45',
    },
    {
      id: 'timezone+0630',
      name: 'UTC+6.30',
    },
    {
      id: 'timezone+0530',
      name: 'UTC+5.30',
    },
    {
      id: 'timezone+0545',
      name: 'UTC+5.45',
    },
    {
      id: 'timezone+0430',
      name: 'UTC+4.30',
    },
    {
      id: 'timezone+0330',
      name: 'UTC+3.30',
    },
    {
      id: 'timezone-0330',
      name: 'UTC-3.30',
    },
    {
      id: 'timezone-0930',
      name: 'UTC-9.30',
    },
  ],
};

// MUTATION TIMEZONES
export const mutation = gql`
  mutation ($data: _TimezoneCreate!) {
    CreateTimezone(data: $data) {
      id
      name
    }
  }
`;
