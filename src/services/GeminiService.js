import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key as an environment variable (see "Set up your API key" above)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

export const GeminiService = {
    analyzeReceipt: async (imageFile) => {
        if (!API_KEY) {
            throw new Error("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in .env");
        }

        // Convert file to base64
        const base64Image = await fileToGenerativePart(imageFile);

        // Use the flash model for speed and efficiency
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
