const fs = require('fs');
const util = require('util');
const path = require('path');

const fileToObject =  async (filename) => {
    const filespec = path.join(__dirname, filename);
    const readFile = util.promisify(fs.readFile);
    const result = await readFile(filespec,"utf8").then(data => {
        return JSON.parse(data)
    });
    return result;
};

const fileToObjectSync =  (filename) => {
    const filespec = path.join(__dirname, filename);
    return fs.readFileSync(filespec,"utf8");
};

const getCollection = (collectionName) =>{
    switch(collectionName.toUpperCase()){
        case 'MOVIES':
            if(!process.env.MOVIES)process.env.MOVIES = fileToObjectSync('movies.json');
            return JSON.parse(process.env.MOVIES);
        case 'PERSONS':
            if(!process.env.PERSONS)process.env.PERSONS = fileToObjectSync('persons.json');
            return JSON.parse(process.env.PERSONS);
        case 'TRIPLES':
            if(!process.env.TRIPLES)process.env.TRIPLES = fileToObjectSync('triples.json');
            return JSON.parse(process.env.TRIPLES);
    }
};

const updateCollection = function(dataObj, collectionName){
    let arr;
    switch(collectionName.toUpperCase()){
        case 'MOVIES':
            arr =  JSON.parse(process.env.MOVIES);
            arr.push(dataObj);
            process.env.MOVIES = JSON.stringify(arr);
            return arr;
        case 'PERSONS':
            arr =  JSON.parse(process.env.PERSONS);
            arr.push(dataObj);
            process.env.PERSONS = JSON.stringify(arr);
            return arr;
        case 'TRIPLES':
            arr =  JSON.parse(process.env.TRIPLES);
            arr.push(dataObj);
            process.env.TRIPLES = JSON.stringify(arr);
            return arr;
    }
};

module.exports = {
    updateCollection,
    getCollection
}