import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n';

// Wait for i18n initialization before rendering
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);