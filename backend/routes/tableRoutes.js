import express from 'express';
const router = express.Router();
import { getTables, createTable, updateTable, deleteTable } from '../controllers/tableController.js';

router.get('/', getTables);
router.post('/', createTable);
router.put('/:id', updateTable);
router.delete('/:id', deleteTable);

export default router;