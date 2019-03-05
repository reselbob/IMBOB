'use strict';
const {request} = require('graphql-request');
const _ = require('lodash');
const expect = require('chai').expect;
const describe = require('mocha').describe;
const before = require('mocha').before;
const it = require('mocha').it;
const server = require('../server');
const url = 'http://localhost:4000/';
const uuidv4 = require('uuid/v4');
var faker = require('faker');

const {getCollection, updateCollection, getItemFromCollection} = require('../data/index');


before(() => {

});

after(() => {
    server.stop();
})

describe('GraphQL Basic Tests', () => {
    it('Can page through persons', (done) => {
        let colOne = [];
        let colTwo =[];
        let query = `{
                  persons{
                    collection{
                      firstName
                      lastName
                      knowsConnection{
                        edges{
                          node{
                            firstName
                            lastName
                          }
                        }
                      }
                    }
                    pageInfo{
                      hasNextPage
                      endCursor
                    }
                  }
                }`;
        request(url, query)
            .then(data => {
                console.log(data);
                expect(data.persons.collection.length).to.equal(10);
                colOne = data.persons.collection;
                let query = `{
                  persons(paginationSpec: {after: "${data.persons.pageInfo.endCursor}"}){
                    collection{
                      firstName
                      lastName
                      knowsConnection{
                        edges{
                          node{
                            firstName
                            lastName
                          }
                        }
                      }
                    }
                    pageInfo{
                      hasNextPage
                      endCursor
                    }
                  }
                }`;
                request(url, query)
                    .then(data =>{
                        expect(data.persons.collection.length).to.equal(10);
                        colTwo = data.persons.collection;
                        const rslt = _.intersection(colOne, colTwo);
                        expect(rslt.length).to.equal(0);
                        done();
                    });
                done();
            })
    });



    it('Movies from API length equals Movies from data length', (done) => {
        const movies = getCollection('movies');
        const query = `query { movies{ title releaseDate } }`;
        request(url, query)
            .then(data => {
                console.log(data);
                expect(movies.length).to.equal(data.movies.length);
                done();
            })
    });


    it('Can paginate likes', (done) => {
        const triples = getCollection('triples');
        const query = `query { persons{ firstName lastName } }`;
        request(url, query)
            .then(data => {
                console.log(data);
                expect(persons.length).to.equal(data.persons.length);
                done();
            })
    });

    it('Persons from API length equals Persons from data length', (done) => {
        const persons = getCollection('persons');
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
        const dob = faker.date.between('1950-01-01', '2001-12-31').toISOString().slice(0,10)
        const query = `mutation{
            addPerson(person: {firstName: "${firstName}", lastName: "${lastName}", dob: "${dob}"}){
                id
                firstName
                lastName
                dob
            }
        }`;
        request(url, query)
            .then(data => {
                console.log(data);
                const obj = data.addPerson;
                expect(obj.firstName).to.equal(firstName);
                expect(obj.lastName).to.equal(lastName);
                expect(obj.dob).to.equal(dob);
                const persons = getCollection('persons');
                const p = _.find(persons, {id:obj.id });
                console.log(process.env.PERSONS)
                expect(obj.id).to.equal(p.id);
                done();
            })
            .catch(e =>{
                done(e)
            })
    });
});