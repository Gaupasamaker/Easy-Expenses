import { GoogleGenerativeAI } from "@google/generative-ai";

export const GeminiService = {
    analyzeReceipt: async (imageFile) => {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

        if (!apiKey) {
            console.error("Debug: Key is missing at runtime.");
            throw new Error("API Key missing. Please check .env and restart.");
        }

        // Initialize at runtime to ensure key is loaded
        const genAI = new GoogleGenerativeAI(apiKey);

        // Trying gemini-2.0-flash-exp as 1.5-flash seems 404 for this key/version
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        // Convert file to base64
        const base64Image = await fileToGenerativePart(imageFile);

        const prompt = `
      Analyze this image of a receipt. Extract the following information in JSON format only:
      - amount: number (total amount)
      - currency: string (e.g., USD, EUR) - infer from symbol if possible
      - date: string (format YYYY-MM-DD)
      - merchant: string (name of the place)
      - category: string (one of: food, transport, accommodation, flight, shopping, other). Infer based on merchant and items.
      - description: string (brief summary of items)

      If some fields are missing or unclear, make a best guess or leave null. 
      Return ONLY raw JSON, no code blocks.
    `;

        try {
            const result = await model.generateContent([prompt, base64Image]);
            const response = await result.response;
            const text = response.text();

            // Clean up markdown code blocks if present
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonStr);
        } catch (error) {
            console.error("Gemini analysis failed:", error);
            throw error;
        }
    }
};

async function fileToGenerativePart(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Data = reader.result.split(',')[1];
            resolve({
                inlineData: {
                    data: base64Data,
                    mimeType: file.type
                },
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
