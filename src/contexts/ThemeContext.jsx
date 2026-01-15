import React, { createContext, useContext, useState, useEffect } from 'react';

const THEMES = {
    light: 'light',
    dark: 'dark',
    system: 'system'
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [themePreference, setThemePreference] = useState(() => {
        return localStorage.getItem('theme') || THEMES.system;
    });

    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const updateTheme = () => {
            let shouldBeDark = false;

            if (themePreference === THEMES.dark) {
                shouldBeDark = true;
            } else if (themePreference === THEMES.system) {
                shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            }

            setIsDark(shouldBeDark);

            if (shouldBeDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };

        updateTheme();

        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', updateTheme);

        return () => mediaQuery.removeEventListener('change', updateTheme);
    }, [themePreference]);

    const setTheme = (theme) => {
        setThemePreference(theme);
        localStorage.setItem('theme', theme);
    };

    return (
        <ThemeContext.Provider value={{
            theme: themePreference,
            setTheme,
            isDark,
            themes: THEMES
        }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
