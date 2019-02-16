const uuidv4 = require('uuid/v4');
const _ = require('lodash');

const convertIntIdToGuid = (collection) =>{
    collection.forEach((itm)=>{
        for(const prop in itm){
            if(prop === 'id'){
                itm[prop] = uuidv4();
            }
        }
        console.log(JSON.stringify(itm));
    });
    return collection;
};

const guidTriples = (trips, persons) =>{
    const trips2 = [];
    persons.forEach((person) => {

        const itms = _.filter(trips, {subject: {firstName: person.firstName, lastName: person.lastName}});


        const rslt = itms.map((t) => {
            t.subject.id = person.id;
            trips2.push(t)
        });
    });
    trips2.forEach((t) => {
        const p = _.find(persons, {firstName: t.object.firstName, lastName: t.object.lastName});
        t.object.id = p.id;
    })
    return trips2;
}

module.exports = {convertIntIdToGuid, guidTriples};

/*

            if(typeof(itm[prop]) === 'object'){
                for(const p in itm[prop]){
                    if(p === 'id'){
                        itm[prop][p]
                    }
                }
            }

 */