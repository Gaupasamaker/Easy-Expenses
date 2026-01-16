import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const ExportService = {
    // Existing Excel + ZIP export
    exportTripData: async (trip, expenses, currency = { symbol: '€', code: 'EUR' }) => {
        const zip = new JSZip();

        // 1. Create Excel Data
        const excelData = expenses.map(e => ({
            Date: e.date ? format(e.date, 'yyyy-MM-dd') : '',
            Merchant: e.merchant,
            Category: e.category,
            Amount: parseFloat(e.amount),
            Currency: currency.code,
            Description: e.description || '',
            Receipt: e.receiptUrl ? `receipts/${e.id}_receipt.jpg` : 'No Receipt'
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

        // Write Excel to buffer
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        zip.file(`Expenses_${trip.name.replace(/\s+/g, '_')}.xlsx`, excelBuffer);

        // 2. Fetch and add Receipt Images
        const imgFolder = zip.folder("receipts");
        const promises = expenses
            .filter(e => e.receiptUrl)
            .map(async (e) => {
                try {
                    const response = await fetch(e.receiptUrl);
                    const blob = await response.blob();
                    imgFolder.file(`${e.id}_receipt.jpg`, blob);
                } catch (err) {
                    console.error(`Failed to download receipt for ${e.id}`, err);
                }
            });

        await Promise.all(promises);

        // 3. Generate and Save Zip
        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, `${trip.name}_Report.zip`);
    },

    // NEW: PDF Report generation
    exportToPDF: async (trip, expenses, currency = { symbol: '€', code: 'EUR' }, t = (key) => key) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Helper to safely convert Firestore Timestamp or Date to native Date
        const toDate = (dateValue) => {
            if (!dateValue) return null;
            if (typeof dateValue.toDate === 'function') return dateValue.toDate(); // Firestore Timestamp
            if (dateValue instanceof Date) return dateValue;
            return new Date(dateValue); // Try parsing string
        };

        // Helper to safely format dates
        const safeFormat = (dateValue, fmt) => {
            const date = toDate(dateValue);
            if (!date || isNaN(date.getTime())) return '-';
            return format(date, fmt);
        };

        // Colors matching the app theme
        const primaryColor = [249, 115, 22]; // Orange
        const secondaryColor = [236, 72, 153]; // Pink

        // ========== HEADER ==========
        // Gradient-like header background
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, pageWidth, 45, 'F');

        // App name
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('EasyExpenses AI', 14, 20);

        // Trip name
        doc.setFontSize(16);
        doc.setFont('helvetica', 'normal');
        doc.text(trip.name, 14, 32);

        // Destination if available
        if (trip.destination) {
            doc.setFontSize(12);
            doc.text(trip.destination, 14, 40);
        }

        // Date range on the right
        doc.setFontSize(10);
        const startDate = safeFormat(trip.startDate, 'dd/MM/yyyy');
        const endDate = safeFormat(trip.endDate, 'dd/MM/yyyy');
        doc.text(`${startDate} - ${endDate}`, pageWidth - 14, 32, { align: 'right' });

        // ========== SUMMARY BOX ==========
        const totalSpent = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
        const budget = parseFloat(trip.budget) || 0;
        const remaining = budget - totalSpent;

        doc.setFillColor(245, 245, 245);
        doc.roundedRect(14, 52, pageWidth - 28, 30, 3, 3, 'F');

        doc.setTextColor(100, 100, 100);
        doc.setFontSize(10);
        doc.text(t('budget') || 'Budget', 24, 62);
        doc.text(t('total_spent') || 'Total Spent', pageWidth / 2, 62, { align: 'center' });
        doc.text(t('remaining') || 'Remaining', pageWidth - 24, 62, { align: 'right' });

        doc.setTextColor(50, 50, 50);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`${currency.symbol}${budget.toFixed(2)}`, 24, 74);
        doc.text(`${currency.symbol}${totalSpent.toFixed(2)}`, pageWidth / 2, 74, { align: 'center' });

        // Remaining in color (green if positive, red if negative)
        if (remaining >= 0) {
            doc.setTextColor(34, 197, 94); // Green
        } else {
            doc.setTextColor(239, 68, 68); // Red
        }
        doc.text(`${currency.symbol}${remaining.toFixed(2)}`, pageWidth - 24, 74, { align: 'right' });

        // ========== EXPENSES TABLE ==========
        doc.setTextColor(50, 50, 50);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text(t('expenses') || 'Expenses', 14, 96);

        // Prepare table data
        const tableData = expenses.map(e => [
            safeFormat(e.date, 'dd/MM/yyyy'),
            e.merchant || '-',
            e.category || '-',
            e.description ? (e.description.length > 30 ? e.description.substring(0, 30) + '...' : e.description) : '-',
            `${currency.symbol}${parseFloat(e.amount || 0).toFixed(2)}`
        ]);

        autoTable(doc, {
            startY: 100,
            head: [[
                t('date') || 'Date',
                t('merchant') || 'Merchant',
                t('category') || 'Category',
                t('description') || 'Description',
                t('amount') || 'Amount'
            ]],
            body: tableData,
            theme: 'striped',
            headStyles: {
                fillColor: primaryColor,
                textColor: [255, 255, 255],
                fontStyle: 'bold'
            },
            styles: {
                fontSize: 9,
                cellPadding: 4
            },
            columnStyles: {
                0: { cellWidth: 25 },
                1: { cellWidth: 40 },
                2: { cellWidth: 30 },
                3: { cellWidth: 'auto' },
                4: { cellWidth: 30, halign: 'right' }
            },
            foot: [[
                '', '', '',
                { content: 'TOTAL', styles: { fontStyle: 'bold', halign: 'right' } },
                { content: `${currency.symbol}${totalSpent.toFixed(2)}`, styles: { fontStyle: 'bold', halign: 'right' } }
            ]],
            footStyles: {
                fillColor: [245, 245, 245],
                textColor: [50, 50, 50]
            }
        });

        // ========== CATEGORY BREAKDOWN ==========
        const finalY = doc.lastAutoTable.finalY + 15;

        // Check if we need a new page
        if (finalY > doc.internal.pageSize.getHeight() - 60) {
            doc.addPage();
        }

        const categoryTotals = expenses.reduce((acc, e) => {
            const cat = e.category || 'Other';
            acc[cat] = (acc[cat] || 0) + parseFloat(e.amount || 0);
            return acc;
        }, {});

        const sortedCategories = Object.entries(categoryTotals)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6); // Top 6 categories

        if (sortedCategories.length > 0) {
            const catY = finalY > doc.internal.pageSize.getHeight() - 60 ? 20 : finalY;

            doc.setTextColor(50, 50, 50);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.text(t('by_category') || 'By Category', 14, catY);

            // Simple bar chart
            const barStartY = catY + 10;
            const barHeight = 8;
            const maxBarWidth = pageWidth - 80;
            const maxValue = Math.max(...sortedCategories.map(c => c[1]));

            sortedCategories.forEach(([category, amount], index) => {
                const y = barStartY + (index * (barHeight + 6));
                const barWidth = (amount / maxValue) * maxBarWidth;

                // Category name
                doc.setFontSize(9);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(100, 100, 100);
                doc.text(category, 14, y + 6);

                // Bar
                const colorMix = index / sortedCategories.length;
                doc.setFillColor(
                    Math.round(primaryColor[0] + (secondaryColor[0] - primaryColor[0]) * colorMix),
                    Math.round(primaryColor[1] + (secondaryColor[1] - primaryColor[1]) * colorMix),
                    Math.round(primaryColor[2] + (secondaryColor[2] - primaryColor[2]) * colorMix)
                );
                doc.roundedRect(50, y, barWidth, barHeight, 2, 2, 'F');

                // Amount
                doc.setTextColor(50, 50, 50);
                doc.text(`${currency.symbol}${amount.toFixed(2)}`, pageWidth - 14, y + 6, { align: 'right' });
            });
        }

        // ========== FOOTER ==========
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);

        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.text(
                `Generated by EasyExpenses AI • ${format(new Date(), 'dd/MM/yyyy HH:mm')} • Page ${i} of ${pageCount}`,
                pageWidth / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'center' }
            );
        }

        // Save PDF
        doc.save(`${trip.name}_Report.pdf`);
    }
};
