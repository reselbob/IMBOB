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
const uuidv4 = require('uuid/v4');
var faker = require('faker');


before(() => {

});

after(() => {
    server.stop();
})

describe('GraphQL Basic Tests', () => {
    it('Persons from API length equals Persons from data length', (done) => {
        const query = `query { persons{ firstName lastName } }`;
        request(url, query)
            .then(data => {
            console.log(data);
            expect(persons.length).to.equal(data.persons.length);
            done();
        })
    });

    it('Can add person via GraphQL', (done) => {
        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();
        const dob = faker.date.between('1950-01-01', '2001-12-31').toISOString().slice(0,10);
        const query = `query { persons{ firstName lastName } }`;
        done()
    });
});