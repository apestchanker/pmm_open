export const GET_DATA = gql`
  query getData($userWhere: _UserFilter, $proposalWhere: _ProposalFilter) {
    User(filter: $userWhere) {
      username
      profile
      bio
      URLs
      roles {
        name
        id
      }
      interestedIn {
        name
        id
      }
      id
      proposals(filter: $proposalWhere) {
        id
        title
        detailedPlan
        proposedBy {
          username
          id
        }
        describedByInterests {
          id
        }
        status {
          type
        }
        inChallenge {
          title
          id
        }
        fundingStatus {
          value
        }
      }
      preferences {
        type
        id
      }
      mentorsWithSimilarInterests {
        id
        username
        profile
        bio
        URLs
        interestedIn {
          id
          name
        }
      }
      proposersWithSimilarInterests {
        id
        username
        profile
        bio
        URLs
        interestedIn {
          id
          name
        }
      }
      proposalsWithSimilarInterests {
        id
        title
        detailedPlan
        proposedBy {
          username
          id
        }
        status {
          type
        }
        inChallenge {
          title
        }
        fundingStatus {
          value
        }
        describedByInterests {
          id
          name
        }
      }
    }
  }
`;
