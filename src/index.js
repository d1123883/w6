const { chat } = require('./agent');

async function run() {
    const questions = [
        "What's the weather in Taipei like today?",
        "How about Tokyo?",
        "And New York?"
    ];

    console.log("=== Gemini Weather Agent Starting ===\n");

    for (const question of questions) {
        try {
            const answer = await chat(question);
            console.log(`\n--- Result for "${question}" ---`);
            console.log(answer);
            console.log("----------------------------------\n");
        } catch (error) {
            console.error(`Error processing question "${question}":`, error.message);
        }
    }

    console.log("=== Gemini Weather Agent Finished ===");
}

run();
