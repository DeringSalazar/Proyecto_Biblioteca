import { body } from "express-validator"

export const createLoginValidator = [
    body('email').isEmail().withMessage("El correo es requerido"),
    body('contrasena').notEmpty().withMessage("El password es requerido")
]