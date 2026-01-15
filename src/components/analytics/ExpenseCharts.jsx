import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const CATEGORY_NAMES = {
    'food': 'Food',
    'transport': 'Transport',
    'accommodation': 'Stay',
    'flight': 'Flight',
    'shopping': 'Shop',
    'other': 'Other'
};

export default function ExpenseCharts({ expenses }) {
    // Aggregate by category
    const categoryData = expenses.reduce((acc, curr) => {
        const cat = curr.category?.toLowerCase() || 'other';
        const amount = parseFloat(curr.amount) || 0;

        const existing = acc.find(item => item.id === cat);
        if (existing) {
            existing.value += amount;
        } else {
            acc.push({ id: cat, name: CATEGORY_NAMES[cat] || cat, value: amount });
        }
        return acc;
    }, []);

    // Sort by value desc
    categoryData.sort((a, b) => b.value - a.value);

    if (categoryData.length === 0) return null;

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-64">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Expenses by Category</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                        <Legend layout="vertical" align="right" verticalAlign="middle" />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Adding a Bar Chart for daily spending could be nice too, but maybe overkill for now. Keeping it simple. */}
        </div>
    );
}
