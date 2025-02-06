const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error('Please add your Mongo URI to .env.local');
}

let client = null;
let clientPromise = null;

if (process.env.NODE_ENV === 'development') {
    // En desarrollo, usa una variable global para preservar la conexión entre recargas de HMR
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // En producción, es mejor crear una nueva conexión
    client = new MongoClient(uri);
    clientPromise = client.connect();
}

module.exports = clientPromise; 