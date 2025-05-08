import { Router } from "express";
import { chatWithCohere } from "../controllers/Chatbot.Controller.js";
//import { AuthMiddleware } from "../middlewares/Auth.Middleware.js";

const routesChatbot = Router();

routesChatbot.post("/chatbot",chatWithCohere );

export default routesChatbot;