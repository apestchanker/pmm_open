import { gql } from '@apollo/client';

export const GET_ALL_MESSAGES_BY_USER = gql`
  query getAllMessagesByUser($username: String!) {
    Message(filter: { OR: [{ OR: { sentBy: { username: $username } } }, { OR: { sentTo: { username: $username } } }] }, orderBy: on_desc) {
      id
      text
      on {
        formatted
        day
        month
        year
      }
      sentBy {
        username
      }
      sentTo {
        username
      }
      read
    }
  }
`;
export const GET_ALL_MESSAGES_BY_SEARCH = gql`
  query getAllMessagesBySearchre($username: String!, $userToSearch: String!) {
    Message(
      filter: { AND: [{ OR: { sentBy: { username_regexp: $userToSearch } } }, { OR: { sentTo: { username: $username } } }] }
      orderBy: on_desc
    ) {
      id
      text
      on {
        formatted
        day
        month
        year
      }
      sentBy {
        username
      }
      sentTo {
        username
      }
      read
    }
  }
`;

export const SET_MESSAGE_AS_READ = gql`
  mutation ($messageId: ID) {
    UpdateMessage(where: { id: $messageId }, data: { read: true }) {
      id
    }
  }
`;

export const CHECK_UNREAD_MESSAGES = gql`
  query CheckUnreadMessages($username: String!) {
    Message(filter: { AND: [{ sentTo: { username: $username } }, { read: false }] }, orderBy: on_desc) {
      on {
        formatted
      }
      read
      sentBy {
        username
      }
    }
  }
`;
