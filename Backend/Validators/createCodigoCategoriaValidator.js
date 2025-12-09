import { body } from "express-validator"

export const createCodigoCategoriaValidator = [
    body('codigoId')
        .notEmpty().withMessage("El ID del código es requerido")
        .isInt().withMessage("El ID del código debe ser un número entero"),
    body('categoriaId')
        .notEmpty().withMessage("El ID de la categoría es requerido")
        .isInt().withMessage("El ID de la categoría debe ser un número entero"),
]