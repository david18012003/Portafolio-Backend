import express from 'express';

import { upload } from '../middlewares/Uploads.js';
import { createUser, deleteUserById, getAllUsers, getUserById, updateUserById } from '../controllers/Users.Controller.js';
import { validacion } from '../middlewares/VerificarToken.js';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/registrar', upload.single('photo'), createUser); 
router.put('/:id', upload.single('photo'), updateUserById); 
router.delete('/:id', deleteUserById);
router.post('/login', validacion);

export default router;
