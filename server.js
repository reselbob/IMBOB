const { ApolloServer} = require('apollo-server');
const typeDefs = require('./graphql/typedefs');
const resolvers = require('./graphql/resolvers');
const subscriptions = require('./graphql/subscriptions');

const PORT = process.env.PORT || 4000;

// The ApolloServer is started by creating a schema and
// passing to that schema type definitions (typeDefs),
// the resolvers that fetch the data for those types,
// and the subscription event methods.
const schema = {
    typeDefs,
    resolvers,
    subscriptions};

const server = new ApolloServer(schema);

// This `listen` method launches a web-server and a
// subscription server
server.listen(PORT).then(({ url, subscriptionsUrl }) => {
    console.log(`🚀  Server ready at ${url}`);
    console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`)
});

//Export the server to make it available to unit
// and API tests
module.exports = server;