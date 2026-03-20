// import express from 'express';
// const router = express.Router();

// import { 
//   getOrders, 
//   createOrder, 
//   getOrderStats,
//   approveOrder,
//   updateOrderStatus,
//   getOrderById,
//   completeOrder,
//   cancelOrder
// } from '../controllers/orderController.js';

// router.get('/', getOrders);
// router.post('/', createOrder);
// router.get('/stats', getOrderStats);
// router.get('/:id', getOrderById);
// router.put('/:id/approve', approveOrder);
// router.put('/:id/status', updateOrderStatus);
// router.put('/:id/complete', completeOrder);
// router.put('/:id/cancel', cancelOrder);

// export default router;
import express from "express";

import {
  getOrders,
  getCustomerOrders,
  createOrder,
  completeOrder,
  approveOrder,
  updateOrderStatus,
  cancelOrder,
  getOrderStats
} from "../controllers/orderController.js";

const router = express.Router();

router.get("/", getOrders);
router.put("/complete/:id", completeOrder);
router.get("/customer", getCustomerOrders);

router.get("/stats", getOrderStats);

router.post("/", createOrder);

router.put("/approve/:id", approveOrder);

router.put("/status/:id", updateOrderStatus);

router.put("/cancel/:id", cancelOrder);

export default router;