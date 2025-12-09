import { body } from "express-validator"

const allowedRoles = ['usuario', 'admin'];

export const updateUserValidator = [
    body('nombre_completo').notEmpty().withMessage("El nombre completo es requerido"),
    body('email').isEmail().withMessage("Se requiere un correo valido"),
    body('contrasena').notEmpty().withMessage("El password es requerido"),

    body('rol')
        .notEmpty().withMessage("El rol es requerido")
        .isIn(allowedRoles).withMessage(`Escoja un rol predefinido: ${allowedRoles.join(', ')}`)
]