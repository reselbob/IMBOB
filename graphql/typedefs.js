module.exports = `    
    type Person{
        id: ID
        firstName: String
        lastName: String
        dob: String
        knows: [Person]
        likes: [Person]
        marriedTo: [Person]
        divorcedFrom: [Person]
    }
    
    input PersonInput{
        id: ID
        firstName: String
        lastName: String
        dob: String
        knows: [PersonInput]
        likes: [PersonInput]
        marriedTo: [PersonInput]
        divorcedFrom: [PersonInput]
    }
    
    type Movie {
        id: ID!
        title: String
        releaseDate: String
        directors: [Person]
        actors: [Person]
    }
    
   input MovieInput {
        id: ID
        title: String!
        releaseDate: String!
        directors: [PersonInput]
        actors: [PersonInput]
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
    
    input TripleInput {
        subject: PersonInput
        predicate: Predicate
        object: PersonInput
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
        addMovie(movie: MovieInput!): Movie
        updateMovie(movie: MovieInput): Movie
        addTriple(triple: TripleInput): Triple
        addPerson(person: PersonInput): Person
    }
    
    type Subscription {
        eventAdded(topicName: String): Event
    }
`;
