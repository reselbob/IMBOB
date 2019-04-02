module.exports = `  

    scalar Date
  
    """
    The type that describes a person. All persons must exist
    in the system. For example, to a triple uses a person that exists
    in the system. The input type that describes a person in the system
    in called a KnownPersonInput
    """
    
    interface Personable {
        id: ID
        firstName: String
        lastName: String
        dob: Date
    }
   

    type Person implements Personable{
        id: ID
        firstName: String
        lastName: String
        dob: Date
  
    }
    
    extend type Person {
        """
        A list of Person types that this Person is MARRIED_TO, not pageable
        """
        marriedToConnection: [Person]
        """
        A list of Person types that this Person is DIVORCED_FROM, not pageable
        """
        divorcedFromConnection: [Person]
        """
        A pageable list of Person types that this Person KNOWS
        """
        knowsConnection(paginationSpec: CursorPaginationInput): PersonConnection
        """
        A pageable list of Person types that this Person LIKES
        """
        likesConnection(paginationSpec: CursorPaginationInput): PersonConnection    
    }
    
   type Role {
     """ The full or partial name of a character in the associated movie"""
     character: String!
     """ The movie is which the role appeared """
     movie: Movieable
   }
    
    type Actor implements Personable{
        id: ID
        firstName: String
        lastName: String
        dob: Date
        roles: [Role]
    }
    
     input ActorInput{
        id: ID! #use the ID of an existing person
        firstName: String!
        lastName: String!
        dob: Date!
        role: String!
    }
    
    union PersonActorSearch = Person | Actor
    
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
    
    interface Movieable {
        id: ID!
        title: String
        releaseDate: Date
        directors: [Person]
        actors: [Actor]
    }   
    
    input MovieInput{
        title: String
        releaseDate: Date
        directors: [KnownPersonInput]
        actors: [ActorInput]
    }
    input KnownMovieInput{
        id: ID!
        title: String
        releaseDate: Date
        directors: [KnownPersonInput]
        actors: [ActorInput]
    }
    
    type Movie  implements Movieable{
        id: ID!
        title: String
        releaseDate: Date
        directors: [Person]
        actors: [Actor]
    }
    
    type Cartoon  implements Movieable{
        id: ID!
        title: String
        releaseDate: Date
        directors: [Person]
        actors: [Actor]
        animators: [Person]
    }
    
      
    enum Predicate {
        KNOWS
        LIKES
        WORKED_WITH
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
    """
    Event is a type that describes messages emitted
    from a subscription.
    """
    type Event {
        """This system assigned ID"""
        id: ID
        """The event name, e.g PERSON_EVENT_TYPE_ADD"""
        name: String
        """The time when the event was created"""
        createdAt: Date
        """The time when the event was saved in the datastore"""
        storedAt: Date
        """Information that is special the to particular event"""
        payload: String
    }

    type Query {
        persons (paginationSpec: CursorPaginationInput): Persons
        person(id: ID!): Person
        actor(id: ID!): Actor
        actors: [Actor]
        movies: [Movie]
        movie(id: ID!): Movie
        triples: [Triple]
        triplesByPredicate (predicate: Predicate!): [Triple]
        getPersonActor(lastName: String!): [PersonActorSearch]
        searchPerson(paginationSpec: CursorPaginationInput, firstName: String!, lastName: String!): Persons
    }
    
    type Mutation {
    """
    Ping is a utility mutation for testing event generation
    in a subscription. When a client executes Ping that data
    is published to the subscription, eventAdded,
    on the channel, GENERAL_EVENT_CHANNEL.
    
    The string value assigned to the query parameter,
    payLoad will be recycled into Event.payload of the
    subsciption message published.
    """
        ping(payload: String!): Event
        addMovie(movie: MovieInput!): Movie
        updateMovie(movie: KnownMovieInput): Movie
        addTriple(triple: TripleInput): Triple
        addPerson(person: PersonInput): Person
    }
    
    type Subscription {
        eventAdded(channelName: String): Event
        onPersonAdded(channelName: String): Event
        onMovieAdded(channelName: String): Event
        onTripleAdded(channelName: String): Event
        onPersonUpdated(channelName: String): Event
        onMovieUpdated(channelName: String): Event
        onTripleUpdated(channelName: String): Event
    }
    """
    Cursor types
    """
    input CursorPaginationInput{
        before: String
        first: Int
        last: Int
        after: String
        sortFieldName: String
    }
    
    """
    Connections and Edges
    """
    
    type PersonEdge {
        cursor: String!
        node: Person!
    }
    
    type Persons {
        collection: [Person]
        pageInfo: PageInfo!
    }
    
    type PersonConnection {
        edges: [PersonEdge]
        pageInfo: PageInfo!
    }
    
    type PageInfo {
        endCursor: String
        hasNextPage: Boolean
     }
`;
