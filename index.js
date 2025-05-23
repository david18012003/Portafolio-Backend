import express from 'express';
import body_parser from 'body-parser';
import cors from 'cors';
import routesProjects from './src/routes/Projects.Routes.js';
import routesUsers from './src/routes/User.Routes.js';
import routesChatbot from './src/routes/Chatbot.Routes.js';
import pdfRoutes from './src/routes/PDF.js';

const app = express();
const port = 3000;

app.use(body_parser.json());
app.use(body_parser.urlencoded({ extend: false }));

app.use(cors());


app.get('/', (req, res) => {
    res.send('Welcome to the Backend!');
});
app.use('/api/projects', routesProjects);
app.use('/api/users', routesUsers);
app.use('/api/chatbot', routesChatbot);
app.use('/api', pdfRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});