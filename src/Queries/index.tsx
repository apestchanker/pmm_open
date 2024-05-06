import { gql } from '@apollo/client';

// MergeUser(
//   where: _UserKeys!
//   data: _UserCreate!
//   ): User

export const MERGE_USER = gql`
  mutation ($where: _UserKeys!, $data: _UserCreate!) {
    MergeUser(where: $where, data: $data) {
      id
    }
  }
`;

//////
//   MESSAGES
//////
export const GET_RECEIVED_MESSAGES = gql`
  query ($username: String) {
    Message(filter: { sentTo: { username: $username } }) {
      id
      text
      on {
        formatted
        day
        month
        year
      }
      sentTo {
        username
      }
      sentBy {
        username
      }
    }
  }
`; //? Works with new schema

export const GET_SENT_MESSAGES = gql`
  query ($username: String) {
    Message(filter: { sentBy: { username: $username } }) {
      id
      text
      on {
        formatted
        day
        month
        year
      }
      sentTo {
        username
      }
      sentBy {
        username
      }
    }
  }
`; //? Works with new schema

export const DELETE_MESSAGES = gql`
  mutation DeleteMessages($where: MessageWhere) {
    deleteMessages(where: $where) {
      nodesDeleted
    }
  }
`; //? Ok

export const SEND_MESSAGE = gql`
  mutation ($data: _MessageCreate!, $userBy: ID, $userTo: ID, $messageId: ID) {
    CreateMessage(data: $data) {
      id
    }
    AddMessageSentBy(from: { id: $userBy }, to: { id: $messageId }) {
      to {
        id
      }
    }
    AddMessageSentTo(from: { id: $messageId }, to: { id: $userTo }) {
      to {
        id
      }
    }
  }
`; //? Ok

export const GET_ALL_USER_MESSAGES = gql`
  query ($username: String, $otherUser: String) {
    Message(
      orderBy: on_asc
      filter: {
        OR: [
          { sentBy: { username: $username }, AND: { sentTo: { username: $otherUser } } }
          { sentTo: { username: $username }, AND: { sentBy: { username: $otherUser } } }
        ]
      }
    ) {
      read
      text
      id
      on {
        formatted
      }
      sentTo {
        username
      }
      sentBy {
        username
      }
    }
  }
`;

export const GET_MESSAGES_BY_SEARCH = gql`
  query ($username: String, $otherUser: String) {
    Message(
      orderBy: on_asc
      filter: {
        OR: [
          { sentBy: { username: $username }, AND: { sentTo: { username_regexp: $otherUser } } }
          { sentTo: { username: $username }, AND: { sentBy: { username_regexp: $otherUser } } }
        ]
      }
    ) {
      read
      text
      on {
        formatted
        day
        month
        year
      }
      sentTo {
        username
      }
      sentBy {
        username
      }
    }
  }
`;

export const GET_MESSAGES_BY_FILTER = gql`
  query ($username: String, $otherUser: String) {
    Message(
      orderBy: on_asc
      filter: {
        OR: [
          { sentBy: { username: $username }, AND: { sentTo: { username_regexp: $otherUser } } }
          { sentTo: { username: $username }, AND: { sentBy: { username_regexp: $otherUser } } }
        ]
      }
    ) {
      read
      text
      on {
        formatted
      }
      sentTo {
        username
      }
      sentBy {
        username
      }
    }
  }
`;
////////////////////////////////////////////////////////////////////////
//                            USER
////////////////////////////////////////////////////////////////////////

export const UPDATE_USER_MEMBER_DATE = gql`
  mutation updateMemberSince($id: ID!, $memberSince: String!) {
    UpdateUser(where: { id: $id }, data: { memberSince: { formatted: $memberSince } }) {
      username
    }
  }
`;

export const GET_SINGLE_USER = gql`
  query GetUserById($username: String!) {
    User(filter: { username: $username }) {
      avgScore
      id
      email
      username
      rating {
        sentBy
        sentOn {
          formatted
        }
        sentTo
        id
        score
        feedback
      }
      inZone {
        name
        id
      }
      interestedIn {
        name
        id
      }
      languages {
        id
        name
      }
      URLs
      describedByAttributes {
        id
        name
      }
      bio
      profile
    }
  }
`; //? Ok

//This one only updates basic information
export const UPDATE_USER = gql`
  mutation ($id: ID!, $profile: String, $bio: String, $urls: [String]) {
    UpdateUserInfo(id: $id, profile: $profile, bio: $bio, URLs: $urls) {
      profile
      bio
      URLs
      contacts {
        contact
        type
      }
      referralUrl
    }
  }
`; //? Updated to new schema
export const UPDATE_USER_PIC_PROFILE = gql`
  mutation ($id: ID!, $picurl: String!) {
    UpdateUser(where: { id: $id }, data: { picurl: $picurl }) {
      picurl
    }
  }
`;

export const GET_USER_FILTERED = gql`
  query ($filters: _UserFilter!) {
    User(filter: $filters) {
      id
      username
      profile
      bio
      URLs
      interestedIn {
        id
        name
      }
      preferences {
        id
        type
      }
      inZone {
        id
        name
      }
      hasSkill {
        id
        name
      }
      avgScore
    }
  }
`;

/*Example of variables to use in the mutation 
we aware of fields that are not arrays, in those case remove square brackets
This function can be used to update any properties of the user with the connect object
{
  "userWhere": {"id": "eli-dev-user"},
  "connect": {"languages": [{"where": {"node": {"id": "language-english"}}}]}
}
 */

/// example of mutation UPDATE_USER_CONTACTS
/* export const variables = {
  id: 'eli-dev-user',
  contacts: [
    { type: 'telephone', contact: '+12222222222' },
    { type: 'telegram', contact: 'a12345678' },
  ],
} */

export const DELETE_USER_CONTACTS = gql`
  mutation ($userId: ID!, $contacts: [ID!]!) {
    RemoveUserContacts(from: { id: $userId }, to: { id_in: $contacts }) {
      to {
        id
      }
      from {
        contacts {
          contact
          type
          id
        }
      }
    }
  }
`; //? Updated to new schema

export const ADD_USER_CONTACTS = gql`
  mutation ($input: [AddUserContactsInput!]!) {
    AddUserContacts(inputs: $input) {
      username
      contacts {
        id
        contact
        type
      }
    }
  }
`; //? Updated to new schema

export const GET_USER_PREFERENCES = gql`
  query userquery($username: String!) {
    User(username: $username) {
      id
      email
      username
      preferences {
        id
        type
      }
      roles {
        id
        name
      }
    }
  }
`; //? UPDATED TO NEW GRAPH

