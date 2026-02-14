const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'default_secret_key_for_demo', {
    expiresIn: '1d',
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'default_secret_key_for_demo');
};

module.exports = {
  generateToken,
  verifyToken,
};