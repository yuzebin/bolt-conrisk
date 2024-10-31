import express from 'express';
import multer from 'multer';
import path from 'path';
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

// 文件名处理函数
function sanitizeFilename(filename) {
  // 保留原始扩展名
  const ext = path.extname(filename);
  const basename = path.basename(filename, ext);
  
  // 使用 Base64 编码处理文件名（保留原始文件名信息但避免特殊字符问题）
  const encodedName = Buffer.from(basename).toString('base64');
  
  // 生成时间戳
  const timestamp = Date.now();
  
  // 组合新文件名：时间戳 + 编码后的原始文件名 + 原始扩展名
  return `${timestamp}-${encodedName}${ext}`;
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    // 处理原始文件名中的中日韩文字和特殊字符
    const sanitizedFilename = sanitizeFilename(file.originalname);
    
    // 在请求对象中保存原始文件名和处理后的文件名的映射关系
    req.fileNameMap = {
      ...req.fileNameMap,
      [sanitizedFilename]: file.originalname
    };
    
    cb(null, sanitizedFilename);
  }
});

// 自定义文件过滤器
const fileFilter = (req, file, cb) => {
  // 检查 MIME 类型
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('不支持的文件格式。仅支持 PDF 和 Word 文档。'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 1 // 一次只允许上传一个文件
  }
});

// 错误处理中间件
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: '文件大小不能超过 10MB' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: '一次只能上传一个文件' });
    }
    return res.status(400).json({ message: '文件上传失败' });
  }
  
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  
  next();
};

// 文件分析路由
router.post('/analyze',
  authenticateToken,
  (req, res, next) => {
    upload.single('file')(req, res, (err) => {
      handleUploadError(err, req, res, next);
    });
  },
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: '请选择要上传的文件' });
      }

      // 获取原始文件名
      const originalFilename = req.fileNameMap[req.file.filename];

      // 分析合同内容
      const fileContent = await new Promise((resolve, reject) => {
        let content = '';
        const readStream = createReadStream(req.file.path, 'utf8');
        readStream.on('data', chunk => content += chunk);
        readStream.on('end', () => resolve(content));
        readStream.on('error', reject);
      });

      const analysis = await analyzeContract(fileContent);

      res.json({
        fileId: req.file.filename,
        originalFilename,
        analysis
      });
    } catch (err) {
      console.error('Contract analysis error:', err);
      res.status(500).json({ message: '合同分析失败，请重试' });
    }
  }
);

// 其他路由保持不变...

export default router;