export const GET_SINGLE_USER_INTERESTS = gql`
  query userquery($username: String!) {
    User(username: $username) {
      id
      username
      interestedIn {
        id
        name
      }
      hasSkill {
        id
        name
      }
    }
  }
`; //? UPDATED TO NEW GRAPH

export const GET_USERS_MPB = gql`
  query GetMentors($where: UserWhere) {
    users(where: $where) {
      id
      username
      profile
      bio
      interestedIn {
        name
        id
      }
      URLs
    }
  }
`; //? Ok maybe unused

export const GET_USER_ABOUT = gql`
  query userquery($userId: ID!) {
    User(id: $userId) {
      id
      picurl
      email
      username
      inZone {
        name
        id
      }
      interestedIn {
        name
        id
      }
      roles {
        id
        name
      }
      languages {
        id
        name
      }
      URLs
      describedByAttributes {
        id
        name
      }
      bio
      profile
      proposals {
        id
      }
      contacts {
        contact
        type
        id
      }
      referralUrl
    }
  }
`; //? UPDATED TO NEW GRAPH

export const VERIFY_REFERRAL = gql`
  query ($referralUrl: String) {
    User(filter: { referralUrl: $referralUrl }) {
      referralUrl
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    User(filter: { id: $id }) {
      avgScore
      id
      email
      picurl
      proposals(filter: { fundingStatus_not: null }) {
        id
        title
        detailedPlan
        inChallenge {
          title
        }
        fundingStatus {
          name
        }
        status {
          type
        }
        proposedBy {
          username
        }
      }
      username
      rating {
        sentBy
        sentOn {
          formatted
        }
        sentTo
        id
        score
        feedback
      }
      inZone {
        name
        id
      }
      interestedIn {
        name
        id
      }
      languages {
        id
        name
      }
      URLs
      describedByAttributes {
        id
        name
      }
      bio
      profile
      roles {
        id
        name
      }
    }
    Proposal(filter: { fundingStatus_not: null }) {
      id
      title
      solution
      relevantExperience
      detailedPlan
      fundingStatus {
        id
        name
        value
      }
      inChallenge {
        id
        title
        fund {
          id
          fundnumber
        }
      }
      status {
        id
        type
      }
    }
  }
`; //? UPDATEDE TO NEW GRAPH
export const GET_USER_BY_ID_FOR_LOGIN = gql`
  query GetUserById($id: ID!) {
    User(filter: { id: $id }) {
      id
      email
      username
      roles {
        name
      }
    }
  }
`; //? UPDATEDE TO NEW GRAPH

export const GET_USER_ID = gql`
  query UserQuery($username: String!) {
    User(username: $username) {
      id
      picurl
    }
  }
`; //? UPDATED TO NEW GRAPH

export const GET_USERS = gql`
  query {
    User {
      username
      email
      picurl
      avgScore
      id
      roles {
        name
      }
    }
  }
`; //? UPDATED TO NEW GRAPH

export const GET_USER_INTERESTS = gql`
  query {
    Interest {
      name
      id
    }
  }
`; //? UPDATED TO NEW GRAPH

//Query to get users based on search criteria
export const GET_USERS_BY_SEARCH = gql`
  query getUsers($searchTerm: String!, $exclude: String!) {
    User(
      filter: {
        OR: [
          { OR: { username_regexp: $searchTerm } }
          { OR: { interestedIn_some: { name_regexp: $searchTerm } } }
          { OR: { profile: $searchTerm } }
          { OR: { hasSkill_some: { name_regexp: $searchTerm } } }
        ]
        AND: { username_not: $exclude }
      }
    ) {
      username
      profile
      bio
      URLs
      labels
      roles {
        name
        id
      }
      interestedIn {
        name
        id
      }
      id
      proposals {
        id
        inChallenge {
          id
        }
      }
      preferences {
        type
        id
      }
    }
  }
`; //? Updated to new graph schema

export const GET_USER_ROLES = gql`
  query getUserLabels($username: String!) {
    User(username: $username) {
      roles {
        name
      }
      labels
    }
  }
`; //? UPDATED TO NEW GRAPH

export const UPDATE_USER_PREFERENCES = gql`
  mutation ($userId: ID!, $preferences: [ID!]!) {
    RemoveUserPreferencePreferredByUser(from: { id: $userId }, to: { id_not_in: $preferences }) {
      from {
        preferences {
          type
        }
      }
    }
    MergeUserPreferencePreferredByUser(from: { id: $userId }, to: { id_in: $preferences }) {
      from {
        preferences {
          type
        }
      }
    }
  }
`; //? NEW QUERY

export const UPDATE_USER_INTERESTS = gql`
  mutation ($userId: ID!, $interests: [ID!]!) {
    RemoveUserInterestedIn(from: { id: $userId }, to: { id_not_in: $interests }) {
      from {
        interestedIn {
          name
        }
      }
    }
    MergeUserInterestedIn(from: { id: $userId }, to: { id_in: $interests }) {
      from {
        interestedIn {
          name
        }
      }
    }
  }
`; //? NEW QUERY

////////////////////////////////////////////////////////////////////////
//                            PROPOSALS
////////////////////////////////////////////////////////////////////////

export const GET_MENTORING_PROPOSALS = gql`
  query GetMentoringProposals($username: String!) {
    Contract(filter: { mentor: { username: $username }, status: "ACCEPTED" }) {
      relatedProposal {
        title
        id
        detailedPlan
        inChallenge {
          title
        }
        status {
          id
          type
        }
        proposedBy {
          username
          id
        }
        fundingStatus {
          id
          value
          name
        }
        relatedContracts(filter: { status: "ACCEPTED" }) {
          id
          mentor {
            id
          }
        }
      }
    }
  }
`; //? UPDATED TO NEW GRAPH

export const GET_USER_PROPOSALS = gql`
  query GetUserProposals($username: String!) {
    Proposal(filter: { AND: [{ proposedBy: { username: $username } }, { status: { type: "Active" } }] }) {
      title
      id
      detailedPlan
      inChallenge {
        title
      }
      status {
        type
      }
      fundingStatus {
        value
        name
      }
    }
  }
`; //? Ok

export const GET_FUNDED_USER_PROPOSALS = gql`
  query GetUserProposals($username: String!) {
    Proposal(
      filter: {
        proposedBy: { username: $username }
        fundingStatus: { id: "funding-status-004" }
        AND: { status_not: { type: "Inactive" } }
      }
    ) {
      title
      id
      detailedPlan
      inChallenge {
        title
      }
      status {
        type
      }
      fundingStatus {
        value
        name
      }
    }
  }
`; //? Ok

