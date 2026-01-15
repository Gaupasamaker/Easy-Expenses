import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import * as XPS from 'xlsx';
import { format } from 'date-fns';

export const ExportService = {
    exportTripData: async (trip, expenses) => {
        const zip = new JSZip();

        // 1. Create Excel Data
        const excelData = expenses.map(e => ({
            Date: e.date ? format(e.date, 'yyyy-MM-dd') : '',
            Merchant: e.merchant,
            Category: e.category,
            Amount: parseFloat(e.amount),
            Currency: e.currency || 'USD', // Default for now
            Description: e.description || '',
            Receipt: e.receiptUrl ? `receipts/${e.id}_receipt.jpg` : 'No Receipt'
        }));

        const worksheet = XPS.utils.json_to_sheet(excelData);
        const workbook = XPS.utils.book_new();
        XPS.utils.book_append_sheet(workbook, worksheet, "Expenses");

        // Write Excel to buffer
        const excelBuffer = XPS.write(workbook, { bookType: 'xlsx', type: 'array' });
        zip.file(`Expenses_${trip.name.replace(/\s+/g, '_')}.xlsx`, excelBuffer);

        // 2. Fetch and add Receipt Images
        const imgFolder = zip.folder("receipts");
        const promises = expenses
            .filter(e => e.receiptUrl)
            .map(async (e) => {
                try {
                    const response = await fetch(e.receiptUrl);
                    const blob = await response.blob();
                    // We'll guess extension or default to jpg
                    imgFolder.file(`${e.id}_receipt.jpg`, blob);
                } catch (err) {
                    console.error(`Failed to download receipt for ${e.id}`, err);
                }
            });

        await Promise.all(promises);

        // 3. Generate and Save Zip
        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, `${trip.name}_Report.zip`);
    }
};
