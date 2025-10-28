import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    // This is a fallback for development environments where the key might not be set.
    // In the target environment, process.env.API_KEY is expected to be available.
    console.warn("API_KEY is not set. Using a placeholder key.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || 'placeholder' });

export const getFortune = async (cardName: string): Promise<string> => {
    if (!API_KEY) {
        return "தெய்வீக ஆற்றல்கள் மேகமூட்டத்துடன் உள்ளன, ஏனெனில் ஆரக்கிளுடனான இணைப்பு நிறுவப்படவில்லை. (API விசை இல்லை).";
    }

    const prompt = `நீங்கள் ஒரு மாய டாரோ வாசிப்பாளர். பயனர் "${cardName}" அட்டையை எடுத்துள்ளார். அவர்களின் நாளுக்கான குறுகிய, நுண்ணறிவுள்ள மற்றும் ஊக்கமளிக்கும் அதிர்ஷ்டத்தை தமிழில் வழங்கவும். ஞானமான மற்றும் சற்றே மர்மமான தொனியில் பேசவும். இன்றைய திறனை மையமாகக் கொண்டு செய்தியை நேர்மறையாக வைத்திருங்கள். பதிலை 2-4 வாக்கியங்களுக்குள் மட்டுப்படுத்தவும்.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error fetching fortune from Gemini API:", error);
        return "இந்த நேரத்தில் தெய்வீக ஆற்றல்கள் மேகமூட்டத்துடன் உள்ளன. தயவுசெய்து பின்னர் மீண்டும் முயற்சிக்கவும்.";
    }
};