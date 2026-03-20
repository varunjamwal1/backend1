import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUsers, 
  updateUser, 
  deleteUser 
} from '../controllers/authController.js'; // Ensure this matches your file name
import { protect, isOwner } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Routes
router.post('/login', loginUser);
router.post('/register', registerUser); 

// Owner Only Routes (Protected)
router.route('/')
  .get(protect, isOwner, getUsers); // Get all staff

router.route('/:id')
  .put(protect, isOwner, updateUser) // Update staff
  .delete(protect, isOwner, deleteUser); // Delete staff

export default router;