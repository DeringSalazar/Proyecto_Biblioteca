import { body } from "express-validator";

const allowedStates = ['activo', 'inactivo'];

export const updateCategoriesValidator = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre de la categoria es requerida"),

  body("descripcion")
    .optional({ nullable: true, checkFalsy: true }) 
    .isLength({ min: 8 })
    .withMessage("La longitud minima de la descripcion es 8 letras"),

  body("estado")
    .notEmpty()
    .withMessage("El estado es requerido")
    .isIn(allowedStates)
    .withMessage(`Escoja un estado predefinido: ${allowedStates.join(", ")}`),
];