export const GET_ALL_USER_PROPOSALS = gql`
  query GetUserProposals($username: String!) {
    Proposal(filter: { proposedBy: { username: $username }, status: { type: "Active" } }) {
      title
      id
      detailedPlan
      inChallenge {
        title
      }
      status {
        type
      }
      fundingStatus {
        value
        name
      }
    }
  }
`; //? UPDATED TO NEW GRAPH

export const GET_RECOMMENDED_PROPOSERS = gql`
  query GetUserProposals($username: String!) {
    User(username: $username) {
      proposersWithSimilarInterests {
        username
        id
        bio
        URLs
        avgScore
        profile
        interestedIn {
          name
          id
        }
      }
      interestedIn {
        name
        id
      }
    }
  }
`; //? UPDATED TO NEW GRAPH

export const GET_RECOMMENDED_MENTORS = gql`
  query GetUserProposals($username: String!) {
    User(username: $username) {
      mentorsWithSimilarInterests {
        username
        id
        bio
        URLs
        avgScore
        profile
        interestedIn {
          name
          id
        }
      }
      interestedIn {
        name
        id
      }
    }
  }
`; //? UPDATED TO NEW GRAPH

export const GET_RECOMMENDED_PROPOSALS = gql`
  query GetUserProposals($username: String!) {
    User(username: $username) {
      interestedIn {
        id
        name
      }
      proposalsWithSimilarInterests {
        title
        id
        detailedPlan
        relatedContracts(filter: { status: "ACCEPTED" }) {
          id
          mentor {
            id
          }
        }
        describedByInterests {
          name
        }
        inChallenge {
          title
        }
        status {
          type
        }
        fundingStatus {
          id
          value
          name
        }
        proposedBy {
          username
          id
        }
      }
    }
  }
`; //? UPDATED TO NEW GRAPH

export const GET_RECOMMENDED_TASKS = gql`
  query GetRecommendedTasks($skills: _SkillFilter!, $exclude: String!) {
    Task(filter: { neededSkills_some: $skills, AND: { forProposal_not: { proposedBy: { username: $exclude } } } }) {
      title
      id
      status {
        id
        type
      }
      descriptionOfTask
      fees
      easytask
      effort
      neededSkills {
        id
        name
      }
      forProposal {
        title
      }
    }
  }
`; //? UPDATED TO NEW GRAPH

export const GET_PROPOSAL_BY_ID = gql`
  query GetProposalById($id: ID!) {
    Proposal(id: $id) {
      id
      title
      solution
      attachments {
        id
        contentType
        filename
        url
      }
      relevantExperience
      repo
      detailedPlan
      fundingStatus {
        id
        name
        value
      }
      status {
        id
        type
      }
      inChallenge {
        id
        title
      }
      requestedFunds
      proposedBy {
        username
        id
      }
      describedByInterests {
        name
        id
      }
      relatedContracts(filter: { status: "ACCEPTED" }) {
        id
        mentor {
          id
        }
      }
      problem
      descriptionOfSolution
      howAddressesChallenge
      mainChallengesOrRisks
      detailedBudget
      teamRequired
      continuationOrNew
      sDGRating
    }
  }
`; //? UPDATED TO NEW GRAPH

/* export const ADD_PROPOSAL = gql`
  mutation AddProposal(
    $id: ID!
    $userId: ID!
    $title: String!
    $solution: String!
    $relevantExperience: String!
    $repo: String!
    $detailedPlan: String!
    $requestedFunds: Int!
    $username: String!
    $challengeId: ID!
    $statusDate: DateTime!
  ) {
    createProposals(
      input: {
        id: $id
        title: $title
        solution: $solution
        relevantExperience: $relevantExperience
        repo: $repo
        detailedPlan: $detailedPlan
        requestedFunds: $requestedFunds
        proposedBy: { connect: { edge: { isPrimary: true }, where: { node: { username: $username } } } }
        status: {
          connect: {
            where: { node: { type: "Active" } }
            edge: { statusChangedBy: $userId, changedStatusOn: $statusDate, passedStatusHistory: "" }
          }
        }
        fundingStatus: { connect: { where: { node: { name: "Looking For Mentor" } } } }
        inChallenge: { connect: { where: { node: { id: $challengeId } } } }
      }
    ) {
      proposals {
        id
        title
        solution
        relevantExperience
        repo
        detailedPlan
        status {
          id
          type
        }
        requestedFunds
      }
    }
  }
`; */
// export const ADD_PROPOSAL = gql`
//   mutation AddProposal(
//     $id: ID!
//     $userId: ID!
//     $title: String!
//     $solution: String!
//     $relevantExperience: String!
//     $repo: String!
//     $detailedPlan: String!
//     $requestedFunds: Int!
//     $username: String!
//     $challengeId: ID!
//     $statusDate: DateTime!
//     $problem: String!
//     $descriptionOfSolution: String!
//     $howAddressesChallenge: String!
//     $mainChallengesOrRisks: String!
//     $detailedBudget: String!
//     $teamRequired: String!
//     $continuationOrNew: String!
//     $sDGRating: String!
//     $isTemplate: Boolean
//   ) {
//     createProposals(
//       input: {
//         id: $id
//         title: $title
//         solution: $solution
//         relevantExperience: $relevantExperience
//         repo: $repo
//         detailedPlan: $detailedPlan
//         requestedFunds: $requestedFunds
//         proposedBy: { connect: { edge: { isPrimary: true }, where: { node: { username: $username } } } }
//         status: {
//           connect: {
//             where: { node: { type: "Active" } }
//             edge: { statusChangedBy: $userId, changedStatusOn: $statusDate, passedStatusHistory: "" }
//           }
//         }
//         fundingStatus: { connect: { where: { node: { name: "Looking For Mentor" } } } }
//         inChallenge: { connect: { where: { node: { id: $challengeId } } } }
//         problem: $problem
//         descriptionOfSolution: $descriptionOfSolution
//         howAddressesChallenge: $howAddressesChallenge
//         mainChallengesOrRisks: $mainChallengesOrRisks
//         detailedBudget: $detailedBudget
//         teamRequired: $teamRequired
//         continuationOrNew: $continuationOrNew
//         sDGRating: $sDGRating
//         isTemplate: $isTemplate
//       }
//     ) {
//       proposals {
//         id
//         title
//         solution
//         relevantExperience
//         repo
//         detailedPlan
//         status {
//           id
//           type
//         }
//         requestedFunds
//       }
//     }
//   }
// `; //! removed userId and statusDate
export const ADD_PROPOSAL = gql`
  mutation AddProposal(
    $id: ID!
    $title: String!
    $solution: String!
    $relevantExperience: String!
    $repo: String!
    $detailedPlan: String!
    $requestedFunds: Int!
    $challengeId: ID!
    $problem: String!
    $descriptionOfSolution: String!
    $howAddressesChallenge: String!
    $mainChallengesOrRisks: String!
    $detailedBudget: String!
    $teamRequired: String!
    $continuationOrNew: String!
    $sDGRating: String!
    $isTemplate: Boolean
    $interests: [ID!]
    $userId: ID
    $fundingId: ID
  ) {
    CreateProposal(
      data: {
        id: $id
        title: $title
        solution: $solution
        relevantExperience: $relevantExperience
        repo: $repo
        detailedPlan: $detailedPlan
        requestedFunds: $requestedFunds
        problem: $problem
        descriptionOfSolution: $descriptionOfSolution
        howAddressesChallenge: $howAddressesChallenge
        mainChallengesOrRisks: $mainChallengesOrRisks
        detailedBudget: $detailedBudget
        teamRequired: $teamRequired
        continuationOrNew: $continuationOrNew
        sDGRating: $sDGRating
        isTemplate: $isTemplate
      }
    ) {
      id
    }
    AddProposalProposedBy(from: { id: $userId }, to: { id: $id }) {
      to {
        id
      }
    }
    AddProposalFundingStatus(from: { id: $id }, to: { id: $fundingId }) {
      to {
        id
      }
    }
    AddProposalStatus(from: { id: $id }, to: { id: "proposal-status-active" }) {
      to {
        id
      }
    }
    AddProposalInChallenge(from: { id: $challengeId }, to: { id: $id }) {
      to {
        id
      }
    }
    AddInterestProposals(from: { id: $id }, to: { id_in: $interests }) {
      to {
        id
      }
    }
  }
`; //? UPDATE TO NEW GRAPH

