import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyAHb3p8sCey3PU4lujl_cger43atkOxinQ";
const genAI = new GoogleGenerativeAI(API_KEY);

async function check() {
    const models = ["gemini-2.0-flash", "gemini-1.5-flash-latest", "gemini-1.0-pro"];

    for (const m of models) {
        console.log(`\nTesting ${m}...`);
        try {
            const model = genAI.getGenerativeModel({ model: m });
            await model.generateContent("Test");
            console.log(`SUCCESS with ${m}`);
        } catch (e) {
            console.log(`FAILED ${m}: ${e.message}`);
        }
    }
}

check();
