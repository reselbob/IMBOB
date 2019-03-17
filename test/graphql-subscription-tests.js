'use strict';
const { ApolloClient, createNetworkInterface } = require('apollo-client');
const { SubscriptionClient, addGraphQLSubscriptions } = require('subscriptions-transport-ws');
const { HttpLink } = require( 'apollo-link-http');
const { InMemoryCache } = require('apollo-cache-inmemory');
const gql = require('graphql-tag');
const ws = require('ws');
const {request} = require('graphql-request');
const _ = require('lodash');
const expect = require('chai').expect;
const describe = require('mocha').describe;
const before = require('mocha').before;
const it = require('mocha').it;
const server = require('../server');
const url = 'http://localhost:4000/';
const subscriptionUrl = 'ws://localhost:4000';
var faker = require('faker');

const {getCollection, updateCollection, getItemFromCollection} = require('../data/index');

let apollo;
let networkInterface;



before(() => {
    networkInterface = new SubscriptionClient(
        subscriptionUrl, { reconnect: true }, ws);
    apollo = new ApolloClient({
        networkInterface ,
        link: new HttpLink({ uri: url }),
        cache: new InMemoryCache()
    });

});

after(() => {
    networkInterface.close() ;
    server.stop();
})

describe('GraphQL Subscription Tests', () => {

    it('Can ping and subscribe', async (done) => {
        const subscriptionPromise = async () => {
            const client = () => apollo;
            await client().subscribe({
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
                `
            }).subscribe({
                next: (data) => {
                    console.log(data);
                },
                error: (err)=>{
                    console.log(err);
                    done(err);
                }
            })
        };


        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();
        const dob = faker.date.between('1950-01-01', '2001-12-31').toISOString().slice(0, 10);
        const query = `mutation{
                  ping(payload: "${firstName} ${lastName} ${dob}"){
                    createdAt
                    payload
                    name
                    id
                  }
                }`;
        await request(url, query)
            .then(data => {
                console.log(data);
                //done();
            })
            .catch(e => {
                done(e)
            });
        const rslt = await subscriptionPromise();
        console.log(rslt);
        done();
    });
});