export const GET_FILTERED_PROPOSALS = gql`
  query ($filters: _ProposalFilter!) {
    Proposal(filter: $filters) {
      id
      title
      status {
        type
      }
      fundingStatus {
        value
        id
      }
      relatedContracts(filter: { status: "ACCEPTED" }) {
        id
        mentor {
          id
        }
      }
      detailedPlan
      proposedBy {
        preferences {
          id
          type
        }
        inZone {
          id
          name
        }
      }
    }
  }
`;

export const ADD_MENTOR_PROPOSAL = gql`
  mutation AddProposal($id: ID!, $title: String!, $userId: ID!) {
    CreateProposal(data: { id: $id, title: $title }) {
      id
    }
    AddProposalProposedBy(from: { id: $userId }, to: { id: $id }) {
      to {
        id
      }
    }
    AddProposalFundingStatus(from: { id: $id }, to: { id: "funding-status-005" }) {
      to {
        id
      }
    }
    AddProposalStatus(from: { id: $id }, to: { id: "proposal-status-active" }) {
      to {
        id
      }
    }
  }
`; //? Ok

export const ADD_DRAFT_PROPOSAL = gql`
  mutation AddProposal(
    $id: ID!
    $title: String!
    $solution: String!
    $relevantExperience: String!
    $repo: String!
    $detailedPlan: String!
    $requestedFunds: Int!
    $challengeId: ID!
    $problem: String!
    $descriptionOfSolution: String!
    $howAddressesChallenge: String!
    $mainChallengesOrRisks: String!
    $detailedBudget: String!
    $teamRequired: String!
    $continuationOrNew: String!
    $sDGRating: String!
    $isTemplate: Boolean
    $interests: [ID!]
    $userId: ID
    $fundingId: ID
  ) {
    CreateProposal(
      data: {
        id: $id
        title: $title
        solution: $solution
        relevantExperience: $relevantExperience
        repo: $repo
        detailedPlan: $detailedPlan
        requestedFunds: $requestedFunds
        problem: $problem
        descriptionOfSolution: $descriptionOfSolution
        howAddressesChallenge: $howAddressesChallenge
        mainChallengesOrRisks: $mainChallengesOrRisks
        detailedBudget: $detailedBudget
        teamRequired: $teamRequired
        continuationOrNew: $continuationOrNew
        sDGRating: $sDGRating
        isTemplate: $isTemplate
      }
    ) {
      id
    }
    AddProposalProposedBy(from: { id: $userId }, to: { id: $id }) {
      to {
        id
      }
    }
    AddProposalFundingStatus(from: { id: $id }, to: { id: $fundingId }) {
      to {
        id
      }
    }
    AddProposalStatus(from: { id: $id }, to: { id: "proposal-status-active" }) {
      to {
        id
      }
    }
    AddProposalInChallenge(from: { id: $challengeId }, to: { id: $id }) {
      to {
        id
      }
    }
    AddInterestProposals(from: { id: $id }, to: { id_in: $interests }) {
      to {
        id
      }
    }
  }
`; //? Ok

export const GET_PROPOSAL_TAGS = gql`
  query GetProposalTags {
    proposalTags {
      id
      name
    }
  }
`; //! unused

export const SET_PROPOSAL_INACTIVE = gql`
  mutation ($proposalId: ID!) {
    MergeProposalStatusProposals(from: { id: $proposalId }, to: { id: "proposal-status-inactive" }) {
      from {
        id
        title
      }
    }
    RemoveProposalStatusProposals(from: { id: $proposalId }, to: { id: "proposal-status-active" }) {
      from {
        id
        title
      }
    }
  }
`; //? UPDATED TO NEW GRAPH

export const SET_PROPOSAL_ACTIVE = gql`
  mutation ($proposalId: ID!) {
    MergeProposalStatusProposals(from: { id: $proposalId }, to: { id: "proposal-status-active" }) {
      from {
        id
        title
      }
    }
    RemoveProposalStatusProposals(from: { id: $proposalId }, to: { id: "proposal-status-inactive" }) {
      from {
        id
        title
      }
    }
  }
`; //? UPDATED TO NEW GRAPH

export const REMOVE_PROPOSAL = gql`
  mutation ($proposalId: ID!) {
    MergeProposalStatusProposals(from: { id: $proposalId }, to: { id: "proposal-status-removed" }) {
      from {
        id
        title
      }
    }
    RemoveProposalStatusProposals(from: { id: $proposalId }, to: { id: "proposal-status-inactive" }) {
      from {
        id
        title
      }
    }
  }
`; //? UPDATED TO NEW GRAPH

//
// Update Proposals
//
// export const UPDATE_PROPOSALS = gql`
//   mutation ($where: ProposalWhere, $disconnect: ProposalDisconnectInput, $connect: ProposalConnectInput) {
//     updateProposals(where: $where, disconnect: $disconnect, connect: $connect) {
//       proposals {
//         id
//       }
//     }
//   }
// `; //! Unused

//
// Funding Status List
//
export const GET_FUNDING_STATUS_LIST = gql`
  query GetFundingStatusList {
    FundingStatus {
      id
      name
      value
    }
  }
`; //? Ok

