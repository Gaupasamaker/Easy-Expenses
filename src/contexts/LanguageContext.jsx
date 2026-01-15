import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

const SUPPORTED_LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
];

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [language, setLanguageState] = useState(() => {
        const saved = localStorage.getItem('language');
        if (saved) return saved;
        // Detect browser language
        const browserLang = navigator.language.split('-')[0];
        return SUPPORTED_LANGUAGES.some(l => l.code === browserLang) ? browserLang : 'en';
    });

    const setLanguage = (code) => {
        setLanguageState(code);
        localStorage.setItem('language', code);
        document.documentElement.lang = code;
    };

    // Set document language on mount
    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    // Translation function
    const t = (key, replacements = {}) => {
        let text = translations[language]?.[key] || translations['en']?.[key] || key;

        // Replace placeholders like {percent} with actual values
        Object.keys(replacements).forEach(placeholder => {
            text = text.replace(`{${placeholder}}`, replacements[placeholder]);
        });

        return text;
    };

    return (
        <LanguageContext.Provider value={{
            language,
            setLanguage,
            languages: SUPPORTED_LANGUAGES,
            t
        }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
