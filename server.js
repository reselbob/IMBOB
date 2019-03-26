const { ApolloServer} = require('apollo-server');
const {initGlobalDataSync} = require('./data');
const typeDefs = require('./graphql/typedefs');
const resolvers = require('./graphql/resolvers');
const subscriptions = require('./graphql/subscriptions');
const { AuthenticationError } = require("apollo-server");
const config = require('./config');

const PORT = process.env.PORT || 4000;

// The ApolloServer is started by creating a schema and
// passing to that schema type definitions (typeDefs),
// the resolvers that fetch the data for those types,
// and the subscription event methods.
const schema = {
    typeDefs,
    resolvers,
    subscriptions,
    context: ({ req, res }) => {
        if(req){ // queries will come through as a request
            const token = req.headers.authorization || 'NO_TOKEN';
            if(token !== config.ACCESS_TOKEN){
                throw new AuthenticationError('Invalid Access Token');
            }
            console.log(token);
        }

    },};

//intialize the collections globally by calling getCollection
//to load the evironment variaibles
initGlobalDataSync();

const server = new ApolloServer(schema);
// This `listen` method launches a web-server and a
// subscription server
server.listen(PORT).then(({ url, subscriptionsUrl }) => {
    process.env.SERVER_CONFIG = JSON.stringify({serverUrl: url, subscriptionsUrl});
    console.log(`🚀  Server ready at ${url}`);
    console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`)
});

//Export the server to make it available to unit
// and API tests
module.exports = {server};