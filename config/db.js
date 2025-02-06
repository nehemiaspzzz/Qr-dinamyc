// Solución temporal usando un objeto en memoria
const db = {
    qrs: new Map(),
    run: async (query, params) => {
        if (query.includes('INSERT')) {
            db.qrs.set(params[0], { id: params[0], url: params[1] });
            return { lastID: params[0] };
        }
        if (query.includes('UPDATE')) {
            db.qrs.set(params[1], { id: params[1], url: params[0] });
            return { changes: 1 };
        }
    },
    get: async (query, params) => {
        const [id] = params;
        return db.qrs.get(id);
    }
};

module.exports = db; 