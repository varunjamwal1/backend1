import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import CafeStatus from "../models/CafeStatus.js";

const router = express.Router();

// ✅ PUBLIC - Get cafe status (customers)
router.get("/", async (req, res) => {
  try {
    const status = await CafeStatus.findOne()
      .sort({ updatedAt: -1 })
      .select('isOnline message updatedAt')
      .lean();

    const defaultStatus = status || { 
      isOnline: true, 
      message: "We're open! Place your order now 🎉",
      updatedAt: new Date()
    };

    res.json({
      ...defaultStatus,
      isOnline: Boolean(defaultStatus.isOnline)
    });
  } catch (error) {
    console.error("🚨 Cafe status error:", error);
    res.status(200).json({ 
      isOnline: true, 
      message: "We're open! Place your order now 🎉"
    });
  }
});

// ✅ PROTECTED - Update status (admin only)
router.put("/", protect, async (req, res) => {
  try {
    const { isOnline, message } = req.body;

    if (typeof isOnline !== 'boolean') {
      return res.status(400).json({ message: "isOnline must be boolean" });
    }

    if (!message?.trim() || message.trim().length > 200) {
      return res.status(400).json({ message: "Valid message required (max 200 chars)" });
    }

    const status = await CafeStatus.findOneAndUpdate(
      {},
      { 
        isOnline,
        message: message.trim(),
        updatedBy: req.user._id
      },
      { upsert: true, new: true }
    );

    console.log(`✅ Cafe ${isOnline ? 'OPENED' : 'CLOSED'} by ${req.user.email}`);
    
    res.json({
      success: true,
      data: status,
      message: `Status updated to ${isOnline ? '🟢 ONLINE' : '🔴 OFFLINE'}`
    });
  } catch (error) {
    console.error("🚨 Update error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;