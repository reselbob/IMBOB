const _ = require('lodash');
const {PubSub} = require('apollo-server');
const uuidv4 = require('uuid/v4');
const {getCollection, updateCollection, getItemFromCollection} = require('../data/index');

const pubsub = new PubSub();
const EVENT_ADDED = 'EVENT_ADDED';

const publishEvent = async (eventName, payload) => {
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


const extractPredicateObjects = async (firstName, lastName, predicateValue) => {
    const triples = getCollection('triples');
    const arr = _.filter(triples, {subject: {firstName: firstName, lastName: lastName,}, predicate: predicateValue});

    const rslt = [];
    for (let i = 0; i < arr.length; i++) {
        //add the time stamp from the parent
        arr[i].object.createdAt = arr[i].createdAt;
        rslt.push(arr[i].object);
    }
    return rslt;
};

const getExtendedPaginationSpec = (arr, pageinationSpec) =>{
    let idxs = [0];
    let start = 0;
    let end = 9;
    const defaultReturnCount = 10;

    if(pageinationSpec){
        //error out, if there is a before and after
        if(pageinationSpec.after && pageinationSpec.before) {
            const msg = `Before and After Cursor Pagination Configuration Error. Before: ${pageinationSpec.before}, After: ${pageinationSpec.after}`;
            throw new Error(msg);
        }
        //Make pageinationSpec.after the default
        if(!pageinationSpec.after && !pageinationSpec.before){
            pageinationSpec.after = arr[0].id;
        }

        if(pageinationSpec.after){
            idxs = _.keys(_.pickBy(arr, {id: pageinationSpec.after}));
            //don't reset if the item in question is at position zero
            if(idxs[0] > 0){
                start = Number.parseInt(idxs[0]) + 1;
            }
            const cnt = pageinationSpec.first || defaultReturnCount;
            end = start + cnt;
        }
        if(pageinationSpec.before) {
            idxs = _.keys(_.pickBy(arr, {id: pageinationSpec.before}));
            start = Number.parseInt(idxs[0]);
            if(pageinationSpec.last) {
                end = start - pageinationSpec.last;
            }
        }
    }
    pageinationSpec.startPos = start;
    pageinationSpec.endPos = end;
    _.orderBy(arr, [pageinationSpec.sortFieldName]);

    //return the sorted data and the extended paginationSpec
    return {data: arr, idxs, pageinationSpec};
};

const  convertArrayToPersons = async (arr, pageinationSpec) => {
    const pageData = getExtendedPaginationSpec(arr, pageinationSpec);
    const start = pageData.pageinationSpec.startPos;
    const end = pageData.pageinationSpec.endPos;
    //const edges = [];
    const range = [start, end].sort((a, b)=>{return a-b}); // regardless of before or after, range needs descending

    let bufferArr = pageData.data.slice(range[0],range[1]);
    if(bufferArr.length){

        let endCursor  = bufferArr[bufferArr.length - 1].id; //the default
        let hasNextPage = Number.parseInt(pageData.idxs[0]) + 2 <= pageData.data.length; //default
        if(pageinationSpec.after){
            endCursor = bufferArr[bufferArr.length - 1].id;
            pageData.idxs = _.keys(_.pickBy(pageData.data, {id: endCursor}));
            hasNextPage = Number.parseInt(pageData.idxs[0]) + 2 <= pageData.data.length;
        };

        if(pageinationSpec.before){
            bufferArr.reverse();
            endCursor = bufferArr[0].id;
            pageData.idxs = _.keys(_.pickBy(pageData.data, {id: endCursor}));
            hasNextPage = Number.parseInt(pageData.idxs[0]) + 2 >= 0;
        };
        const pageInfo = {endCursor, hasNextPage};
        return {collection: bufferArr, pageInfo}
    }
};

const  convertArrayToConnection = async (arr, pageinationSpec) => {
    const pageData = getExtendedPaginationSpec(arr, pageinationSpec);
    const start = pageData.pageinationSpec.startPos;
    const end = pageData.pageinationSpec.endPos;
    const edges = [];
    const range = [start, end].sort(); // regardless of before or after, range needs descending

    let bufferArr = pageData.data.slice(range[0],range[1]);
    bufferArr.forEach(a => {
        edges.push({cursor: a.id, node: a})
    });
    if(edges.length){

        let endCursor  = edges[edges.length - 1].cursor; //the default
        let hasNextPage = Number.parseInt(pageData.idxs[0]) + 2 <= pageData.data.length; //default
        if(pageinationSpec.after){
            endCursor = edges[edges.length - 1].cursor;
            pageData.idxs = _.keys(_.pickBy(pageData.data, {id: endCursor}));
            hasNextPage = Number.parseInt(pageData.idxs[0]) + 2 <= pageData.data.length;
        };

        if(pageinationSpec.before){
            edges.reverse();
            endCursor = edges[0].cursor;
            pageData.idxs = _.keys(_.pickBy(pageData.data, {id: endCursor}));
            hasNextPage = Number.parseInt(pageData.idxs[0]) + 2 >= 0;
        };
        const pageInfo = {endCursor, hasNextPage};
        return {edges, pageInfo}
    }
};

const setPaginationSortOrderDefault = (paginationSpec, defaultSortFieldName) => {
    if(!paginationSpec) paginationSpec = {};
    if(!paginationSpec.sortFieldName) paginationSpec.sortFieldName = 'lastName';
    return paginationSpec;
};

module.exports = {
    Query: {
        persons: async (parent, args, context) => {
            const arr = getCollection('persons');

            if(arr.length > 0){
                args.paginationSpec = setPaginationSortOrderDefault(args.paginationSpec, 'lastName');
                return await convertArrayToPersons(arr, args.paginationSpec);
            }
        },
        person: (parent, args, context) => _.find(getCollection('persons'), {'id': args.id}),
        actor: (parent, args, context) => {
            const mvs = _.filter(getCollection('movies'),
                {
                    actors: [{id: args.id}]
                }
            );
            const a = _.filter(mvs[0].actors, {id: args.id})[0];
            a.roles = [];
            mvs.forEach(m => {
                const r = {};
                r.character = _.find(m.actors, {id: args.id}).role;
                r.movie = m;
                a.roles.push(r);
            });
            return a;
        },
        movies: (parent, args, context) => getCollection('movies'),
        movie: (parent, args, context) => getItemFromCollection("MOVIES", args, id),
        triples: (parent, args, context) => getCollection('triples'),
        triplesByPredicate: (parent, args, context) => {
            const arr = _.filter(getCollection('triples'), {'predicate': args.predicate});
            return arr;
        }
    },

    Personable: {
        __resolveType(obj, context, info) {
            if (obj.roles) {
                return 'Actor';
            } else {
                return 'Person'
            }
        }
    },
    Movieable: {
        __resolveType(obj, context, info) {
            if (obj.animators) {
                return 'Cartoon';
            } else {
                return 'Movie'
            }
        }
    },
    Person: {
        likesConnection: async (parent, args, context, info) => {
            const arr = await extractPredicateObjects(parent.firstName, parent.lastName, "LIKES");
            args.paginationSpec = setPaginationSortOrderDefault(args.paginationSpec, 'createdAt');
            if(arr.length > 0) return await convertArrayToConnection(arr, args.paginationSpec);
        },
        knowsConnection: async (parent, args, context, info) => {
            const arr = await extractPredicateObjects(parent.firstName, parent.lastName, "KNOWS");
            args.paginationSpec = setPaginationSortOrderDefault(args.paginationSpec, 'createdAt');
            if(arr.length > 0) return await convertArrayToConnection(arr,args.paginationSpec);
        },
        marriedToConnection: async (parent, args, context, info) => {
            return await extractPredicateObjects(parent.firstName, parent.lastName, "MARRIED_TO");
        },
        divorcedFromConnection: async (parent, args, context, info) => {
            return await extractPredicateObjects(parent.firstName, parent.lastName, "DIVORCED_FROM");
        }
    },
    Mutation: {
        ping: async (parent, args) => {
            const event = await publishEvent('PING', args.payload);
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
            if (args.movie.title) movie.title = args.movie.title;

            //if there's a new release date, add the new release date
            if (args.movie.releaseDate) movie.releaseDate = args.movie.releaseDate;

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
            const data = await updateCollection(args.triple, 'TRIPLES');
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