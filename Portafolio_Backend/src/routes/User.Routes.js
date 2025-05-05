import { Router } from "express";
import { 
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
} from "../controllers/Users.Controller.js";

const routesUsers = Router();

routesUsers.get("/listar", getAllUsers);
routesUsers.get("/buscar/:id", getUserById);
routesUsers.post("/registrar", createUser);
routesUsers.put("/actualizar/:id", updateUserById);
routesUsers.delete("/eliminar/:id", deleteUserById);

export default routesUsers;
