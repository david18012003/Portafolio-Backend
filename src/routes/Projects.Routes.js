import { Router } from "express";
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProjectById,
  deleteProjectById,
  getProjectsByUserId,
} from "../controllers/Projects.Controller.js";

import { body, param } from "express-validator";
import { handleValidationErrors } from "../middlewares/handleValidationErrors.js";
import { upload } from "../middlewares/Uploads.js"; // Middleware para manejar imágenes

const routesProjects = Router();

/**
 * @desc Listar todos los proyectos (sin paginación)
 */
routesProjects.get("/proyectos", getAllProjects);

/**
 * @desc Obtener todos los proyectos de un usuario por su ID
 */
routesProjects.get(
  "/listar/:user_id",
  [
    param("user_id")
      .isInt().withMessage("El user_id debe ser un número entero")
      .toInt(),
    handleValidationErrors,
  ],
  getProjectsByUserId
);

/**
 * @desc Buscar un proyecto por ID
 */
routesProjects.get(
  "/proyectos/:id",
  [
    param("id")
      .isInt().withMessage("El ID debe ser un número entero")
      .toInt(),
    handleValidationErrors,
  ],
  getProjectById
);

/**
 * @desc Registrar un nuevo proyecto (con imagen)
 */
routesProjects.post(
  "/registrar",
  upload.single('image'), // Middleware multer para imagen (opcional)
  [
    body("title")
      .notEmpty().withMessage("El título es obligatorio")
      .isLength({ max: 255 }).withMessage("El título no debe exceder 255 caracteres"),
    body("description")
      .notEmpty().withMessage("La descripción es obligatoria"),
    body("status")
      .notEmpty().withMessage("El estado es obligatorio")
      .isIn(["active", "inactive", "completed", "En progreso", "En actualización", "completado"])
      .withMessage("Estado inválido"),
    body("user_id")
      .isInt().withMessage("El user_id debe ser un número entero")
      .toInt(),
    handleValidationErrors,
  ],
  createProject
);

/**
 * @desc Actualizar un proyecto por ID (con imagen opcional)
 */
routesProjects.put(
  "/proyectos/:id",
  upload.single('image'), // Permite cambiar o mantener imagen actual
  [
    param("id")
      .isInt().withMessage("El ID debe ser un número entero")
      .toInt(),
    body("title")
      .optional().notEmpty().withMessage("El título no debe estar vacío")
      .isLength({ max: 255 }).withMessage("El título no debe exceder 255 caracteres"),
    body("description")
      .optional().notEmpty().withMessage("La descripción no debe estar vacía"),
    body("status")
      .optional().notEmpty().withMessage("El estado no debe estar vacío")
      .isIn(["active", "inactive", "completed", "En progreso", "En actualización", "completado"])
      .withMessage("Estado inválido"),
    handleValidationErrors,
  ],
  updateProjectById
);

/**
 * @desc Eliminar un proyecto por ID
 */
routesProjects.delete(
  "/proyectos/:id",
  [
    param("id")
      .isInt().withMessage("El ID debe ser un número entero")
      .toInt(),
    handleValidationErrors,
  ],
  deleteProjectById
);

export default routesProjects;
