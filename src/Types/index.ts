import { DateTime } from 'luxon';

export interface NetworkAuthValue {
  id?: string;
  isAuthenticated: boolean;
  username?: string;
  email?: string;
  roles: string[];
  labels: string[];
  accountType: string; // google, discord, pmm, etc
  login?: ({ username, password }: { username: string; password: string }) => void;
  logout?: () => void;
  signup?: ({
    username,
    password,
    pwconfirmation,
    email,
  }: {
    username: string;
    password: string;
    pwconfirmation: string;
    email: string;
  }) => void;
  loginAsGoogle?: (token: string) => void;
  signupAsGoogle?: (token: string) => void;
  post?: (url: string, data: DataType, requiresAuth: boolean) => void;
  get?: (url: string, requiresAuth: boolean) => void;
  put?: (url: string, data: DataType, requiresAuth: boolean) => void;
  del?: (url: string, requiresAuth: boolean) => void;
  loginUser?: (data: {
    id: string;
    username: string;
    access_token?: string;
    refresh_token?: string;
    exp?: string;
    email: string;
    roles: Role[];
    labels: string[];
  }) => any;
}

export type TokenState = {
  access_token: string;
  refresh_token: string;
  exp: DateTime;
  refresh_exp: DateTime;
};

export interface DataType {
  [key: string]: unknown;
}

export interface Challenge {
  title: string;
  id: string;
}
export interface FundingStatus {
  id: string;
  name: string;
  value: number;
}
export interface ProposalTag {
  name: string;
}
export interface ProposalStatus {
  type: string;
}

export interface Attachment {
  id: string;
  filename: string;
  url: string;
  contentType: string;
}

export interface TaskStatus {
  id: string;
  type: string;
  proposal: Task[];
}

export interface Task {
  id: string;
  title: string;
  effort: string;
  fees: number;
  descriptionOfTask: string;
  easytask: boolean;
  forProposal: Proposal;
  isTemplate: boolean;
  neededSkills: Skill[];
  status: TaskStatus;
  relatedContracts: Contract[];
}

export interface Reading {
  id: string;
  url: string;
  isRead: boolean;
  mentorReadings: User[];
  menteeReadings: User[];
  proposalReading: Proposal[];
}

export interface ProposalRating {
  id: string;
  score: number;
  rates: Proposal[];
}
export interface Proposal {
  id: string;
  title: string;
  titleStatus: boolean;
  problem: string;
  problemStatus: boolean;
  solution: string;
  solutionStatus: boolean;
  descriptionOfSolution: string;
  descriptionStatus: boolean;
  howAddressesChallenge: string;
  howAddressesStatus: boolean;
  mainChallengesOrRisks: string;
  mainChallengesStatus: boolean;
  inChallenge: Challenge;
  inChallengeStatus: boolean;
  challengeOpt1: Challenge;
  challengeOpt2: Challenge;
  fundingStatus: FundingStatus;
  relevantExperience: string;
  relevantExperienceStatus: boolean;
  repo: string;
  repoStatus: boolean;
  isTemplate: boolean;
  detailedPlan: string;
  detailedPlanStatus: boolean;
  detailedBudget: string;
  detailedBudgetStatus: boolean;
  teamRequired: string;
  teamStatus: boolean;
  continuationOrNew: string;
  sDGRating: string;
  sDGStatus: boolean;
  requestedFunds: number;
  requestedFundsStatus: boolean;
  describedByInterests: Interest[];
  proposedBy: User;
  attachments: Attachment[];
  status: ProposalStatus;
  relatedContracts: Contract[];
  relatedTasks: Task[];
  ratings: ProposalRating[];
  readings: Reading[];
  step: number;
}

export interface Contact {
  type: string;
  contact: string;
  id?: string;
}

export interface Timezone {
  name: string;
  id: string;
}

export interface Language {
  id: string;
  name: string;
}

export interface Preference {
  id: string;
  type?: string;
}
export interface User {
  id: string;
  labels: string[];
  username: string;
  email: string;
  picurl: string;
  proposals: Proposal[];
  interestedIn: Interest[];
  profile: string;
  bio: string;
  URLs: string[];
  contacts: Contact[];
  inZone: Timezone;
  languages: Language[];
  roles: Role[];
  preferences: Preference[];
  referralUrl: string | null;
}

export interface Role {
  id: string;
  name: string;
}

export interface Contract {
  id: string;
  terms: string;
  paymentType: string;
  paymentAmount: number;
  relatedProposal: Proposal;
  relatedTask: Task;
  mentor: User;
  proposer: User;
  collaborator: User;
  status: string;
  date: DateTime;
  isMentorApprover: boolean;
  dateMentorSigned: DateTime;
  dateProposerSigned: DateTime;
}

export interface CheckboxOptions {
  type?: string;
  name?: string;
  id: string;
}
export interface Interest {
  id: string;
  name: string;
}
export interface Skill {
  id: string;
  name: string;
}

export interface MessageSendEdge {
  on: string; //ISO Datetime
  node: User;
}

export interface MessageSendConnection {
  edges: MessageSendEdge[];
}

export interface Message {
  sentByConnection: MessageSendConnection;
  sentBy: User;
  sentToConnection: MessageSendConnection;
  sentTo: User;
  text: string;
  on: any; // datetime ISO
}

export interface Step {
  target: string;
  content: string;
  title?: string;
}
