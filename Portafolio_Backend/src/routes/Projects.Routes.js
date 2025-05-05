import { Router } from "express";
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProjectById,
  deleteProjectById,
} from "../controllers/Projects.Controller.js";
import { body, param } from "express-validator";
import { handleValidationErrors } from "../middlewares/handleValidationErrors.js";

const routesProjects = Router();

/**
 * @desc Listar todos los proyectos (sin paginación)
 */
routesProjects.get("/proyectos", getAllProjects);

/**
 * @desc Buscar un proyecto por ID
 */
routesProjects.get(
  "/proyectos/:id",
  [
    param("id")
      .isInt().withMessage("El ID debe ser un número entero")
      .toInt(),  // Convertir el ID a un número entero
    handleValidationErrors,
  ],
  getProjectById
);

/**
 * @desc Registrar un nuevo proyecto
 */
routesProjects.post(
  "/registrar",
  [
    body("title")
      .notEmpty().withMessage("El título es obligatorio")
      .isLength({ max: 255 }).withMessage("El título no debe exceder 255 caracteres"),
    body("description")
      .notEmpty().withMessage("La descripción es obligatoria"),
    body("status")
      .notEmpty().withMessage("El estado es obligatorio")
      .isIn(["active", "inactive", "completed"]).withMessage("Estado inválido"),
    body("user_id")
      .isInt().withMessage("El user_id debe ser un número entero")
      .toInt(),
    handleValidationErrors,
  ],
  createProject
);

/**
 * @desc Actualizar un proyecto por ID
 */
routesProjects.put(
  "/proyectos/:id",
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
      .isIn(["active", "inactive", "completed"]).withMessage("Estado inválido"),
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