export const ADD_ATTACHMENT = gql`
  mutation UpdateProposals($id: ID!, $filename: String!, $url: String!) {
    updateProposals(update: { attachments: { create: { PDF: { filename: $filename, url: $url } } } }) {
      proposals {
        id
        fundingStatus {
          id
        }
      }
    }
  }
`; //! unused

export const EDIT_PROPOSAL = gql`
  mutation (
    $id: ID!
    $title: String
    $problem: String
    $solution: String
    $descriptionOfSolution: String
    $howAddressesChallenge: String
    $mainChallengesOrRisks: String
    $relevantExperience: String
    $repo: String
    $detailedPlan: String
    $detailedBudget: String
    $teamRequired: String
    $continuationOrNew: String
    $sDGRating: String
    $requestedFunds: Int
  ) {
    UpdateProposal(
      where: { id: $id }
      data: {
        title: $title
        problem: $problem
        solution: $solution
        descriptionOfSolution: $descriptionOfSolution
        howAddressesChallenge: $howAddressesChallenge
        mainChallengesOrRisks: $mainChallengesOrRisks
        relevantExperience: $relevantExperience
        repo: $repo
        detailedPlan: $detailedPlan
        detailedBudget: $detailedBudget
        teamRequired: $teamRequired
        continuationOrNew: $continuationOrNew
        sDGRating: $sDGRating
        requestedFunds: $requestedFunds
      }
    ) {
      id
    }
  }
`; //? Updated to new graph schema

//Query for getting the proposal by search criteria
export const GET_PROPOSALS_BY_SEARCH = gql`
  query getProposals($searchTerm: String!, $exclude: String!) {
    Proposal(
      filter: {
        OR: [
          { OR: { title_regexp: $searchTerm } }
          { OR: { proposedBy: { username_regexp: $searchTerm } } }
          { OR: { describedByInterests_some: { name_regexp: $searchTerm } } }
          { OR: { problem_regexp: $searchTerm } }
        ]
        AND: { proposedBy_not: { username: $exclude } }
      }
    ) {
      id
      title
      detailedPlan
      proposedBy {
        username
        id
      }
      solution
      describedByInterests {
        id
        name
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
      relatedContracts(filter: { status: "ACCEPTED" }) {
        id
        mentor {
          id
        }
      }
    }
  }
`; //? Updated to new schema

export const ADD_PROPOSAL_FUNDING_STATUS = gql`
  mutation add($fundingStatusId: ID!, $proposalId: ID!) {
    AddProposalFundingStatus(from: { id: $proposalId }, to: { id: $fundingStatusId }) {
      from {
        id
      }
    }
  }
`; //? New

export const UPDATE_PROPOSAL_FUNDING_STATUS = gql`
  mutation update($fundingStatusId: ID!, $proposalId: ID!) {
    RemoveProposalFundingStatus(from: { id: $proposalId }, to: { id_not: $fundingStatusId }) {
      from {
        id
      }
    }
    AddProposalFundingStatus(from: { id: $proposalId }, to: { id: $fundingStatusId }) {
      from {
        id
      }
    }
  }
`; //? New

export const ADD_PROPOSAL_CHALLENGE = gql`
  mutation add($proposalId: ID!, $challengeId: ID!) {
    AddProposalInChallenge(from: { id: $challengeId }, to: { id: $proposalId }) {
      from {
        id
      }
    }
  }
`; //? New

export const UPDATE_PROPOSAL_CHALLENGE = gql`
  mutation add($proposalId: ID!, $challengeId: ID!) {
    RemoveProposalInChallenge(from: { id_not: $challengeId }, to: { id: $proposalId }) {
      from {
        id
      }
    }
    AddProposalInChallenge(from: { id: $challengeId }, to: { id: $proposalId }) {
      from {
        id
      }
    }
  }
`; //? New

export const ADD_PROPOSAL_INTERESTS = gql`
  mutation ($proposalId: ID!, $interestsIds: [ID!]!) {
    AddProposalDescribedByInterests(from: { id: $proposalId }, to: { id_in: $interestsIds }) {
      from {
        id
      }
    }
  }
`; //? New

export const UPDATE_PROPOSAL_INTERESTS = gql`
  mutation ($proposalId: ID!, $interestsIds: [ID!]!) {
    RemoveProposalDescribedByInterests(from: { id: $proposalId }, to: { id_not_in: $interestsIds }) {
      from {
        id
      }
    }
    MergeProposalDescribedByInterests(from: { id: $proposalId }, to: { id_in: $interestsIds }) {
      from {
        id
      }
    }
  }
`; //? New

////////////////////////////////////////////////////////////////////////
//                            PROFILE ATTRIBUTES
////////////////////////////////////////////////////////////////////////

export const CREATE_USER_PROFILE_ATTRIBUTES = gql`
  mutation createUserProfileAttributes {
    createUserProfileAttributes(input: { id: $id, name: $name }) {
      userProfileAttributes {
        name
        id
      }
    }
  }
`; //! unused

export const UPDATE_USER_PROFILE_ATTRIBUTES = gql`
  mutation UpdateUserProfileAttributes {
    UpdateUserProfileAttributes(id: $id, attributes: $attributes) {
      describedByAttributes {
        name
      }
    }
  }
`; //! unused

////////////////////////////////////////////////////////////////////////
//                            TIMEZONES
////////////////////////////////////////////////////////////////////////

export const CREATE_TIMEZONE = gql`
  mutation createTimezones($id: ID!, $name: String!) {
    createTimezones(input: { id: $id, name: $name }) {
      timezones {
        id
      }
    }
  }
`; //? Ok (to be used later in admin panel)

export const UPDATE_USER_ROLES_LANGS_TIMEZONE = gql`
  mutation ($userId: ID!, $roles: [ID!], $languages: [ID!], $timezone: ID!, $referralUrl: String) {
    RemoveRoleUsers(from: { id: $userId }, to: { id_not_in: $roles }) {
      from {
        id
        roles {
          name
        }
      }
    }
    MergeRoleUsers(from: { id: $userId }, to: { id_in: $roles }) {
      from {
        id
      }
    }
    RemoveLanguageUsers(from: { id: $userId }, to: { id_not_in: $languages }) {
      to {
        id
      }
    }
    MergeLanguageUsers(from: { id: $userId }, to: { id_in: $languages }) {
      to {
        id
      }
    }
    MergeUserInZone(from: { id: $userId }, to: { id: $timezone }) {
      from {
        id
      }
    }
    RemoveUserInZone(from: { id: $userId }, to: { id_not: $timezone }) {
      from {
        id
      }
    }
    UpdateUser(where: { id: $userId }, data: { referralUrl: $referralUrl }) {
      referralUrl
    }
  }
`; //? Updated to new schema

