const _ = require('lodash');
const { PubSub } = require('apollo-server');
const uuidv4 = require('uuid/v4');
const {persons, movies, triples} = require('../data/index');

const pubsub = new PubSub();
const EVENT_ADDED = 'EVENT_ADDED';


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
    Mutation: {
        ping: async (parent, args) => {
            const dt = new Date();
            const uuid = uuidv4();

            const event = {
                id: uuid,
                name: 'PING',
                createdAt:  dt.toString(),
                storedAt: dt.toString(),
                payload: args.payload
            }
            await pubsub.publish(EVENT_ADDED, {eventAdded: event});
            console.log(event);
            return event;
        },
        updateMovie: async (parent, args) => {
            console.log(args.movie)
        }
    },

    Subscription: {
        eventAdded: {
            subscribe: () => pubsub.asyncIterator(EVENT_ADDED)
        }
    }
};