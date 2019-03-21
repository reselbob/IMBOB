'use strict';
const {request} = require('graphql-request');
const _ = require('lodash');
const expect = require('chai').expect;
const describe = require('mocha').describe;
const before = require('mocha').before;
const it = require('mocha').it;
const {server} = require('../server');
const faker = require('faker');

const {getCollection, updateCollection, getItemFromCollection} = require('../data/index');

const ws = require('ws');
const {WebSocketLink} = require("apollo-link-ws");
const {execute} = require("apollo-link");
const {SubscriptionClient} = require('subscriptions-transport-ws');
const gql = require('graphql-tag');

const serverConfig = {serverUrl: 'http://localhost:4000/', subscriptionUrl: 'ws://localhost:4000/graphql'};

let client;
let link;

before(() => {
    client = new SubscriptionClient(serverConfig.subscriptionUrl, {
        reconnect: true
    }, ws);
    link = new WebSocketLink(client);
});

after(() => {
    link.subscriptionClient.close();
    server.stop();
});

describe('GraphQL Subscription Tests', () => {
/*
This test sends a payload via the mutiation, ping and
asserts the the payload submitted in the mutation shows
up in event to which the test is subscribed
 */
    it('Can ping and subscribe',  (done) => {
        let payload = faker.lorem.words(3);
        const operation = {
            query: gql`
                subscription eventAdded{
                    eventAdded{
                        id
                        name
                        payload
                        createdAt
                        storedAt
                    }
                }`
        };

        execute(link, operation).subscribe({
            next: data => {
                console.log(`received data: ${JSON.stringify(data, null, 2)}`);
                expect(data.data.eventAdded.payload).to.equal(payload);
                done();
            },
            error: error => console.log(`received error ${error}`),
            complete: () => console.log(`complete`),
        });

        const query = `mutation{
                  ping(payload: "${payload}"){
                    createdAt
                    payload
                    name
                    id
                  }
                }`;
        request(serverConfig.serverUrl, query)
            .then(data =>{
                expect(data).to.be.an('object');
            });
    });
});