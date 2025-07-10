import express from 'express';

import { uploadUser } from '../middlewares/Uploads.js';
import { createUser, deleteUserById, getAllUsers, getUserById, updateUserById } from '../controllers/Users.Controller.js';
import { validacion } from '../middlewares/VerificarToken.js';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/registrar', uploadUser.single('image'), createUser); 
router.put('/:id', uploadUser.single('image'), updateUserById); 
router.delete('/:id', deleteUserById);
router.post('/login', validacion);

export default router;
