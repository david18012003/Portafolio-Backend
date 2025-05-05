import { createPool } from "mysql2/promise";
import dotenv from 'dotenv';
dotenv.config();    

export const pool = createPool({
    host: dotenv.DB_HOST || 'localhost',
    user: dotenv.DB_USER || 'root',
    password: dotenv.DB_PASSWORD || '',
    database: dotenv.DB_NAME || 'portafolio_db',
    port: dotenv.DB_PORT || 3306
});

pool.getConnection()
    .then(conn => {
        console.log('Conexión exitosa a la base de datos');
        conn.release();
    })
    .catch(err => {
        console.error('Error conectando a la base de datos:', err.stack);
    });

    