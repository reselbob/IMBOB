
const http = require('http');
const ws = require('ws');
const { ApolloClient, createNetworkInterface } = require('apollo-client');
const { SubscriptionClient, addGraphQLSubscriptions } = require('subscriptions-transport-ws');
const { createHttpLink } = require( 'apollo-link-http');
const { InMemoryCache } = require('apollo-cache-inmemory');
const fetch = require('node-fetch');
const gql = require('graphql-tag');


const serverConfig = {serverUrl:'http://localhost:4000/', subscriptionUrl:'ws://localhost:4000/graphql'};

const PORT = process.env.PORT || 4001;
let apollo;
let networkInterface;

const link = createHttpLink({ uri: serverConfig.serverUrl, fetch: fetch });
const initializeListener = () =>{
    networkInterface = new SubscriptionClient(
        serverConfig.subscriptionUrl, { reconnect: true }, ws);
    apollo = new ApolloClient({
        networkInterface ,
        link: link,
        cache: new InMemoryCache()
    });
};

const registerEvent  = async () => {
    const client = () => apollo;
    client().subscribe({
        query: gql`
            subscription eventAdded{
                eventAdded{
                    id
                    name
                    payload
                    createdAt
                    storedAt
                }
            }
        `,
        variables: {}
    }).subscribe({
        next: (data) => {
            console.log({message: 'From Default Listener', data});
        },
        error: (err)=>{
            console.log(err);
            done(err);
        }
    })
};

const shutDownListner = () =>{
    networkInterface.close() ;

}

function requestHandler(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(new Date().toString());
}

initializeListener();
registerEvent();
http.createServer(requestHandler).listen(PORT);