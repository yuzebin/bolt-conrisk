import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'zh', name: '中文' },
  { code: 'en', name: 'English' },
  { code: 'ko', name: '한국어' },
  { code: 'ja', name: '日本語' },
];

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(i18n.language?.split('-')[0] || 'zh');

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setCurrentLang(lng.split('-')[0]);
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  const handleLanguageChange = async (langCode: string) => {
    try {
      await i18n.changeLanguage(langCode);
      document.documentElement.lang = langCode;
      localStorage.setItem('i18nextLng', langCode);
      closeDropdown();
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  const getCurrentLanguageName = () => {
    const lang = languages.find(lang => lang.code === currentLang) || languages[0];
    return lang.name;
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={toggleDropdown}
        className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="h-5 w-5 mr-2" aria-hidden="true" />
        <span className="hidden sm:inline">{getCurrentLanguageName()}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={closeDropdown}
            aria-hidden="true"
          />
          <div
            className="absolute right-0 z-40 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="language-menu"
          >
            <div className="py-1" role="none">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`${
                    currentLang === language.code
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700'
                  } flex w-full items-center px-4 py-2 text-sm hover:bg-gray-50`}
                  role="menuitem"
                >
                  {language.name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;