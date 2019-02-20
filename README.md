# IMBOB
A simple GraphQL API for movie information


## Cheat Sheet

introspection
```$xslt
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
  addPerson(person: {firstName: "Charlie", lastName: "Chaplin", dob: "1889-04-16"}){
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
  addMovie({movie: {title: "Dr. Strangelove", releaseDate: "1964-01-29"}}){
    id
    title
    releaseDate
  }
}
```