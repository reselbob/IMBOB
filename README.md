# IMBOB
A simple GraphQL API for movie information.

## Installation and Start Up

To start the application:

`npm install`

then

`npm start`

or

`node server.js`

## Purpose of Project
This project is a GraphQL API service that's intended to demonstrate the basic concepts and techniques required to publish an API using Apollo Server.

The scenario illustrated by the project is based on an object graph the contains Movies, Actors, Persons. The graph also describes the connections between Persons.

![Project Graph](docs/images/basic-graph.png "Project Graph")

The project code shows readers how to implement a GraphQL schema that includes typedefs, resolvers and subscriptions. The API published by this projects supports [Queries and Mutations](https://graphql.org/learn/queries/). Also, the project supports event messaging by way of a subscription server that gets invoked as part of the overall server startup.




## Cheat Sheet

introspection on the API
```graphql
{  __schema {
    types {
      name
      fields {
        name
      }
    }
  }
}
```


subscription registered at http://localhost:4000/graphql

```graphql
subscription eventAdded{
  eventAdded{
    id
    name
    payload
    createdAt
    storedAt
  }
}
```

mutation executed at http://localhost:4000/
```graphql
mutation{
  ping(payload: "Hi There"){
    createdAt
    payload
    name
    id
  }
}
```

mutation response
```json
{
  "data": {
    "ping": {
      "createdAt": "Wed Feb 13 2019 19:54:00 GMT-0800 (Pacific Standard Time)",
      "payload": "Hi There",
      "name": "PING",
      "id": "0316cd51-abcc-4e1a-94a7-e81a1e0010d6"
    }
  }
}
```

```graphql
mutation{
  addPerson(person: {firstName: "A_FIRST_NAME", lastName: "A_LAST_NAME", dob: "YYYY-MM_DD"}){
    id
    firstName
    lastName
    dob
  }
}
```

subscription response
```json
{
  "data": {
    "eventAdded": {
      "id": "0316cd51-abcc-4e1a-94a7-e81a1e0010d6",
      "name": "PING",
      "payload": "Hi There",
      "createdAt": "Wed Feb 13 2019 19:54:00 GMT-0800 (Pacific Standard Time)",
      "storedAt": "Wed Feb 13 2019 19:54:00 GMT-0800 (Pacific Standard Time)"
    }
  }
}
```

```graphql
mutation{
  addMovie({movie: {title: "NOVIE_TITLE", releaseDate: "YYYY-MM-DD"}}){
    id
    title
    releaseDate
  }
}
```

Paginated Person:
```graphql

{
  person(id:"fee6bad2-7fd2-4bf6-beab-82603062a1ab"){
    firstName
    lastName
    likesConnection(paginationSpec:{first:5}){
      pageInfo{
        endCursor
        hasNextPage
      }
      edges{
        node{
          firstName
          lastName
        }
      }
    }
  }
}
```
Paginated LikesConnection on Persons
```graphql

{persons{
  firstName
  lastName
  likesConnection(paginationSpec:{first:5}){
    pageInfo{
      hasNextPage
      endCursor
    }
    edges{
      node{
        firstName
        lastName
      }
    }
  }
 }
}
```