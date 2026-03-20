import express from 'express';
const router = express.Router();

import { getTax, createTax, updateTax, deleteTax } from '../controllers/taxController.js';

router.get('/', getTax);      // Changed from getTaxes
router.post('/', createTax);
router.put('/:id', updateTax);
router.delete('/:id', deleteTax);

export default router;