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
        firstName: String!
        lastName: String!
        dob: String!
    }
    
    input KnownPersonInput{
        id: ID!
        firstName: String!
        lastName: String!
        dob: String!
    }
    
    type Movie {
        id: ID!
        title: String
        releaseDate: String
        directors: [Person]
        actors: [Person]
    }
    
   input MovieInput {
        title: String!
        releaseDate: String!
        directors: [KnownPersonInput]
        actors: [KnownPersonInput]
    }
    
       input KnownMovieInput {
        id: ID!
        title: String!
        releaseDate: String!
        directors: [KnownPersonInput]
        actors: [KnownPersonInput]
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
        subject: KnownPersonInput
        predicate: Predicate
        object: KnownPersonInput
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
        person(id: ID!): Person
        movies: [Movie]
        movie(id: ID!): Movie
        triples: [Triple]
        triplesByPredicate (predicate: Predicate!): [Triple]
    }
    
    type Mutation {
        ping(payload: String!): Event
        addMovie(movie: MovieInput!): Movie
        updateMovie(movie: KnownMovieInput): Movie
        addTriple(triple: TripleInput): Triple
        addPerson(person: PersonInput): Person
    }
    
    type Subscription {
        eventAdded(topicName: String): Event
    }
`;