export const GET_TIMEZONES = gql`
  query {
    Timezone(orderBy: id_asc) {
      id
      name
    }
  }
`; //? Ok

////////////////////////////////////////////////////////////////////////
//                            CHALLENGE
////////////////////////////////////////////////////////////////////////

export const GET_CHALLENGES = gql`
  query {
    Challenge(filter: { isActive: true }) {
      id
      fund {
        id
        fundnumber
      }
      title
    }
  }
`; //? Ok
////////////////////////////////////////////////////////////////////////
//                           LANGUAGE                                 //
////////////////////////////////////////////////////////////////////////
export const GET_LANGUAGES = gql`
  query {
    Language {
      id
      name
    }
  }
`; //? Ok

////////////////////////////////////////////////////////////////////////
//                            LABELS
////////////////////////////////////////////////////////////////////////

// ADD
export const ADD_MENTOR_LABEL = gql`
  mutation SetMentorLabel($id: ID!) {
    SetMentorLabel(id: $id) {
      username
      labels
    }
  }
`; //? Ok

export const ADD_PROPOSER_LABEL = gql`
  mutation SetProposerLabel($id: ID!) {
    SetProposerLabel(id: $id) {
      username
      labels
    }
  }
`; //? Ok

//REMOVE
export const REMOVE_PROPOSER_LABEL = gql`
  mutation RemoveProposerLabel($id: ID!) {
    RemoveProposerLabel(id: $id) {
      username
      labels
    }
  }
`; //? Ok

export const REMOVE_MENTOR_LABEL = gql`
  mutation RemoveMentorLabel($id: ID!) {
    RemoveMentorLabel(id: $id) {
      username
      labels
    }
  }
`; //? Ok

export const GET_USER_PREFERENCES_LABEL = gql`
  query {
    UserPreference {
      id
      type
    }
  }
`; //? UPDATED TO NEW GRAPH

////////////////////////////////////////////////////////////////////////
//                            CONTRACTS
////////////////////////////////////////////////////////////////////////

export const GET_MY_PROPOSALS_CONTRACTS = gql`
  query ($username: String) {
    Contract(filter: { proposer: { username: $username } }) {
      id
      terms
      status
      mentor {
        username
        id
      }
      proposer {
        username
        id
      }
      relatedProposal {
        title
        id
        fundingStatus {
          id
          name
        }
      }
      mentor {
        username
        id
      }
    }
  }
`; //? UPDATED TO NEW GRAPH

export const GET_MY_PENDING_PROPOSER_CONTRACTS = gql`
  query ($username: String) {
    Contract(filter: { proposer: { username: $username }, isMentorApprover: false, status: "PENDING", relatedProposal_not: null }) {
      id
      terms
      status
      isMentorApprover
      mentor {
        username
        id
      }
      proposer {
        username
        id
      }
      relatedProposal {
        title
        id
        fundingStatus {
          id
          name
        }
      }
      mentor {
        username
        id
      }
    }
  }
`; //? UPDATED TO NEW GRAPH

export const GET_MY_PENDING_PROPOSALS_CONTRACTS = gql`
  query ($username: String) {
    Contract(
      filter: {
        proposer: { username: $username }
        AND: { status: "PENDING" }
        mentor_not: null
        relatedProposal: { proposedBy: { username_not: $username } }
      }
    ) {
      id
      terms
      status
      mentor {
        username
        id
      }
      proposer {
        username
        id
      }
      relatedProposal {
        title
        id
        proposedBy {
          username
        }
        fundingStatus {
          id
          name
        }
      }
      mentor {
        username
        id
      }
    }
  }
`; //? UPDATED TO NEW GRAPH

export const GET_MY_PENDING_SENT_PROPOSALS_CONTRACTS = gql`
  query ($username: String) {
    Contract(
      filter: {
        proposer: { username: $username }
        AND: { status: "PENDING" }
        mentor_not: null
        relatedProposal: { proposedBy: { username: $username } }
      }
    ) {
      id
      isMentorApprover
      terms
      status
      mentor {
        username
        id
      }
      proposer {
        username
        id
      }
      relatedProposal {
        title
        id
        proposedBy {
          username
        }
        fundingStatus {
          id
          name
        }
      }
      mentor {
        username
        id
      }
    }
  }
`; //? UPDATED TO NEW GRAPH

export const GET_MY_MENTORING_CONTRACTS = gql`
  query ($username: String) {
    Contract(filter: { mentor: { username: $username } }) {
      id
      terms
      status
      mentor {
        username
        id
      }
      proposer {
        username
        id
      }
      relatedProposal {
        title
        id
        fundingStatus {
          name
        }
      }
      mentor {
        username
        id
      }
    }
  }
`; //? UPDATED TO NEW GRAPH

export const GET_MY_ACC_PROPOSALS_CONTRACTS = gql`
  query ($username: String) {
    Contract(filter: { proposer: { username: $username }, mentor_not: null, AND: { OR: [{ status: "ACCEPTED" }] } }) {
      id
      terms
      status
      mentor {
        username
        id
      }
      proposer {
        username
        id
      }
      relatedProposal {
        title
        id
        fundingStatus {
          name
        }
      }
      mentor {
        username
        id
      }
    }
  }
`; //? UPDATED TO NEW GRAPH

export const GET_MY_ACC_MENTORING_CONTRACTS = gql`
  query ($username: String) {
    Contract(filter: { mentor: { username: $username }, proposer_not: null, AND: { OR: [{ status: "ACCEPTED" }] } }) {
      id
      terms
      status
      mentor {
        username
        id
      }
      proposer {
        username
        id
      }
      relatedProposal {
        title
        id
        fundingStatus {
          name
        }
      }
      mentor {
        username
        id
      }
    }
  }
`; //? UPDATED TO NEW GRAPH

export const GET_MY_REJ_PROPOSALS_CONTRACTS = gql`
  query ($username: String) {
    Contract(filter: { proposer: { username: $username }, mentor_not: null, AND: { OR: [{ status: "REJECTED" }] } }) {
      id
      terms
      status
      mentor {
        username
        id
      }
      proposer {
        username
        id
      }
      relatedProposal {
        title
        id
        fundingStatus {
          name
        }
      }
      mentor {
        username
        id
      }
    }
  }
`; //? UPDATED TO NEW GRAPH

export const GET_MY_REJ_MENTORING_CONTRACTS = gql`
  query ($username: String) {
    Contract(filter: { mentor: { username: $username }, proposer_not: null, AND: { OR: [{ status: "REJECTED" }] } }) {
      id
      terms
      status
      mentor {
        username
        id
      }
      proposer {
        username
        id
      }
      relatedProposal {
        title
        id
        fundingStatus {
          name
        }
      }
      mentor {
        username
        id
      }
    }
  }
`; //? UPDATED TO NEW GRAPH

