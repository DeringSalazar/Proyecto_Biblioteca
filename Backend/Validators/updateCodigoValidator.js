import { body } from "express-validator"

export const updateCodigoValidator = [
    body('titulo')
        .notEmpty().withMessage("El nombre de la coleccion es requerido"),

    body('descripcion')
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ min: 8 }).withMessage("La longitud minima de la descripcion es 8 letras"),

    body('codigo')
        .notEmpty().withMessage("El codigo es requerido"),

    body('lenguaje')
        .notEmpty().withMessage("El lenguaje es requerido"),

    body('tags')
        .optional({ nullable: true, checkFalsy: true })
        .isArray().withMessage("Los tags deben ser un array de strings"),

    body('tipo')
        .optional({ nullable: true, checkFalsy: true })
        .isString().withMessage("El tipo debe ser una cadena de texto"),
]