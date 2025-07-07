import express from 'express';

import { upload } from '../middlewares/Uploads.js';
import { createUser, deleteUserById, getAllUsers, getUserById, updateUserById } from '../controllers/Users.Controller.js';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', upload.single('photo'), createUser); 
router.put('/:id', upload.single('photo'), updateUserById); 
router.delete('/:id', deleteUserById);

export default router;
