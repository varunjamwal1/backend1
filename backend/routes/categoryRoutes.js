import express from 'express';
const router = express.Router();
import upload from '../config/cloudinary.js';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';

router.get('/', getCategories);
router.post('/', upload.single('image'), createCategory);
router.put('/:id', upload.single('image'), updateCategory);
router.delete('/:id', deleteCategory);

export default router;