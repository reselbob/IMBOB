const { AuthenticationError } = require("apollo-server");
const config = require('../config');

module.exports =  {
    onConnect: (connectionParams) => {
        const token = connectionParams.authorization || 'NO_TOKEN';
        if(!config.canAccess(token)){
            throw new AuthenticationError('Invalid Access Token');
        }
        console.log(`Connection made , info ${JSON.stringify(connectionParams)} 
        at ${new Date().toString()}`)
    }
};

