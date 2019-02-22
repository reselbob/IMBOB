const _ = require('lodash');
const {PubSub} = require('apollo-server');
const uuidv4 = require('uuid/v4');
const {persons, movies, triples, updateCollection, getItemFromCollection} = require('../data/index');

const pubsub = new PubSub();
const EVENT_ADDED = 'EVENT_ADDED';

const publishEvent = async (eventName, payload) =>{
    const dt = new Date();
    const uuid = uuidv4();
    const event = {
        id: uuid,
        name: eventName,
        createdAt: dt.toString(),
        storedAt: dt.toString(),
        payload: payload
    };
    await pubsub.publish(EVENT_ADDED, {eventAdded: event});
    return event;
};


const extractPredicateObjects = (firstName, lastName, predicateValue) => {
    const arr = _.filter(triples, {subject: {firstName: firstName, lastName: lastName,}, predicate: predicateValue});

    const rslt = [];
    for (let i = 0; i < arr.length; i++) {
        rslt.push(arr[i].object);
    }
    return rslt;
}

module.exports = {
    Query: {
        persons: (parent, args, context) => _.sortBy(persons, ['lastName']),
        person: (parent, args, context) => _.find(persons, {'id': args.id}),
        movies: (parent, args, context) => movies,
        movie: (parent, args, context) => getItemFromCollection("MOVIES", args,id),
        triples: (parent, args, context) => triples,
        triplesByPredicate: (parent, args, context) => {
            const arr = _.filter(triples, {'predicate': args.predicate});
            return arr;
        }
    },

    Personable: {
        __resolveType(obj, context, info){
            if(obj.roles){
                return 'Actor';
            }else{
                return 'Person'
            }
        }
    },
    Movieable: {
        __resolveType(obj, context, info){
            if(obj.animators){
                return 'Cartoon';
            }else{
                return 'Movie'
            }
        }
    },
    Person: {
        likesCollection: (parent, args, context, info) => {
            return extractPredicateObjects(parent.firstName, parent.lastName, "LIKES");

        },
       knowsCollection: (parent, args, context, info) => {
            return extractPredicateObjects(parent.firstName, parent.lastName, "KNOWS");
        },
        marriedToCollection: (parent, args, context, info) => {
            return extractPredicateObjects(parent.firstName, parent.lastName, "MARRIED_TO");
        },
        divorcedFromCollection: (parent, args, context, info) => {
            return extractPredicateObjects(parent.firstName, parent.lastName, "DIVORCED_FROM");
        }
    },
    Mutation: {
        ping: async (parent, args) => {
            const event = await publishEvent('PING',args.payload);
            console.log(event);
            return event;
        },
        addMovie: async (parent, args) => {
            args.movie.id = uuidv4();
            console.log(args.movie);
            const movie = await updateCollection(args.movie, 'MOVIES');
            const event = await publishEvent('MOVIE_ADDED', JSON.stringify(movie));
            console.log(event);
            console.log(movie);
            return movie;

        },
        updateMovie: async (parent, args) => {
            //get the movie
            const movie = getItemFromCollection('MOVIES', args.movie.id);

            //if there is a title, add the new title
            if(args.movie.title) movie.title = args.movie.title;

            //if there's a new release date, add the new release date
            if(args.movie.releaseDate) movie.releaseDate = args.movie.releaseDate;

            //diff the directors and add only the added director
            const d = _.differenceWith(args.movie.directors, movie.directors, _.isEqual);
            const dirs = _.union(movie.directors, d);
            movie.directors = dirs;

            //diff the actors and add only the
            const a = _.differenceWith(args.movie.actors, movie.actors, _.isEqual);
            const actors = _.union(movie.actors, a);
            movie.actors = actors;

            await updateCollection(movie, "MOVIES");
            const m = getItemFromCollection("MOVIES", movie.id);

            const event = await publishEvent('MOVIE_UPDATED', JSON.stringify(m));
            console.log(event);
            console.log(m);
            return m;
        },
        addPerson: async (parent, args) => {
            //Create a unique identifier
            args.person.id = uuidv4();
            //add the person to the Persons collection
            const data = await updateCollection(args.person, 'PERSONS');
            //Emit a pubsub event informing subscribers
            const event = await publishEvent('PERSON_ADDED', JSON.stringify(args.person));
            //log relevant data
            console.log(event);
            console.log(data);
            //return the value from the updateCollection method
            return data;
        },
        addTriple: async (parent, args) => {
            const data =  await updateCollection(args.triple, 'TRIPLES');
            const event = await publishEvent('TRIPLE_ADDED', JSON.stringify(args.triple));
            console.log(event);
            console.log(data);
            return data;
        }
    },

    Subscription: {
        eventAdded: {
            subscribe: () => pubsub.asyncIterator(EVENT_ADDED)
        }
    }
};