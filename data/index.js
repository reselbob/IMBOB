const {getCollection, updateCollection, replaceCollection,getItemFromCollection} = require('./json/fileHelper');
//const {tripleHelpers} = require('./triples');


module.exports = {
    persons: getCollection('persons'),
    movies: getCollection('movies'),
    triples: getCollection('triples') ,
    getCollection,
    updateCollection,
    replaceCollection,
    getItemFromCollection
}