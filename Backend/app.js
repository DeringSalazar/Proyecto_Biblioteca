import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pool from './Database/db.js';
import Swagger from './src/Swagger.js';
import usersRoutes from './Routes/users.Routes.js';
import categories from './Routes/categories.Routes.js';
import collectionsRoutes from './Routes/collections.Routes.js';
import codigosRoutes from './Routes/codigos.Routes.js';
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use('/api/users', usersRoutes);
app.use('/api/categories', categories);
app.use('/api/collections', collectionsRoutes);
app.use('/api/codigos', codigosRoutes);
app.use("/api/documentacion", Swagger.serve, Swagger.setup);

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
