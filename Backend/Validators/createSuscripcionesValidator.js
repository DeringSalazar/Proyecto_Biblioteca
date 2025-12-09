import { body } from "express-validator";


export const createSuscripcionesValidator = [
  body("id_usuario")
    .notEmpty()
    .withMessage("El id del usuario es requerido"),

  body("id_categoria")
    .notEmpty()
    .withMessage("El id de la categoria es requerido"),

  body("notificaciones")
    .isBoolean()
    .withMessage("El campo de notificaciones debe ser un valor booleano"),
];
