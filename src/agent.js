const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getWeather, getWeatherDeclaration } = require('./tools/weather');
require('dotenv').config();

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    console.error('Error: GEMINI_API_KEY is not defined in .env or is using the placeholder.');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

// Model configuration with tool calling
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    tools: {
        functionDeclarations: [getWeatherDeclaration]
    }
});

/**
 * Handle a chat request and manage tool calling
 * @param {string} userInput Message from the user
 */
async function chat(userInput) {
    console.log(`[Agent] User asked: "${userInput}"`);
    
    // Start a chat session
    const chatSession = model.startChat();
    
    // Send user message
    let result = await chatSession.sendMessage(userInput);
    let response = result.response;
    
    // Define the available functions for tool calling
    const functions = {
        getWeather: async (args) => await getWeather(args.location)
    };
    
    // Loop to handle tool calls if Gemini needs them
    let callCount = 0;
    while (response.candidates[0].content.parts.some(part => part.functionCall)) {
        if (callCount++ > 5) { // Safety break
            console.warn('[Agent] Too many recursive tool calls. Breaking loop.');
            break;
        }
        
        const contentParts = response.candidates[0].content.parts;
        const toolCalls = contentParts.filter(part => part.functionCall);
        
        const functionResponses = [];
        
        for (const call of toolCalls) {
            const funcName = call.functionCall.name;
            const args = call.functionCall.args;
            
            console.log(`[Agent] Calling tool: ${funcName} with arguments:`, args);
            
            if (functions[funcName]) {
                const funcResult = await functions[funcName](args);
                console.log(`[Agent] Tool ${funcName} returned:`, funcResult);
                
                functionResponses.push({
                    functionResponse: {
                        name: funcName,
                        response: funcResult
                    }
                });
            } else {
                console.warn(`[Agent] Warning: Tool ${funcName} not found.`);
            }
        }
        
        // Send the function response back to Gemini
        result = await chatSession.sendMessage(functionResponses);
        response = result.response;
    }
    
    // Final answer
    const finalAnswer = response.text();
    console.log(`[Agent] Final answer: ${finalAnswer}`);
    return finalAnswer;
}

module.exports = {
    chat
};
