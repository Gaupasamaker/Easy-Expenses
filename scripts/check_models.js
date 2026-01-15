import { GoogleGenerativeAI } from "@google/generative-ai";

// Manually hardcoding the key for this check script since we don't have dotenv setup in this script scope easily
const API_KEY = "AIzaSyAHb3p8sCey3PU4lujl_cger43atkOxinQ";

const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
    try {
        // For listing models, we don't have a direct helper in the simplistic usage often, 
        // but we can try to access the model list if the SDK exposes it.
        // Actually, the JS SDK might not strictly expose listModels easily in the simplified client.
        // Let's try to just Instantiate a model and see if it works, or fallback.
        // But better: The error message said "Call ListModels". 
        // This is usually an admin/management API call, not always on the client instance.

        // Instead of listing (which might require different scopes), let's just try to hit 'gemini-2.0-flash'
        // with a "hello" prompt.

        const candidates = [
            "gemini-2.0-flash",
            "gemini-1.5-flash",
            "gemini-1.5-pro",
            "gemini-pro-vision"
        ];

        for (const modelName of candidates) {
            console.log(`Checking model: ${modelName}...`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello");
                const response = await result.response;
                console.log(`✅ Model ${modelName} is AVAILABLE. Response: ${response.text().substring(0, 20)}...`);
                return; // Found a working one
            } catch (e) {
                console.log(`❌ Model ${modelName} failed: ${e.message.split(' ')[0]}`); // Print short error
            }
        }

    } catch (error) {
        console.error("Script error:", error);
    }
}

listModels();
