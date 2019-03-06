const { ApolloServer} = require('apollo-server');
const typeDefs = require('./graphql/typedefs');
const resolvers = require('./graphql/resolvers');
const subscriptions = require('./graphql/subscriptions');

const PORT = process.env.PORT || 4000;

// The ApolloServer is started by passing
// type definitions (typeDefs), the resolvers
// responsible for fetching the data for those types
// and the subscription event methods.
const schema = {
    typeDefs,
    resolvers,
    subscriptions};

const server = new ApolloServer(schema);

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen(PORT).then(({ url, subscriptionsUrl }) => {
    console.log(`🚀  Server ready at ${url}`);
    console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`)
});

module.exports = server;