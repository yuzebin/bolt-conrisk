import express from 'express';
import multer from 'multer';
import { body, param } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';
import { getDb } from '../database/init.js';
import { analyzeContract } from '../services/contractAnalysis.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createReadStream } from 'fs';
import { promisify } from 'util';
import { pipeline } from 'stream';

const streamPipeline = promisify(pipeline);
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

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    // Accept only PDF and Word documents
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/msword' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('不支持的文件格式'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Get all contracts for organization
router.get('/', authenticateToken, async (req, res) => {
  try {
    const db = await getDb();
    const contracts = await db.all(
      `SELECT 
        c.*,
        GROUP_CONCAT(DISTINCT cp.party_name) as parties,
        COUNT(DISTINCT ra.id) as risk_count,
        MAX(CASE WHEN ra.risk_level = 'high' THEN 1 ELSE 0 END) as has_high_risk
       FROM contracts c
       LEFT JOIN contract_parties cp ON c.id = cp.contract_id
       LEFT JOIN risk_assessments ra ON c.id = ra.contract_id
       WHERE c.organization_id = ?
       GROUP BY c.id
       ORDER BY c.created_at DESC`,
      [req.user.organization_id]
    );

    res.json(contracts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '服务器错误' });
  }
});

// Get contract details with analysis
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
      'SELECT * FROM risk_assessments WHERE contract_id = ? ORDER BY risk_level DESC',
      [contract.id]
    );

    // Get key dates
    const keyDates = await db.all(
      'SELECT * FROM key_dates WHERE contract_id = ? ORDER BY event_date ASC',
      [contract.id]
    );

    // Calculate risk statistics
    const riskStats = {
      total: risks.length,
      high: risks.filter(r => r.risk_level === 'high').length,
      medium: risks.filter(r => r.risk_level === 'medium').length,
      low: risks.filter(r => r.risk_level === 'low').length
    };

    res.json({
      ...contract,
      parties,
      risks,
      keyDates,
      riskStats
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '服务器错误' });
  }
});

// Upload and analyze contract
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

      if (!req.file) {
        return res.status(400).json({ message: '请上传合同文件' });
      }

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
          req.file.path
        ]
      );

      // Add contract parties
      const parsedParties = JSON.parse(parties);
      for (const party of parsedParties) {
        await db.run(
          'INSERT INTO contract_parties (contract_id, party_name, party_type) VALUES (?, ?, ?)',
          [result.lastID, party.name, party.type]
        );
      }

      // Read and analyze contract content
      const fileContent = await new Promise((resolve, reject) => {
        let content = '';
        const readStream = createReadStream(req.file.path, 'utf8');
        readStream.on('data', chunk => content += chunk);
        readStream.on('end', () => resolve(content));
        readStream.on('error', reject);
      });

      // Analyze contract
      const analysis = await analyzeContract(result.lastID, fileContent);

      res.status(201).json({
        id: result.lastID,
        number: contractNumber,
        analysis,
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