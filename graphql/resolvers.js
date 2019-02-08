const {persons, movies, tripleHelpers, triples} = require('../data/index');
const _ = require('lodash');


module.exports = {
    Query: {
        persons: (parent, args, context) => _.sortBy(persons,['lastName']),
        person: (parent, args, context) => _.filter(persons, {'id': args.id}),
        movies: (parent, args, context) => movies,
        movie: (parent, args, context) => _.find(movies, {'id': args.id}),
        triples: (parent, args, context) => triples,
        triplesByPredicate: (parent, args, context) => {
          const arr =  _.filter(triples,{ 'predicate': args.predicate});
           return arr;
        }
    }
};