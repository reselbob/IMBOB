module.exports = `  

    """
    The directive instructs the API to implement the runtime administration behavior
    should the query or mutation support have a particular administrative behavior,
    otherwise, it's ignored
    """
    directive @isAdmin on FIELD
    
    scalar Date
  
  """
  The interface, Personable describes the fields that
  must be supported by all types describing a person
  """
    interface Personable {
        id: ID
        firstName: String
        lastName: String
        dob: Date
    }
   
    """
    The type, Person describes a person in the system. It is
    an implementation of the interface, Personable
    """
    type Person implements Personable{
        id: ID
        firstName: String
        lastName: String
        dob: Date
  
    }
    
    """
    The type, Actor describes an actor in a movie.
    The type implements the interface, Personable yet
    adds the field role, which is a collection of Role
    types
    """
    type Actor implements Personable{
        id: ID
        firstName: String
        lastName: String
        dob: Date
        roles: [Role]
    }
    
    extend type Person {
        """ A list of Person types that this Person is MARRIED_TO, not pageable """
        marriedToConnection: [Person]
        
        """ A list of Person types that this Person is DIVORCED_FROM, not pageable """
        divorcedFromConnection: [Person]
        
        """ A pageable list of Person types that this Person KNOWS """
        knowsConnection(paginationSpec: CursorPaginationInput): PersonConnection
        
        """ A pageable list of Person types that this Person LIKES """
        likesConnection(paginationSpec: CursorPaginationInput): PersonConnection    
    }
    
   type Role {
     """ The full or partial name of a character in the associated movie"""
     character: String!
     """ The movie is which the role appeared """
     movie: Movieable
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
        genre: Genre
        directors: [Person]
        actors: [Actor]
    }   
    
    input MovieInput{
        title: String!
        releaseDate: Date!
        genre: Genre
        directors: [KnownPersonInput]
        actors: [ActorInput]
    }
    input KnownMovieInput{
        id: ID!
        title: String
        releaseDate: Date
        genre: Genre
        directors: [KnownPersonInput]
        actors: [ActorInput]
    }
    
    type Movie  implements Movieable{
        id: ID!
        title: String
        releaseDate: Date
        genre: Genre
        directors: [Person]
        actors: [Actor]
    }
    
    type Cartoon  implements Movieable{
        id: ID!
        title: String
        releaseDate: Date
        genre: Genre
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
    
    enum Genre {
        DRAMA
        COMEDY
        HORROR
        OTHER
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
    Event is a custom type that describes messages emitted
    from a subscription within the IMBOB API.
    """
    type Event {
        """This system assigned unique identifier"""
        id: ID
        """The event name, supported event names are:
         PERSON_EVENT_TYPE_ADD,
         PERSON_EVENT_TYPE_UPDATE,
         MOVIE_EVENT_TYPE_ADD,
         MOVIE_EVENT_TYPE_UPDATE,
         TRIPLE_EVENT_TYPE_ADD,
         TRIPE_EVENT_TYPE_UPDATE Please note that naming an event is a technique
         that is special to IMBOB
         """
        name: String
        """The time when the event was created"""
        createdAt: Date
        """The time when the event was saved in the datastore"""
        storedAt: Date
        """Information that is special to the particular event"""
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
        """
        onMovieAdded is a subscription that emits messages when a movie is added to the system.
        Supported Channels: MOVIE_CHANNEL, HORROR_MOVIE_CHANNEL, DRAMA_MOVIE_CHANNEL, COMEDY_MOVIE_CHANNEL"""
        onMovieAdded(channelName: String): Event
        onTripleAdded(channelName: String): Event
        onPersonUpdated(channelName: String): Event
        """Supported Channels: MOVIE_CHANNEL, HORROR_MOVIE_CHANNEL, DRAMA_MOVIE_CHANNEL, COMEDY_MOVIE_CHANNEL"""
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
