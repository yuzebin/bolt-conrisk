import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import ContractList from './pages/ContractList';
import ContractUpload from './pages/ContractUpload';
import ContractAnalysis from './pages/ContractAnalysis';
import OrganizationSettings from './pages/OrganizationSettings';

function App() {
  return (
    <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>}>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/contracts" element={<ContractList />} />
            <Route path="/contracts/upload" element={<ContractUpload />} />
            <Route path="/contracts/:id/analysis" element={<ContractAnalysis />} />
            <Route path="/organization" element={<OrganizationSettings />} />
          </Routes>
        </div>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;