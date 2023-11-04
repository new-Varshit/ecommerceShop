const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

  const  MongodbUrl = process.env.MONGODB_URL;


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
