const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    // Try to verify as JWT first
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
      req.user = decoded;
      return next();
    } catch (jwtError) {
      // If JWT verification fails, try to decode as mock token (base64)
      try {
        const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
        req.user = decoded;
        return next();
      } catch (mockError) {
        // If both fail, return 401
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
      }
    }
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Authentication error' });
  }
};

module.exports = authMiddleware;
