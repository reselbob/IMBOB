module.exports =  {
    onConnect: (connectionParams) => {
        console.log(`Connection made , info ${JSON.stringify(connectionParams)} 
        at ${new Date().toString()}`)
    }
};