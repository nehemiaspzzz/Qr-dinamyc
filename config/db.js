const { getDatabase } = require('./mongodb');

const dbClient = {
    run: async (query, params) => {
        try {
            const db = await getDatabase();

            if (query.includes('INSERT')) {
                const result = await db.collection('qrs').insertOne({
                    id: params[0],
                    url: params[1],
                    createdAt: new Date()
                });
                return { lastID: params[0] };
            }
            if (query.includes('UPDATE')) {
                const result = await db.collection('qrs').updateOne(
                    { id: params[1] },
                    { $set: { url: params[0], updatedAt: new Date() } }
                );
                return { changes: result.modifiedCount };
            }
        } catch (error) {
            console.error('Error en operación DB:', error);
            throw error;
        }
    },
    get: async (query, params) => {
        try {
            const db = await getDatabase();
            const [id] = params;
            return await db.collection('qrs').findOne({ id });
        } catch (error) {
            console.error('Error en get:', error);
            throw error;
        }
    }
};

module.exports = dbClient; 