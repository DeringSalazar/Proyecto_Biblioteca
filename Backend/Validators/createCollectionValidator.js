import { body } from "express-validator"

export const createCollectionValidator = [
    body('nombre')
        .notEmpty().withMessage("El nombre de la coleccion es requerido"),

    body('descripcion')
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ min: 8 }).withMessage("La longitud minima de la descripcion es 8 letras"),
]