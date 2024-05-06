import { DocumentNode, ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import * as dotenv from 'dotenv';
import * as Challenge from './mutations/Challenge';
import * as FundingStatus from './mutations/FundingStatus';
import * as Interests from './mutations/Interests';
import * as Languages from './mutations/Languages';
import * as Preferences from './mutations/Preferences';
import * as ProposalStatus from './mutations/ProposalStatus';
import * as Role from './mutations/Role';
import * as Skills from './mutations/Skills';
import * as TaskStatus from './mutations/TaskStatus';
import * as Timezones from './mutations/Timezones';

import 'cross-fetch/polyfill';
import fetch from 'node-fetch';
import { AxiosError } from 'axios';

const mutations: {
  variables: Record<string, unknown>;
  mutation: DocumentNode;
}[] = [
  { ...Challenge },
  { ...FundingStatus },
  { ...Interests },
  { ...Languages },
  { ...Preferences },
  { ...ProposalStatus },
  { ...Role },
  { ...Skills },
  { ...TaskStatus },
  { ...Timezones },
];

dotenv.config();

const port = process.env.GRAPHQL_SERVER_PORT || 4001;
const path = process.env.GRAPHQL_SERVER_PATH || '/graphql';
const host = process.env.GRAPHQL_SERVER_HOST || '0.0.0.0';

const uri = `http://${host}:${port}${path}`;

const client = new ApolloClient({
  link: new HttpLink({ uri, fetch }),
  cache: new InMemoryCache(),
});
(async () => {
  for (const mut of mutations) {
    try {
      await client.mutate(mut);
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) {
        console.log(JSON.stringify(error.response, null, 2));
      } else {
        console.log(JSON.stringify(err));
      }
    }
  }
})();
