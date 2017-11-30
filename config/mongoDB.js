// define connect variables
const host = 'localhost';
const port = '27017';
const dbName = 'inteligentny-budynek';

// export connect string
module.exports = 'mongodb://' + host + ':' + port + '/' + dbName;