export const UPDATE_CONTRACT_TERMS = gql`
  mutation ($contractID: ID!, $newTerms: String) {
    UpdateContract(where: { id: $contractID }, data: { terms: $newTerms }) {
      terms
      proposer {
        id
        username
      }
    }
  }
`; //? Ok

export const CREATE_CONTRACT = gql`
  mutation CreateContract($data: _ContractCreate!, $proposalId: ID!, $contractId: ID!, $mentorId: ID!, $proposerId: ID!) {
    CreateContract(data: $data) {
      id
    }
    AddContractRelatedProposal(from: { id: $proposalId }, to: { id: $contractId }) {
      to {
        id
      }
    }
    AddContractMentor(from: { id: $mentorId }, to: { id: $contractId }) {
      to {
        id
      }
    }
    AddContractProposer(from: { id: $proposerId }, to: { id: $contractId }) {
      to {
        id
      }
    }
  }
`;

//! Awaiting AddCollaborator Method creation
export const CREATE_TASK_CONTRACT = gql`
  mutation CC(
    $collaboratorId: ID!
    $proposerId: ID!
    $taskId: ID!
    $contractId: ID!
    $terms: String!
    $status: String!
    $date: _Neo4jDateTimeInput!
  ) {
    CreateContract(data: { id: $contractId, terms: $terms, status: $status, date: $date }) {
      status
    }
    AddContractRelatedTask(from: { id: $taskId }, to: { id: $contractId }) {
      to {
        id
      }
    }
    AddContractCollaborator(from: { id: $collaboratorId }, to: { id: $contractId }) {
      to {
        id
      }
    }
    AddContractProposer(from: { id: $proposerId }, to: { id: $contractId }) {
      to {
        id
      }
    }
  }
`;

////////////////////////////////////////////////////////////////////////
//                            RATINGS
////////////////////////////////////////////////////////////////////////

export const GET_USER_RATINGS = gql`
  query GetRatings($where: UserRatingWhere) {
    userRatings(where: $where) {
      id
      score
      sentBy
      sentTo
      sentOn
      feedback
    }
  }
`; //? Ok

export const CREATE_RATING_NODE = gql`
  mutation ($id: ID!, $score: Int!, $feedback: String!, $sentBy: String!, $sentTo: String!, $sentOn: _Neo4jDateTimeInput!) {
    CreateUserRating(data: { id: $id, score: $score, feedback: $feedback, sentBy: $sentBy, sentTo: $sentTo, sentOn: $sentOn }) {
      id
    }
  }
`; //? Ok

export const CONNECT_RATING_TO_USER = gql`
  mutation ($userId: ID!, $ratingID: ID!) {
    AddUserRating(from: { id: $ratingID }, to: { id: $userId }) {
      to {
        id
      }
    }
  }
`; //? Ok

export const CONNECT_RATING_TO_USER_HAS_RATED = gql`
  mutation ($userId: ID!, $ratingID: ID!) {
    AddUserHasRatedUsers(from: { id: $userId }, to: { id: $ratingID }) {
      from {
        id
      }
    }
  }
`; //? Ok

export const GET_TOP_TEN_MENTORS = gql`
  query {
    users(where: { rating: { score_NOT: null }, roles: { name: "Mentor" } }, options: { sort: { avgScore: DESC }, limit: 10 }) {
      username
      avgScore
    }
  }
`; //! Pending add userSort type in schema
export const GET_TOP_TEN_PROPOSERS = gql`
  query {
    users(where: { rating: { score_NOT: null }, roles: { name: "Proposer" } }, options: { sort: { avgScore: DESC }, limit: 10 }) {
      username
      avgScore
    }
  }
`; //! Pending add userSort type in schema

////////////////////////////////////////////////////////////////////////
//                            NOTIFICATIONS
////////////////////////////////////////////////////////////////////////

export const UPDATE_NOTIFICATIONS = gql`
  mutation ($ids: [ID!]!) {
    UpdateUserNotification(where: { id_in: $ids }, data: { read: true }) {
      read
    }
  }
`;

export const CREATE_LATEST_ACTIVITIES = gql`
  mutation createNotification($id: ID!, $message: String!, $date: _Neo4jDateTimeInput!, $link: String!) {
    CreateUserNotification(data: { id: $id, message: $message, createdOn: $date, link: $link, read: false }) {
      id
      message
    }
  }
`;

export const GET_LATEST_ACTIVITIES = gql`
  query ($username: String) {
    User(username: $username) {
      hasnotification(filter: { message_contains: "#LAT-ACT" }) {
        message
        createdOn {
          formatted
        }
      }
    }
  }
`; //? UPDATED TO NEW GRAPH
export const GET_NOTIFICATIONS = gql`
  query ($username: String) {
    UserNotification(
      orderBy: createdOn_desc
      filter: { AND: [{ hasnotification_some: { username: $username } }, { message_not_contains: "#LAT-ACT" }] }
    ) {
      id
      createdOn {
        formatted
      }
      message
      link
      read
      hasnotification {
        username
      }
    }
  }
`; //? UPDATED TO NEW GRAPH

export const CONNECT_NOTIFICATION_TO_ALL_USERS = gql`
  mutation addNotificationToUser($notificationID: ID!) {
    AddUserNotificationHasnotification(from: { id_not: "this-user-id-doesnt-exists" }, to: { id: $notificationID }) {
      to {
        id
      }
      from {
        username
      }
    }
  }
`; //! updated

export const CONNECT_NOTIFICATION_TO_USER = gql`
  mutation addNotificationToUser($userID: ID!, $notificationID: ID!) {
    AddUserNotificationHasnotification(from: { id: $userID }, to: { id: $notificationID }) {
      to {
        id
      }
      from {
        username
      }
    }
  }
`; //! updated

export const CREATE_NOTIFICATION = gql`
  mutation createNotification($id: ID!, $message: String!, $date: _Neo4jDateTimeInput!, $link: String!) {
    CreateUserNotification(data: { id: $id, message: $message, createdOn: $date, link: $link, read: false }) {
      id
      message
    }
  }
`; //! updated

export const CREATE_AND_CONNECT_NOTIFICATION = gql`
  mutation ($id: ID!, $read: Boolean!, $message: String!, $date: DateTime!, $link: String!, $userID: ID!) {
    createUserNotifications(
      input: {
        hasnotification: { connect: { where: { id: $userID } } }
        id: $id
        message: $message
        createdOn: $date
        link: $link
        read: $read
      }
    ) {
      userNotifications {
        link
      }
    }
  }
`; //? NOT USED

