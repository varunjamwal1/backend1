import express from 'express';
const router = express.Router();
import upload from '../config/cloudinary.js';
import { getItems, createItem, updateItem, deleteItem, togglePopular } from '../controllers/itemController.js';

router.get('/', getItems);
router.post('/', upload.single('image'), createItem);
router.put('/:id', upload.single('image'), updateItem);
router.delete('/:id', deleteItem);
router.put('/popular/:id', togglePopular);

export default router;