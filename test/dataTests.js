'use strict';
const _ = require('lodash');
const expect = require('chai').expect;
const describe = require('mocha').describe;
const before = require('mocha').before;
const it = require('mocha').it;
const helper = require('../data/json/fileHelper');
const {persons, movies, triples, updateCollection,replaceCollection} = require('../data/index');
const {convertIntIdToGuid, guidTriples} = require('./devHelper');
const uuidv4 = require('uuid/v4');

describe('Data Tests: ', () => {

    it('Can get valid collections', function (done) {

        try {
            expect(persons).to.be.an('array');
            expect(movies).to.be.an('array');
            expect(triples).to.be.an('array');
            done()
        } catch (e) {
            done(e)
        }
    });

    it('Can get load movies collections', function (done) {
        const data = helper.getCollection('movies');
        expect(data).to.be.an('array');
        done();
    });


    it('Can update person', function (done) {
        const obj = {};
        obj.firstName = 'Donald';
        obj.lastName = 'Sutherland';
        obj.dob = '1935-07-15';
        obj.id = uuidv4();

        updateCollection(obj, 'PERSONS').then (data =>{
            expect(data).to.be.an('object');
            done();
        }).catch(e =>{
            done(e);
        })
    });


});