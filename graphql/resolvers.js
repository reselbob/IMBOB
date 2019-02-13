const {persons, movies, tripleHelpers, triples} = require('../data/index');
const _ = require('lodash');

const extractPredicateObjects = (firstName, lastName, predicateValue) => {
    const arr = _.filter(triples, {subject: {firstName: firstName, lastName: lastName, }, predicate:  predicateValue});

    //const arr =  _.filter(triples,{ 'predicate':  predicateValue});
    const rslt = [];
    for(var i=0; i < arr.length; i++) {
        rslt.push(arr[i].object);
    }
    return rslt;
}

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
    },

    Person: {
        likes:(parent,args,context,info) => {
            return extractPredicateObjects(parent.firstName, parent.lastName, "LIKES");

        },
        knows:(parent,args,context,info) => {
            return extractPredicateObjects(parent.firstName, parent.lastName,"KNOWS");
        },
        marriedTo:(parent,args,context,info) => {
            return extractPredicateObjects(parent.firstName, parent.lastName,"MARRIED_TO");
        },
        divorcedFrom:(parent,args,context,info) => {
            return extractPredicateObjects(parent.firstName, parent.lastName,"DIVORCED_FROM");
        }
    },
};