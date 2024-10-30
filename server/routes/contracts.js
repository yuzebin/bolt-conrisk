import express from 'express';
import multer from 'multer';
import { body, param } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';
import { getDb } from '../database/init.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Get all contracts for organization
router.get('/', authenticateToken, async (req, res) => {
  try {
    const db = await getDb();
    const contracts = await db.all(
      `SELECT * FROM contracts WHERE organization_id = ? ORDER BY created_at DESC`,
      [req.user.organization_id]
    );

    res.json(contracts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '服务器错误' });
  }
});

// Get contract details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const db = await getDb();
    const contract = await db.get(
      `SELECT * FROM contracts WHERE id = ? AND organization_id = ?`,
      [req.params.id, req.user.organization_id]
    );

    if (!contract) {
      return res.status(404).json({ message: '合同不存在' });
    }

    // Get contract parties
    const parties = await db.all(
      'SELECT * FROM contract_parties WHERE contract_id = ?',
      [contract.id]
    );

    // Get risk assessments
    const risks = await db.all(
      'SELECT * FROM risk_assessments WHERE contract_id = ?',
      [contract.id]
    );

    // Get key dates
    const keyDates = await db.all(
      'SELECT * FROM key_dates WHERE contract_id = ?',
      [contract.id]
    );

    res.json({
      ...contract,
      parties,
      risks,
      keyDates
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '服务器错误' });
  }
});

// Upload contract
router.post('/',
  authenticateToken,
  upload.single('file'),
  [
    body('title').notEmpty().trim(),
    body('startDate').isDate(),
    body('endDate').isDate(),
    body('value').isNumeric(),
    body('parties').isArray()
  ],
  async (req, res) => {
    try {
      const {
        title,
        startDate,
        endDate,
        value,
        parties
      } = req.body;

      const db = await getDb();

      // Generate contract number
      const contractCount = await db.get(
        'SELECT COUNT(*) as count FROM contracts WHERE organization_id = ?',
        [req.user.organization_id]
      );
      const contractNumber = `CON-${new Date().getFullYear()}-${String(contractCount.count + 1).padStart(4, '0')}`;

      // Create contract
      const result = await db.run(
        `INSERT INTO contracts (
          title, number, organization_id, status, start_date, end_date, value, file_path
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title,
          contractNumber,
          req.user.organization_id,
          'active',
          startDate,
          endDate,
          value,
          req.file ? req.file.path : null
        ]
      );

      // Add contract parties
      for (const party of parties) {
        await db.run(
          'INSERT INTO contract_parties (contract_id, party_name, party_type) VALUES (?, ?, ?)',
          [result.lastID, party.name, party.type]
        );
      }

      res.status(201).json({
        id: result.lastID,
        number: contractNumber,
        message: '合同上传成功'
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: '服务器错误' });
    }
  }
);

// Update contract status
router.patch('/:id/status',
  authenticateToken,
  [
    param('id').isNumeric(),
    body('status').isIn(['active', 'completed', 'terminated'])
  ],
  async (req, res) => {
    try {
      const db = await getDb();
      await db.run(
        'UPDATE contracts SET status = ? WHERE id = ? AND organization_id = ?',
        [req.body.status, req.params.id, req.user.organization_id]
      );

      res.json({ message: '状态更新成功' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: '服务器错误' });
    }
  }
);

export default router;