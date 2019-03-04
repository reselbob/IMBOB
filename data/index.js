const {getCollection, updateCollection, replaceCollection,getItemFromCollection} = require('./json/fileHelper');
//const {tripleHelpers} = require('./triples');


module.exports = {
    getCollection,
    updateCollection,
    replaceCollection,
    getItemFromCollection
};

/*

    persons: getCollection('persons'),
    movies: getCollection('movies'),
    triples: getCollection('triples') ,
 */