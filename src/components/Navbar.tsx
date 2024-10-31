import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t } = useTranslation();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Shield className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">ContractGuard</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              {t('common.login')}
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              {t('common.register')}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;