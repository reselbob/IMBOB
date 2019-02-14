module.exports = `
    type Person {
       id: ID
        firstName: String
        lastName: String
        dob: String
        knows: [Person]
        likes: [Person]
        marriedTo: [Person]
        divorcedFrom: [Person]
    }
    
    type Movie {
        id: ID
        title: String
        releaseDate: String
        directors: [Person]
        actors: [Person]
    }
    
    enum Predicate {
        KNOWS
        LIKES
        MARRIED_TO
        DIVORCED_FROM
    }
    
    type Triple {
        subject: Person
        predicate: Predicate
        object: Person
    }
    
    type Event {
        id: ID
        name: String
        createdAt: String
        storedAt: String
        payload: String
    }

    type Query {
        persons: [Person]
        person(id: String!): Person
        movies: [Movie]
        movie(id: Int!): Movie
        triples: [Triple]
        triplesByPredicate (predicate: Predicate!): [Triple]
    }
    
    type Mutation {
        ping(payload: String!): Event
    }
    
    type Subscription {
        eventAdded(topicName: String): Event
    }
`;
