'use strict';
const _ = require('lodash');
const expect = require('chai').expect;
const describe = require('mocha').describe;
const before = require('mocha').before;
const it = require('mocha').it;
const helper = require('../data/json/fileHelper');


const {persons, movies, triples} = require('../data/index');

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
});