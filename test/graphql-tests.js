'use strict';
const {request} = require('graphql-request');
const _ = require('lodash');
const expect = require('chai').expect;
const describe = require('mocha').describe;
const before = require('mocha').before;
const it = require('mocha').it;
const {persons, movies, triples} = require('../data/index');
const server = require('../server');
const url = 'http://localhost:4000/';
//const request = require('supertest')(url);


before(() => {

});

after(() => {
    server.stop();
})

describe('GraphQL Basic Tests', () => {
    it('Persons from API length equals Persons from data length', (done) => {
        const query = `query { persons{ firstName lastName } }`
        request(url, query)
            .then(data => {
            console.log(data);
            expect(persons.length).to.equal(data.persons.length);
            done();
        })
    });
});