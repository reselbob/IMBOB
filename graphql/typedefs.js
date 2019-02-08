module.exports = `
    type Person {
        id: Int
        firstName: String
        lastName: String
        dob: String
    }
    
    type Movie {
        id: Int
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
        id: String
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
`;
