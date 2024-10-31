// API configuration
const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  defaultLanguage: 'zh',
  supportedLanguages: ['en', 'zh', 'ko', 'ja']
};

export default config;