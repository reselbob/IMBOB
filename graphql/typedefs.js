module.exports = `    
    """
    The type that describes a person. All persons must exist
    in the system. For example, to a triple uses a person that exists
    in the system. The input type that describes a person in the system
    in called a KnownPersonInput
    """
    type Person {
        id: ID
        firstName: String
        lastName: String
        dob: String
        knowsCollection: [Person]
        likesCollection: [Person]
        marriedToCollection: [Person]
        divorcedFromCollection: [Person]
    }
    
    """
    The input type for a person
    """
    input PersonInput{
        firstName: String!
        lastName: String!
        dob: String!
    }
    
    """
    The input type that describes a person that is known in the
    system. A known person has a system assigned ID.
    """
    input KnownPersonInput{
        id: ID!
        firstName: String!
        lastName: String!
        dob: String!
    }
    
    interface Film {
        id: ID!
        title: String
        releaseDate: String
        directors: [Person]
        actors: [Person]
    }   
    
    type Movie  implements Film{
        id: ID!
        title: String
        releaseDate: String
        directors: [Person]
        actors: [Person]
    }
    
    type Cartoon  implements Film{
        id: ID!
        title: String
        releaseDate: String
        directors: [Person]
        actors: [Person]
        animators: [Person]
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
