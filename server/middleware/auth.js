import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
  // 首先检查 cookie
  const tokenFromCookie = req.cookies?.token;
  
  // 然后检查 Authorization header
  const authHeader = req.headers['authorization'];
  const tokenFromHeader = authHeader && authHeader.split(' ')[1];

  // 优先使用 cookie 中的 token
  const token = tokenFromCookie || tokenFromHeader;

  if (!token) {
    return res.status(401).json({ message: '未授权访问' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: '登录已过期，请重新登录' });
      }
      return res.status(403).json({ message: '无效的令牌' });
    }

    req.user = user;
    next();
  });
}