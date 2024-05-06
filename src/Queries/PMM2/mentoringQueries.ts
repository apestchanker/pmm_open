import { gql } from '@apollo/client';

export const GET_USER_PROPOSALS = gql`
  query getUserProposals($id: ID!) {
    User(id: $id) {
      id
      username
      roles {
        id
        name
      }
      proposals {
        id
        title
        fundingStatus {
          id
          name
          value
        }
        proposedBy {
          id
          username
          picurl
        }
      }
      contractedBy {
        id
        relatedProposal {
          id
          fundingStatus {
            id
            name
            value
          }
          title
          proposedBy {
            id
            username
          }
        }
      }
    }
  }
`;

export const GET_MENTOR_LINK = gql`
  query SELECT_MENTOR_LINK($referralUrl: String) {
    User(filter: { referralUrl: $referralUrl }) {
      id
      username
      picurl
      rating {
        score
      }
      roles {
        name
      }
      hasSkill {
        name
      }
      URLs
      rating {
        score
      }
      languages {
        name
      }
      interestedIn {
        name
      }
      bio
      contractedBy {
        proposer {
          id
          username
        }
        mentor {
          id
          username
        }
        relatedProposal {
          id
          fundingStatus {
            id
            name
          }
        }
      }
      proposals {
        proposedBy {
          id
          username
          contractedBy {
            relatedProposal {
              id
              fundingStatus {
                name
              }
            }
          }
        }
      }
    }
  }
`;
export const GET_PROPOSAL_BY_REFERAL = gql`
  query Proposal($referralUrl: String) {
    Proposal(filter: { proposedBy: { referralUrl: $referralUrl }, fundingStatus: { name: "Funded" } }) {
      id
      title
      fundingStatus {
        id
        name
        value
      }
      status {
        id
        type
      }
      proposedBy {
        id
        username
        referralUrl
      }
    }
  }
`;
export const GET_PROPOSAL_PRESENTED = gql`
  query Proposal($referralUrl: String) {
    Proposal(filter: { proposedBy: { referralUrl: $referralUrl } }) {
      id
      title
      proposedBy {
        id
        username
        referralUrl
      }
    }
  }
`;

export const GET_PROPOSAL_INFO = gql`
  query getProposalInfo($id: ID!) {
    Proposal(id: $id) {
      id
      title
      proposedBy {
        id
        username
        picurl
      }
      relatedContracts {
        id
        terms
        status
        isMentorApprover
        paymentAmount
        paymentType
        date {
          formatted
        }
        dateMentorSigned {
          formatted
        }
        dateProposerSigned {
          formatted
        }

        mentor {
          id
          username
        }

        proposer {
          id
          username
        }
      }
    }
  }
`;

export const SEND_AGREEMENT = gql`
  mutation sendAgreement(
    $contractId: ID!
    $terms: String
    $isMentorApprover: Boolean
    $paymentType: String
    $paymentAmount: Float
    $date: String
    $dateMentorSigned: String
    $status: String
  ) {
    UpdateContract(
      where: { id: $contractId }
      data: {
        terms: $terms
        paymentType: $paymentType
        paymentAmount: $paymentAmount
        status: $status
        date: { formatted: $date }
        dateMentorSigned: { formatted: $dateMentorSigned }
        isMentorApprover: $isMentorApprover
      }
    ) {
      id
    }
  }
`;

export const DRAFT_AGREEMENT = gql`
  mutation saveAsDraft(
    $contractId: ID!
    $terms: String
    $isMentorApprover: Boolean
    $paymentType: String
    $paymentAmount: Float
    $date: String
    $status: String
  ) {
    UpdateContract(
      where: { id: $contractId }
      data: {
        terms: $terms
        paymentType: $paymentType
        paymentAmount: $paymentAmount
        status: $status
        date: { formatted: $date }
        isMentorApprover: $isMentorApprover
      }
    ) {
      id
    }
  }
`;

export const ACCEPT_AGREEMENT = gql`
  mutation saveAsDraft($contractId: ID!, $dateProposerSigned: String, $status: String) {
    UpdateContract(where: { id: $contractId }, data: { status: $status, dateProposerSigned: { formatted: $dateProposerSigned } }) {
      id
    }
  }
`;

export const GET_FUND_DATES = gql`
  query getFunds {
    Fund {
      id
      fundnumber
      dateStart {
        formatted
      }
      dateEnd {
        formatted
      }
    }
  }
`;
export const UPDATE_CONTRACT_MENTOR = gql`
  mutation removeContractMentor($userId: ID, $contractId: ID) {
    RemoveContractMentor(from: { id: $userId }, to: { id: $contractId }) {
      from {
        id
      }
    }
    UpdateContract(where: { id: $contractId }, data: { status: "Rejected", terms: "Rejected by Mentor" }) {
      id
    }
  }
`;
