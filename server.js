const { ApolloServer} = require('apollo-server');


const typeDefs = require('./graphql/typedefs');
const resolvers = require('./graphql/resolvers');
const {Query} = require('./graphql/resolvers');

const schema = {
    query: Query
}
const PORT = process.env.PORT || 4000;

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({typeDefs,
    resolvers,
    subscriptions: {
        onConnect: (connectionParams, webSocket) => {
            console.log(`Connection made , info ${JSON.stringify(connectionParams)} at ${new Date().toString()}`)
        }
    }
});

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen(PORT).then(({ url, subscriptionsUrl }) => {
    console.log(`🚀  Server ready at ${url}`);
    console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`)
});