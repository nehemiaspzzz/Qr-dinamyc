const { MongoClient } = require('mongodb');

if (!process.env.MONGODB_URI) {
    throw new Error('Please add your Mongo URI to environment variables');
}

const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function getDatabase() {
    if (!client.isConnected()) {
        await client.connect();
    }
    return client.db('qr-dynamic');
}

module.exports = {
    getDatabase,
    client
}; 