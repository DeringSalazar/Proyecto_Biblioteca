import 'dotenv/config';
import express from 'express';
import cors from 'cors';


import pool from './Database/db.js';
import usersRoutes from './Routes/users.Routes.js';
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use('/api/users', usersRoutes);

(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Conectado a MySQL correctamente');
        connection.release();
    } catch (error) {
        console.error('Error conectando a MySQL:', error);
    }
})();

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
