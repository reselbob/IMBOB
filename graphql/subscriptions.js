const { AuthenticationError } = require("apollo-server");
const config = require('../config');

module.exports =  {
    onConnect: (connectionParams) => {
        const token = connectionParams.authorization || connectionParams.Authorization;
        console.log('j: ' + token)
        if(token) token.replace('Bearer ','');
        if(!config.canAccess(token)){
            //throw new AuthenticationError('Invalid Access Token');
        }
        console.log(`Connection made , info ${JSON.stringify(connectionParams)} 
        at ${new Date().toString()}`)
    }
};

