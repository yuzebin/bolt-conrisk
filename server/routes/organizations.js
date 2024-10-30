import express from 'express';
import { body } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';
import { getDb } from '../database/init.js';

const router = express.Router();

// Get organization details
router.get('/', authenticateToken, async (req, res) => {
  try {
    const db = await getDb();
    const organization = await db.get(
      'SELECT * FROM organizations WHERE id = ?',
      [req.user.organization_id]
    );

    if (!organization) {
      return res.status(404).json({ message: '组织不存在' });
    }

    // Get team members
    const members = await db.all(
      'SELECT id, name, email, role FROM users WHERE organization_id = ?',
      [req.user.organization_id]
    );

    res.json({
      ...organization,
      members
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '服务器错误' });
  }
});

// Update organization name
router.patch('/',
  authenticateToken,
  [body('name').notEmpty().trim()],
  async (req, res) => {
    try {
      const db = await getDb();
      await db.run(
        'UPDATE organizations SET name = ? WHERE id = ?',
        [req.body.name, req.user.organization_id]
      );

      res.json({ message: '组织名称更新成功' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: '服务器错误' });
    }
  }
);

// Invite team member
router.post('/members',
  authenticateToken,
  [
    body('email').isEmail().normalizeEmail(),
    body('role').isIn(['admin', 'member'])
  ],
  async (req, res) => {
    try {
      const { email, role } = req.body;
      const db = await getDb();

      // Check if user already exists
      const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
      if (existingUser) {
        return res.status(400).json({ message: '该邮箱已被注册' });
      }

      // TODO: Implement email invitation system
      // For now, just create the user with a temporary password
      const tempPassword = Math.random().toString(36).slice(-8);
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(tempPassword, salt);

      await db.run(
        'INSERT INTO users (email, password, organization_id, role) VALUES (?, ?, ?, ?)',
        [email, hashedPassword, req.user.organization_id, role]
      );

      res.status(201).json({ 
        message: '邀请发送成功',
        tempPassword // In production, this should be sent via email
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: '服务器错误' });
    }
  }
);

// Remove team member
router.delete('/members/:id', authenticateToken, async (req, res) => {
  try {
    const db = await getDb();
    
    // Check if user exists and belongs to the organization
    const user = await db.get(
      'SELECT * FROM users WHERE id = ? AND organization_id = ?',
      [req.params.id, req.user.organization_id]
    );

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // Cannot remove yourself
    if (user.id === req.user.id) {
      return res.status(400).json({ message: '不能删除自己的账户' });
    }

    await db.run('DELETE FROM users WHERE id = ?', [req.params.id]);

    res.json({ message: '成员删除成功' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router;