const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let MongodbUrl = 'mongodb://127.0.0.1:27017';

if(process.env.MONGODB_URL){
    MongodbUrl = process.env.MONGODB_URL;
}

async function connectToDatabase() {
    const client = await MongoClient.connect(MongodbUrl)
    database = client.db('online-shop');
}

function getDb() {
    if (!database) {
        throw new Error('You must connect first!');
    }

    return database;
}

module.exports = {
    connectToDatabase: connectToDatabase,
    getDb: getDb
}
