const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const JWT_SECRET = process.env.JWT_SECRET;

const adminAuth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token provided', success: false });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Ensure it's an admin token
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Access denied: Not an admin', success: false });
    }

    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found', success: false });
    }

    req.admin = admin;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token', success: false });
  }
};

module.exports = {adminAuth};
