import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { getDb } from '../database/init.js';
import { authenticateToken } from '../middleware/auth.js';
import cors from 'cors';

const router = express.Router();

// 配置 CORS
router.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Login
router.post('/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').exists()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: '无效的邮箱或密码格式' });
      }

      const { email, password } = req.body;
      const db = await getDb();

      // Get user with organization info
      const user = await db.get(
        `SELECT users.*, organizations.name as organization_name 
         FROM users 
         JOIN organizations ON users.organization_id = organizations.id 
         WHERE users.email = ?`,
        [email]
      );

      if (!user) {
        return res.status(401).json({ message: '用户名或密码错误' });
      }

      // Validate password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: '用户名或密码错误' });
      }

      // Create token
      const token = jwt.sign(
        { 
          id: user.id, 
          organization_id: user.organization_id,
          email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Set token in cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });

      // Send response
      res.json({
        token, // 为了向后兼容，仍然在响应中包含 token
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          organization: {
            id: user.organization_id,
            name: user.organization_name
          },
          role: user.role
        }
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: '服务器错误' });
    }
  }
);

// Register
router.post('/register',
  [
    body('name').notEmpty().trim(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('company').notEmpty().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: '验证失败',
          errors: errors.array()
        });
      }

      const { name, email, password, company } = req.body;
      const db = await getDb();

      // Check if user exists
      const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
      if (existingUser) {
        return res.status(400).json({ message: '该邮箱已被注册' });
      }

      // Create organization
      const orgResult = await db.run(
        'INSERT INTO organizations (name) VALUES (?)',
        [company]
      );

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const userResult = await db.run(
        'INSERT INTO users (name, email, password, organization_id, role) VALUES (?, ?, ?, ?, ?)',
        [name, email, hashedPassword, orgResult.lastID, 'admin']
      );

      res.status(201).json({ 
        message: '注册成功',
        userId: userResult.lastID
      });
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ message: '服务器错误' });
    }
  }
);

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: '已退出登录' });
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const db = await getDb();
    const user = await db.get(
      `SELECT users.*, organizations.name as organization_name 
       FROM users 
       JOIN organizations ON users.organization_id = organizations.id 
       WHERE users.id = ?`,
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      organization: {
        id: user.organization_id,
        name: user.organization_name
      },
      role: user.role
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router;