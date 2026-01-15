import React, { createContext, useContext, useState, useEffect } from 'react';

const CURRENCIES = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso' },
    { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
];

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
    const [currency, setCurrencyState] = useState(() => {
        const saved = localStorage.getItem('selectedCurrency');
        return saved ? JSON.parse(saved) : CURRENCIES[0]; // Default USD
    });

    const setCurrency = (currencyCode) => {
        const selected = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];
        setCurrencyState(selected);
        localStorage.setItem('selectedCurrency', JSON.stringify(selected));
    };

    // Format a number as currency
    const formatMoney = (amount) => {
        const num = parseFloat(amount);
        if (isNaN(num)) return `${currency.symbol}0`;
        return `${currency.symbol}${num.toFixed(2)}`;
    };

    // Short format (no decimals for large numbers)
    const formatMoneyShort = (amount) => {
        const num = parseFloat(amount);
        if (isNaN(num)) return `${currency.symbol}0`;
        if (num >= 1000) {
            return `${currency.symbol}${Math.round(num).toLocaleString()}`;
        }
        return `${currency.symbol}${num.toFixed(0)}`;
    };

    return (
        <CurrencyContext.Provider value={{
            currency,
            setCurrency,
            currencies: CURRENCIES,
            formatMoney,
            formatMoneyShort
        }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}
