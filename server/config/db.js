const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Ruta a la base de datos
const dbPath = path.resolve(__dirname, '../database.sqlite');

// Crear conexión a la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err);
        return;
    }
    console.log('Conexión exitosa con SQLite');

    // Eliminar tabla existente si hay problemas de estructura
    db.run("DROP TABLE IF EXISTS qrs", (err) => {
        if (err) {
            console.error('Error al eliminar tabla:', err);
            return;
        }

        // Crear tabla con la estructura correcta
        db.run(`
            CREATE TABLE IF NOT EXISTS qrs (
                id TEXT PRIMARY KEY,
                url TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error('Error al crear la tabla:', err);
            } else {
                console.log('Tabla qrs creada correctamente');
            }
        });
    });
});

// Convertir callbacks a promesas
const dbAsync = {
    run: (sql, params) => new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) {
                console.error('Error SQL:', err);
                console.error('Query:', sql);
                console.error('Params:', params);
                reject(err);
            } else {
                resolve(this);
            }
        });
    }),
    get: (sql, params) => new Promise((resolve, reject) => {
        db.get(sql, params, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    }),
    all: (sql, params) => new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    }),
    // Función para verificar un QR específico
    verifyQR: async (id) => {
        try {
            const qr = await dbAsync.get('SELECT * FROM qrs WHERE id = ?', [id]);
            console.log('\n=== Verificación de QR ===');
            console.log('ID:', id);
            console.log('Datos:', qr);
            console.log('========================\n');
            return qr;
        } catch (error) {
            console.error('Error al verificar QR:', error);
            return null;
        }
    }
};

module.exports = dbAsync; 