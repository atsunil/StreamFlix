const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key_for_demo';

/**
 * Ensure token present and set req.user = payload
 */
function authMiddleware(req, res, next) {
  const header = req.headers.authorization || req.cookies?.token;
  const token = header?.startsWith('Bearer ') ? header.split(' ')[1] : header;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

/**
 * Require admin role
 */
function adminMiddleware(req, res, next) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden: Admin access required' });
  return next();
}

module.exports = {
  authMiddleware,
  adminMiddleware
};