import { createPool } from "mysql2/promise";
import dotenv from 'dotenv';
dotenv.config();    

export const pool = createPool({
    host: 'dpg-d0lstj95pdvs738m584g-a' || 'localhost',
    user: 'portafolio_db_8t4f' || 'root',
    password: 'Bg4NE449ImQ2iRyGZfnM1NIEq16M88RG' || '',
    database: 'portafolio_db_8t4f' || 'portafolio_db',
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

    
