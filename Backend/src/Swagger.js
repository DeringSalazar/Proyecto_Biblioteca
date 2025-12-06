import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Documentación API",
        version: "1.0.0",
        description: "Documentancion de la ruta de la API, (Por JSONeros del conocimiento)",
    },
    servers: [{ url: "http://localhost:4000/api" }],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
                description: "Token JWT"
            }
        }
    }
};

const options = {
    swaggerDefinition,
    apis: [join(__dirname, '../Routes/*.Routes.js')],
};

const spec = swaggerJSDoc(options);
const serve = swaggerUi.serve;
const setup = swaggerUi.setup(spec, {
    swaggerOptions: { docExpansion: "none" }
});

export default { serve, setup };
