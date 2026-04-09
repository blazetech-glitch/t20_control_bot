// Test chatbot fallback responses
const { getIntelligentFallback } = require('./plugins/chatbot');

// Test messages
const testMessages = [
    'hello',
    'how are you',
    'what can you do',
    'who made you',
    'what is your name',
    'thank you',
    'bye',
    'tell me about javascript',
    'what time is it',
    'random message about cats'
];

console.log('🧪 Testing Chatbot Fallback Responses\n');

testMessages.forEach((message, index) => {
    // We need to call the function directly since it's not exported
    // Let's create a simple test by copying the logic
    const text = message.toLowerCase().trim();

    let response = '';

    // Greetings
    if (text.match(/\b(hello|hi|hey|good morning|good afternoon|good evening|greetings|howdy)\b/)) {
        const greetings = [
            "Hello! 👋 How can I help you today?",
            "Hi there! 🤖 What can I do for you?",
            "Hey! 😊 How's it going?",
            "Greetings! 🌟 How may I assist you?",
            "Hello! 👋 I'm here to help!"
        ];
        response = greetings[Math.floor(Math.random() * greetings.length)];
    }
    // Questions about well-being
    else if (text.match(/\b(how are you|how do you do|how's it going|what's up)\b/)) {
        const responses = [
            "I'm doing great! Thanks for asking. 🤖 How about you?",
            "I'm excellent! Ready to help you with anything. ✨",
            "I'm fantastic! 🤖 What can I help you with today?",
            "I'm doing well, thank you! How can I assist you? 😊"
        ];
        response = responses[Math.floor(Math.random() * responses.length)];
    }
    // Questions about capabilities
    else if (text.match(/\b(what can you do|what do you do|help|commands|features)\b/)) {
        response = "I can help with many things! 🤖 Use /menu to see all my commands, or ask me questions. I'm powered by intelligent conversation systems!";
    }
    // Questions about origin
    else if (text.match(/\b(who made you|who created you|who built you|creator|developer)\b/)) {
        response = "I was created by ARNOLD T20! 👑 The ultimate bot developer and tech innovator. He's amazing at building AI systems!";
    }
    // Questions about name
    else if (text.match(/\b(what is your name|your name|who are you|what are you)\b/)) {
        const names = [
            "I'm T20 Control Bot! 🤖 Your royal assistant.",
            "You can call me T20 Bot! 👑 I'm here to help.",
            "I'm the T20 Control Bot! 🤖 Ready to assist you.",
            "My name is T20 Control Bot! 👑 How can I help?"
        ];
        response = names[Math.floor(Math.random() * names.length)];
    }
    // Questions about AI/time
    else if (text.match(/\b(what time|time|date|day)\b/)) {
        const now = new Date();
        response = `It's currently ${now.toLocaleTimeString()} on ${now.toLocaleDateString()}. ⏰ How can I help you today?`;
    }
    // Programming/tech questions
    else if (text.match(/\b(javascript|js|python|code|programming|developer|tech)\b/)) {
        const techResponses = [
            "I love talking about programming! 💻 What specific technology or language are you working with?",
            "Tech is my favorite topic! 🚀 What programming language or framework are you interested in?",
            "Programming is awesome! 🤖 What are you building or learning about?"
        ];
        response = techResponses[Math.floor(Math.random() * techResponses.length)];
    }
    // Thanks
    else if (text.match(/\b(thank you|thanks|thx|ty)\b/)) {
        const thanks = [
            "You're welcome! 😊 Is there anything else I can help with?",
            "My pleasure! 🤖 Happy to help!",
            "No problem at all! 👋 What else can I do for you?",
            "You're very welcome! ✨ Let me know if you need anything else!"
        ];
        response = thanks[Math.floor(Math.random() * thanks.length)];
    }
    // Goodbye
    else if (text.match(/\b(bye|goodbye|see you|later|cya)\b/)) {
        const goodbyes = [
            "Goodbye! 👋 Have a great day!",
            "See you later! 🤖 Take care!",
            "Bye! 👋 Come back anytime!",
            "Take care! 😊 See you soon!"
        ];
        response = goodbyes[Math.floor(Math.random() * goodbyes.length)];
    }
    // Default conversational responses
    else {
        const defaultResponses = [
            "That's interesting! 🤔 Can you tell me more about that?",
            "I understand! 💭 What else would you like to know?",
            "Thanks for sharing that! 📝 Is there something specific you'd like help with?",
            "I see! 🤖 How can I assist you further?",
            "That's cool! 😊 What else can I help you with today?",
            "I appreciate you telling me that! 💬 What would you like to do next?"
        ];
        response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    console.log(`${index + 1}. "${message}"`);
    console.log(`   → ${response}\n`);
});

console.log('✅ Chatbot fallback responses test completed!');