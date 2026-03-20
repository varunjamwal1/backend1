// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';

// export const protect = async (req, res, next) => {
//   let token;

//   // Check for token in header (x-auth-token or Authorization)
//   if (req.headers['x-auth-token']) {
//     token = req.headers['x-auth-token'];
//   } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     token = req.headers.authorization.split(' ')[1];
//   }

//   if (!token) {
//     return res.status(401).json({ message: 'No token, authorization denied' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     // Attach user to request (excluding password)
//     req.user = await User.findById(decoded.id).select('-password');
//     next();
//   } catch (err) {
//     res.status(401).json({ message: 'Token is not valid' });
//   }
// };

// // Middleware to ensure only the Owner can manage staff
// export const isOwner = (req, res, next) => {
//   if (req.user && req.user.role === 'owner') {
//     next();
//   } else {
//     res.status(403).json({ message: 'Not authorized as an owner' });
//   }
// };
import jwt from 'jsonwebtoken';
import User from '../models/User.js';  // Adjust path if needed

// ✅ Middleware 1: Protect Routes (All Authenticated Users)
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.headers['x-auth-token']) {
    token = req.headers['x-auth-token'];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    
    // Get user from token
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }
    
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// ✅ Middleware 2: Owner Only
export const isOwner = (req, res, next) => {
  if (req.user && req.user.role === 'owner') {
    next();
  } else {
    res.status(403).json({ message: 'Owner access required' });
  }
};

// ✅ Middleware 3: Staff/Manager/Owner
export const isStaff = (req, res, next) => {
  const allowedRoles = ['staff', 'manager', 'owner'];
  if (req.user && allowedRoles.includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({ message: 'Staff access required' });
  }
};

// ✅ Middleware 4: Kitchen Staff (preparing/ready)
export const isKitchen = (req, res, next) => {
  if (req.user && ['kitchen', 'staff', 'manager', 'owner'].includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({ message: 'Kitchen access required' });
  }
};

export default { protect, isOwner, isStaff, isKitchen };