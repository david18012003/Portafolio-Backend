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
import { uploadProject } from "../middlewares/Uploads.js";

const routesProjects = Router();

// Listar todos los proyectos
routesProjects.get("/proyectos", getAllProjects);

// Obtener proyectos de un usuario
routesProjects.get(
  "/listar/:user_id",
  [
    param("user_id").isInt().withMessage("El user_id debe ser un número entero").toInt(),
    handleValidationErrors,
  ],
  getProjectsByUserId
);

// Buscar un proyecto por ID
routesProjects.get(
  "/proyectos/:id",
  [
    param("id").isInt().withMessage("El ID debe ser un número entero").toInt(),
    handleValidationErrors,
  ],
  getProjectById
);

// Registrar nuevo proyecto
routesProjects.post(
  "/registrar",
  uploadProject.single("image"),
  [
    body("title")
      .notEmpty().withMessage("El título es obligatorio")
      .isLength({ max: 100 }).withMessage("El título no debe exceder 100 caracteres"),
    body("description").notEmpty().withMessage("La descripción es obligatoria"),
    body("status")
      .notEmpty().withMessage("El estado es obligatorio")
      .isIn(["active", "inactive", "completed", "En progreso", "En actualización", "completado"])
      .withMessage("Estado inválido"),
    body("user_id").isInt().withMessage("El user_id debe ser un número entero").toInt(),
    handleValidationErrors,
  ],
  createProject
);

// Actualizar proyecto
routesProjects.put(
  "/actualizar/:id",
  uploadProject.single("image"),
  [
    param("id").isInt().withMessage("El ID debe ser un número entero").toInt(),
    body("title")
      .optional().notEmpty().withMessage("El título no debe estar vacío")
      .isLength({ max: 100 }).withMessage("El título no debe exceder 100 caracteres"),
    body("description").optional().notEmpty().withMessage("La descripción no debe estar vacía"),
    body("status")
      .optional()
      .isIn(["active", "inactive", "completed", "En progreso", "En actualización", "completado"])
      .withMessage("Estado inválido"),
    handleValidationErrors,
  ],
  updateProjectById
);

// Eliminar proyecto
routesProjects.delete(
  "/eliminar/:id",
  [
    param("id").isInt().withMessage("El ID debe ser un número entero").toInt(),
    handleValidationErrors,
  ],
  deleteProjectById
);

export default routesProjects;
