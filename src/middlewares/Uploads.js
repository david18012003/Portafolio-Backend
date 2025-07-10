import multer from "multer";
import path from "path"; // ✅ Importación necesaria

// 📂 Directorio donde se guardan las imágenes
const uploadDir = './uploads';

// Middleware para subir imágenes de usuario
export const uploadUser = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      cb(null, `user_${Date.now()}${path.extname(file.originalname)}`);
    }
  })
});

// Middleware para subir imágenes de proyectos
export const uploadProject = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      cb(null, `project_${Date.now()}${path.extname(file.originalname)}`);
    }
  })
});
