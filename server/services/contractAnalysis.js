import natural from 'natural';
import { getDb } from '../database/init.js';

const tokenizer = new natural.WordTokenizer();
const tfidf = new natural.TfIdf();

// Risk patterns to look for in contracts
const riskPatterns = {
  payment: [
    '付款延迟', '违约金', '预付款', '分期付款', '支付条件',
    '付款期限', '支付方式', '货币风险', '汇率风险'
  ],
  delivery: [
    '交付延迟', '验收标准', '质量要求', '交付时间', '运输风险',
    '不可抗力', '交付地点', '验收程序'
  ],
  legal: [
    '违约责任', '争议解决', '管辖法院', '适用法律', '知识产权',
    '保密条款', '终止条件', '解除条件'
  ],
  financial: [
    '价格调整', '税费承担', '费用分摊', '保证金', '赔偿责任',
    '保险要求', '财务担保'
  ]
};

// Risk level assessment criteria
const riskLevels = {
  HIGH: { threshold: 0.7, label: 'high' },
  MEDIUM: { threshold: 0.4, label: 'medium' },
  LOW: { threshold: 0, label: 'low' }
};

export async function analyzeContract(contractId, content) {
  try {
    const db = await getDb();
    const risks = [];
    
    // Tokenize contract content
    const tokens = tokenizer.tokenize(content);
    tfidf.addDocument(tokens);

    // Analyze different risk categories
    for (const [category, patterns] of Object.entries(riskPatterns)) {
      let riskScore = 0;
      let riskFactors = [];

      patterns.forEach(pattern => {
        const score = calculatePatternScore(content, pattern);
        if (score > 0) {
          riskScore += score;
          riskFactors.push(pattern);
        }
      });

      // Normalize risk score
      riskScore = Math.min(riskScore / patterns.length, 1);

      // Determine risk level
      const riskLevel = determineRiskLevel(riskScore);

      if (riskFactors.length > 0) {
        // Save risk assessment
        const result = await db.run(
          `INSERT INTO risk_assessments (
            contract_id, risk_level, risk_factor, description
          ) VALUES (?, ?, ?, ?)`,
          [
            contractId,
            riskLevel,
            category,
            `发现${riskFactors.length}个风险因素：${riskFactors.join('、')}`
          ]
        );

        risks.push({
          id: result.lastID,
          category,
          level: riskLevel,
          factors: riskFactors,
          score: riskScore
        });
      }
    }

    // Analyze key dates
    const datePatterns = extractDates(content);
    for (const { date, description } of datePatterns) {
      await db.run(
        `INSERT INTO key_dates (contract_id, event_name, event_date)
         VALUES (?, ?, ?)`,
        [contractId, description, date]
      );
    }

    return {
      risks,
      keyDates: datePatterns
    };
  } catch (error) {
    console.error('Contract analysis error:', error);
    throw error;
  }
}

function calculatePatternScore(content, pattern) {
  const regex = new RegExp(pattern, 'g');
  const matches = content.match(regex);
  return matches ? matches.length * 0.2 : 0;
}

function determineRiskLevel(score) {
  if (score >= riskLevels.HIGH.threshold) return riskLevels.HIGH.label;
  if (score >= riskLevels.MEDIUM.threshold) return riskLevels.MEDIUM.label;
  return riskLevels.LOW.label;
}

function extractDates(content) {
  const datePatterns = [
    {
      regex: /(\d{4}[-/年]\d{1,2}[-/月]\d{1,2}[日]?).*?(?:付款|支付|交付|完成|终止|解除|验收|开始|结束)/g,
      type: '关键时间节点'
    },
    {
      regex: /(?:付款|支付|交付|完成|终止|解除|验收|开始|结束).*?(\d{4}[-/年]\d{1,2}[-/月]\d{1,2}[日]?)/g,
      type: '关键时间节点'
    }
  ];

  const dates = [];
  datePatterns.forEach(({ regex, type }) => {
    let match;
    while ((match = regex.exec(content)) !== null) {
      const dateStr = match[1];
      const description = match[0].replace(dateStr, '').trim();
      dates.push({
        date: formatDate(dateStr),
        description: `${type}: ${description}`
      });
    }
  });

  return dates;
}

function formatDate(dateStr) {
  // Convert Chinese date format to ISO format
  return dateStr
    .replace(/年|月|日/g, '-')
    .replace(/-+$/, '')
    .replace(/(\d{4})-(\d{1,2})-(\d{1,2})/, (_, y, m, d) => 
      `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
    );
}