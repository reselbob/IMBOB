const persons = require('./persons');
const {getCollection} = require('./json/fileHelper');
//const movies = fileToObject('movies.json');
const movies = require('./movies');
const {tripleHelpers} = require('./triples');


module.exports = {
    persons: getCollection('persons'),
    movies: getCollection('movies'),
    triples: getCollection('triples') ,
    tripleHelpers
}