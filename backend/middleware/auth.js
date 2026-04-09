const jwt = require('jsonwebtoken');
const db = require('../config/db');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token is required.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [users] = await db.query(
      'SELECT id, name, email, phone, created_at, updated_at FROM users WHERE id = ? LIMIT 1',
      [decoded.id]
    );

    if (!users.length) {
      return res.status(401).json({ message: 'User not found.' });
    }

    req.user = users[0];
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;
