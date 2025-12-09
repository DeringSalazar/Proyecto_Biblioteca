import { body } from "express-validator"

export const createUserValidation = [
    body('nombre_completo').notEmpty().withMessage("El nombre completo es requerido"),
    body('email').isEmail().withMessage("Se requiere un correo valido"),
    body('contrasena').notEmpty().withMessage("El password es requerido")
]