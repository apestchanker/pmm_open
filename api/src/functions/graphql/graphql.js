// This module can be used to serve the GraphQL endpoint
// as a lambda function
const { ApolloServer } = require('apollo-server-lambda')

const { makeAugmentedSchema } = require('neo4j-graphql-js')
//import { Neo4jGraphQL } from '@neo4j/graphql'

const neo4j = require('neo4j-driver')

// This module is copied during the build step
// Be sure to run `npm run build`
const { typeDefs } = require('./graphql-schema')

const driver = neo4j.driver(
  process.env.NEO4J_URI || 'bolt://localhost:7687',
  neo4j.auth.basic(
    process.env.NEO4J_USER || 'neo4j',
    process.env.NEO4J_PASSWORD || 'neo4j'
  )
)

//const neoSchema = new Neo4jGraphQL({ typeDefs, driver })
const server = new ApolloServer({
  context: ({event, context}) => { 
      let req=event;
    return {driver, req} 
  },
  introspection: process.env.NODE_ENV !== 'production',
  schema: makeAugmentedSchema({ typeDefs, config: {
    auth: {
      isAuthenticated: true
    },
    experimental: true,
    },
  }),
  //schema: neoSchema.schema,
  cors: {
    origin: ["*", "http://localhost:3000"]},
})

exports.handler = server.createHandler()
