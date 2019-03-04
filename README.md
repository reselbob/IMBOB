# IMBOB
A simple GraphQL API for movie information.

To start the application:

`npm install`

then

`npm start`

or

`node server.js`

## Cheat Sheet

introspection on the API
```
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

```
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
```
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
```
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

```
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
```
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

```
mutation{
  addMovie({movie: {title: "NOVIE_TITLE", releaseDate: "YYYY-MM-DD"}}){
    id
    title
    releaseDate
  }
}
```

Paginated Person:
```

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
}}
```