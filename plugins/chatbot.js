// Chatbot Plugin
// AI-powered conversational responses using external API

const axios = require('axios');
const styles = require('../utils/styles');

// Function to get AI response from external API
async function getAIResponse(message) {
    try {
        const response = await axios.post('https://t20-classic-ai-chat.vercel.app/api/chat', {
            message: message,
            userId: 'telegram_bot_user'
        }, {
            timeout: 10000, // 10 second timeout
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'T20-Control-Bot/1.0'
            }
        });

        if (response.data && response.data.response) {
            return response.data.response;
        }

        // Fallback if API doesn't return expected format
        return "🤖 I'm processing your message... Please try again in a moment!";

    } catch (error) {
        console.error('Chatbot API error:', error.message);

        // Fallback responses for common cases when API fails
        const text = message.toLowerCase().trim();

        if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
            return "Hello! 👋 I'm your T20 Control Bot. My AI brain is currently connecting - please try again in a moment!";
        }

        if (text.includes('how are you')) {
            return "I'm doing great! 🤖 Just fine-tuning my AI connections. How can I help you today?";
        }

        if (text.includes('what can you do') || text.includes('help')) {
            return "I can help with many things! Use /menu to see all my commands, or /chatbot for AI chat features. My full AI brain is connecting soon! 🚀";
        }

        if (text.includes('who made you') || text.includes('who created you')) {
            return "I was created by ARNOLD T20! 👑 The ultimate bot developer. My AI features are powered by advanced technology.";
        }

        if (text.includes('what is your name')) {
            return "I'm T20 Control Bot! 🤖 Your royal assistant with AI capabilities. Currently connecting to my advanced AI systems.";
        }

        // Generic fallback
        return "🤖 I'm currently connecting to my AI systems at t20-classic-ai-chat.vercel.app. Please try again in a moment, or use /menu for all my available commands!";
    }
}

module.exports = (bot) => {
    console.log('🤖 Chatbot loaded');

    // Handle chatbot conversations
    bot.onText(/\/chat (.+)/, async (msg, match) => {
        const query = match[1];
        const response = await getAIResponse(query);

        const reply = `${styles.header('🤖 T20 Chatbot', '💬')}
<i>Your AI Assistant</i>

<b>You:</b> ${query}

<b>T20 AI:</b> ${response}

${styles.dividerShort}
💡 <i>Try asking me questions or type /menu for commands!</i>`;

        await bot.sendMessage(msg.chat.id, reply, { parse_mode: 'HTML' });
    });

    // Handle direct messages to bot (private chats)
    bot.on('message', async (msg) => {
        // Only respond in private chats, not groups
        if (msg.chat.type === 'private' && !msg.text?.startsWith('/')) {
            const response = await getAIResponse(msg.text || '');

            const reply = `${styles.header('🤖 T20 Chatbot', '💬')}
<i>AI Conversation</i>

<b>You:</b> ${msg.text}

<b>T20 AI:</b> ${response}

${styles.dividerShort}
💡 <i>Type /menu for commands or ask me anything!</i>`;

            await bot.sendMessage(msg.chat.id, reply, { parse_mode: 'HTML' });
        }
    });

    // Chatbot help command
    bot.onText(/\/chatbot/, async (msg) => {
const helpText = `${styles.header('🤖 T20 AI Chatbot', '🧠')}
<i>AI Integration In Progress</i>

${styles.section('💬', 'Chat Commands', [
    styles.listItem('💭', '/chat [message] — Talk to AI (connecting...)'),
    styles.listItem('🤖', 'DM me directly — Auto chat mode'),
    styles.listItem('❓', 'Ask questions — Smart responses'),
    styles.listItem('🆘', '/chatbot — This help menu')
])}

${styles.section('🔄', 'AI Status', [
    styles.listItem('🌐', 'API: t20-classic-ai-chat.vercel.app'),
    styles.listItem('⏳', 'Status: Connecting to AI systems'),
    styles.listItem('✅', 'Fallback: Smart responses active'),
    styles.listItem('🚀', 'Full AI: Coming soon!')
])}

${styles.dividerLong}
💡 <i>AI integration is being established. For now, enjoy smart conversational responses!</i>
${styles.menuFooter('ARNOLD T20')}`;

        await bot.sendMessage(msg.chat.id, helpText, { parse_mode: 'HTML' });
    });
};