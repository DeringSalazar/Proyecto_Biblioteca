import { body } from "express-validator";


export const updateSuscripcionesValidator = [
  body("id_suscripciones")
    .notEmpty()
    .withMessage("El id de la suscripcion es requerido"),

  body("notificaciones")
    .isBoolean()
    .withMessage("El campo de notificaciones debe ser un valor booleano"),
];
