const tokenOne = 'ch3ddarch33s3';
const tokenTwo = 's!ssch33s3';

const accessTokens = [tokenOne, tokenTwo];
module.exports = {
    canAccess: (accessToken) => {
        return accessTokens.includes(accessToken);
    },
    hasPersonalScope:(accessToken) =>{
        return accessToken === tokenTwo;
    }
};