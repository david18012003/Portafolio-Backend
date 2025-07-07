import express from 'express';
import bodyParser from 'body-parser'; // 🔄 nombre estándar (opcional)
import cors from 'cors';

import routesProjects from './src/routes/Projects.Routes.js';
import routesUsers from './src/routes/User.Routes.js';
import routesChatbot from './src/routes/Chatbot.Routes.js';
import pdfRoutes from './src/routes/PDF.js';

const app = express();
const port = 3000;

// 📦 Middleware global
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // ❗ corregido: extend → extended

// 📂 Servir archivos estáticos
app.use('/uploads', express.static('uploads'));

// 🧪 Ruta de prueba
app.get('/', (req, res) => {
  res.send('Welcome to the Backend!');
});

// 📌 Rutas API
app.use('/api/projects', routesProjects);
app.use('/api/users', routesUsers);
app.use('/api/chatbot', routesChatbot);
app.use('/api', pdfRoutes);

// 🚀 Servidor corriendo
app.listen(port, () => {
  console.log(`🟢 Server is running at http://localhost:${port}`);
});