export const GET_MY_PENDING_MENTORING_CONTRACTS = gql`
  query ($username: String) {
    Contract(
      filter: {
        mentor: { username: $username }
        AND: { status: "PENDING" }
        mentor_not: null
        relatedProposal: { proposedBy: { username_not: $username } }
      }
    ) {
      id
      terms
      status
      mentor {
        username
        id
      }
      proposer {
        username
        id
      }
      relatedProposal {
        title
        id
        proposedBy {
          username
        }
        fundingStatus {
          name
        }
      }
      mentor {
        username
        id
      }
    }
  }
`; //? Ok
//!verificar la creacion de contratos pendientes

export const GET_MY_PENDING_SENT_MENTORING_CONTRACTS = gql`
  query ($username: String) {
    Contract(filter: { mentor: { username: $username }, AND: { status: "PENDING" }, proposer_not: null, relatedProposal: null }) {
      id
      terms
      status
      mentor {
        username
        id
      }
      proposer {
        username
        id
      }
      relatedProposal {
        title
        id
        proposedBy {
          username
        }
        fundingStatus {
          name
        }
      }
      mentor {
        username
        id
      }
    }
  }
`; //? Ok

export const GET_USER_PROPOSAL_TEMPLATES = gql`
  query GetUserProposalTemplates($username: String) {
    User(filter: { username: $username }) {
      id
      email
      username
      proposals(filter: { isTemplate: true }) {
        id
        title
        isTemplate
        inChallenge {
          id
        }
        problem
        solution
        relevantExperience
        repo
        detailedPlan
        requestedFunds
        descriptionOfSolution
        howAddressesChallenge
        describedByInterests {
          id
          name
        }
        mainChallengesOrRisks
        detailedBudget
        teamRequired
        continuationOrNew
        sDGRating
      }
    }
  }
`; //? NEW GRAPH

export const GET_USER_PROPOSAL_TASK = gql`
  query ($username: String) {
    Proposal(filter: { proposedBy: { username: $username } }) {
      title
      relatedTasks {
        id
        status {
          id
        }
      }
    }
  }
`; //? NEW GRAPH

export const SET_PROPOSAL_FSTATUS_DRAFT = gql`
  mutation SetProposalStatusAsDraft($proposalId: ID!, $proposalStatusId: ID) {
    RemoveProposalFundingStatus(from: { id: $proposalId }, to: { id: $proposalStatusId }) {
      from {
        id
      }
      to {
        id
      }
    }
    AddProposalFundingStatus(from: { id: $proposalId }, to: { id: "funding-status-000" }) {
      from {
        id
      }
      to {
        id
      }
    }
  }
`; //? UPDATED TO NEW GRAPH

export const SET_PROPOSAL_FSTATUS_LOOKING_FOR_MENTOR = gql`
  mutation SetProposalStatusAsLookingForMentor($proposalId: ID!, $proposalStatusId: ID) {
    RemoveProposalFundingStatus(from: { id: $proposalId }, to: { id: $proposalStatusId }) {
      from {
        id
      }
      to {
        id
      }
    }
    AddProposalFundingStatus(from: { id: $proposalId }, to: { id: "funding-status-001" }) {
      from {
        id
      }
      to {
        id
      }
    }
  }
`; //? UPDATED TO NEW GRAPH

export const SET_PROPOSAL_FSTATUS_MENTOR_ASSIGNED = gql`
  mutation SetProposalStatusAsMentorAssigned($proposalId: ID!, $proposalStatusId: ID) {
    RemoveProposalFundingStatus(from: { id: $proposalId }, to: { id: $proposalStatusId }) {
      from {
        id
      }
      to {
        id
      }
    }
    AddProposalFundingStatus(from: { id: $proposalId }, to: { id: "funding-status-002" }) {
      from {
        id
      }
      to {
        id
      }
    }
  }
`; //? UPDATED TO NEW GRAPH

export const SET_PROPOSAL_FSTATUS_PRESENTED = gql`
  mutation SetProposalStatusPresented($proposalId: ID!, $proposalStatusId: ID) {
    RemoveProposalFundingStatus(from: { id: $proposalId }, to: { id: $proposalStatusId }) {
      from {
        id
      }
      to {
        id
      }
    }
    AddProposalFundingStatus(from: { id: $proposalId }, to: { id: "funding-status-003" }) {
      from {
        id
      }
      to {
        id
      }
    }
  }
`; //? UPDATED TO NEW GRAPH

export const SET_PROPOSAL_FSTATUS_FUNDED = gql`
  mutation SetProposalStatusFunded($proposalId: ID!, $proposalStatusId: ID) {
    RemoveProposalFundingStatus(from: { id: $proposalId }, to: { id: $proposalStatusId }) {
      from {
        id
      }
      to {
        id
      }
    }
    AddProposalFundingStatus(from: { id: $proposalId }, to: { id: "funding-status-004" }) {
      from {
        id
      }
      to {
        id
      }
    }
  }
`; //? UPDATED TO NEW GRAPH

export const CREATE_FLAG = gql`
  mutation ($data: _FlagCreate!, $fromUser: ID!, $flaggedUser: ID!, $flagId: ID!) {
    CreateFlag(data: $data) {
      id
      message
      status
    }
    AddFlagFlaggedUser(from: { id: $flagId }, to: { id: $flaggedUser }) {
      to {
        username
      }
    }
    AddFlagFlaggingUser(from: { id: $fromUser }, to: { id: $flagId }) {
      from {
        username
      }
    }
  }
`;

//TOUR

export const GET_USER_MEMBER_SINCE = gql`
  query ($username: String!) {
    User(username: $username) {
      memberSince {
        formatted
      }
    }
  }
`;

export const GET_USER_MENTORED_PROPOSALS = gql`
  query ($username: String) {
    Proposal(filter: { relatedContracts: { AND: [{ mentor: { username: $username } }, { status: "ACCEPTED" }] } }) {
      id
      title
      detailedPlan
      inChallenge {
        title
      }
      proposedBy {
        username
      }
      status {
        type
      }
      fundingStatus {
        name
      }
    }
  }
`; //? UPDATED TO NEW GRAPH

export const CREATE_ATTACHMENT = gql`
  mutation ($attachmentId: ID!, $attachmentUrl: String!, $proposalId: ID!) {
    CreateAttachment(data: { id: $attachmentId, filename: "picAttachment", url: $attachmentUrl, contentType: "picAttachment" }) {
      id
    }
    AddProposalAttachments(from: { id: $proposalId }, to: { id: $attachmentId }) {
      to {
        id
      }
    }
  }
`; //? UPDATED TO NEW GRAPH
