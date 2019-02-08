const PREDICATE = {
    KNOWS: 'KNOWS',
    LIKES: 'LIKES',
    MARRIED_TO: 'MARRIED_TO',
    DIVORCED_FROM: 'DIVORCED_FROM'
}


const triples = [
    {
        subject: {firstName: "Nicholas", lastName: "Roeg", dob: "1928-08-15"},
        predicate: PREDICATE.KNOWS,
        object: {id: 101, firstName: "David", lastName: "Bowie", dob: "1947-01-08"}
    },
    {
        subject: {firstName: "Nicholas", lastName: "Roeg", dob: "1928-08-15"},
        predicate: PREDICATE.KNOWS,
        object: {id: 103, firstName: "Rip", lastName: "Torn", dob: "1931-02-06"}
    },
    {
        subject: {firstName: "Nicholas", lastName: "Roeg", dob: "1928-08-15"},
        predicate: PREDICATE.KNOWS,
        object: {id: 104, firstName: "Candy", lastName: "Clark", dob: "1947-06-20"}
    },
    {
        subject: {firstName: "Nicholas", lastName: "Roeg", dob: "1928-08-15"},
        predicate: PREDICATE.KNOWS,
        object: {id: 106, firstName: "Buck", lastName: "Henry", dob: "1930-12-09"}
    },
    {
        subject: {firstName: "Nicholas", lastName: "Roeg", dob: "1928-08-15"},
        predicate: PREDICATE.KNOWS,
        object: {id: 107, firstName: "Mick", lastName: "Jagger", dob: "1943-07-23"}
    },
    {
        subject: {firstName: "Nicholas", lastName: "Roeg", dob: "1928-08-15"},
        predicate: PREDICATE.KNOWS,
        object: {id: 108, firstName: "Susan", lastName: "Stephen", dob: "1931-07-16"}
    },
    {
        subject: {firstName: "Nicholas", lastName: "Roeg", dob: "1928-08-15"},
        predicate: PREDICATE.KNOWS,
        object: {id: 109, firstName: "Theresa", lastName: "Russell", dob: "1957-03-20"}
    },
    {
        subject: {firstName: "Nicholas", lastName: "Roeg", dob: "1928-08-15"},
        predicate: PREDICATE.DIVORCED_FROM,
        object: {id: 108, firstName: "Susan", lastName: "Stephen", dob: "1931-07-16"}
    },
    {
        subject: {firstName: "Nicholas", lastName: "Roeg", dob: "1928-08-15"},
        predicate: PREDICATE.MARRIED_TO,
        object: {id: 109, firstName: "Theresa", lastName: "Russell", dob: "1957-03-20"}
    },
    {
        subject: {firstName: "Nicholas", lastName: "Roeg", dob: "1928-08-15"},
        predicate: PREDICATE.LIKES,
        object: {id: 101, firstName: "David", lastName: "Bowie", dob: "1947-01-08"}
    },
    {
        subject: {firstName: "Nicholas", lastName: "Roeg", dob: "1928-08-15"},
        predicate: PREDICATE.LIKES,
        object: {id: 104, firstName: "Candy", lastName: "Clark", dob: "1947-06-20"}
    },
    {
        subject: {firstName: "Nicholas", lastName: "Roeg", dob: "1928-08-15"},
        predicate: PREDICATE.LIKES,
        object: {id: 107, firstName: "Mick", lastName: "Jagger", dob: "1943-07-23"}
    },
    {
        subject: {firstName: "Nicholas", lastName: "Roeg", dob: "1928-08-15"},
        predicate: PREDICATE.LIKES,
        object: {id: 108, firstName: "Susan", lastName: "Stephen", dob: "1931-07-16"}
    }
];

const tripleHelpers = {
    valueAsEnum: (value) => {
        //traverse the object, inspect the property value and return the property value
        for (var prop in PREDICATE) {
            if (PREDICATE[prop] === value) return prop;
        }
    },
    enumAsValue: (enm) => {
        return PREDICATE[enm]
    }
}

module.exports = {
    tripleHelpers,
    triples
};