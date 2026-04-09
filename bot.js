// T20 Control Bot - Main Entry Point
// Modular plugin-based architecture

const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const { SocksProxyAgent } = require('socks-proxy-agent');
const pluginLoader = require('./plugins');
const styles = require('./utils/styles');
const blogFetcher = require('./utils/blogFetcher');
const { TOKEN, CHANNEL_ID, ADMIN_IDS, PROXY_URL } = require('./config');

const app = express();
const PORT = process.env.PORT || 5000;

if (!TOKEN) {
    console.error('Missing TELEGRAM_TOKEN environment variable. Set TELEGRAM_TOKEN and restart the bot.');
    process.exit(1);
}

const PROXY_AGENT = PROXY_URL ? new SocksProxyAgent(PROXY_URL) : null;

// Health check endpoint for Heroku
app.get('/', (req, res) => {
    res.status(200).send('🤖 T20 Bot is alive!');
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', bot: 'T20 Control Bot', timestamp: new Date().toISOString() });
});

// Start HTTP server
const server = app.listen(PORT, () => {
    console.log(`🌐 HTTP Server listening on port ${PORT}`);
});

// Helper function to check if user is admin
const isAdmin = (userId) => {
    return ADMIN_IDS.length === 0 || ADMIN_IDS.includes(userId);
};

// Store groups and bot startup time
let groups = [];
const botStartTime = Date.now(); // Track when bot starts

// Save groups when messages are received
const handleGroupMessages = (bot) => {
    bot.on("message", (msg) => {
        if (msg.chat.type === "group" || msg.chat.type === "supergroup") {
            if (!groups.includes(msg.chat.id)) {
                groups.push(msg.chat.id);
            }
        }
    });
};

// Create bot
const bot = new TelegramBot(TOKEN, {
    polling: false,
    request: PROXY_AGENT ? { agent: PROXY_AGENT } : undefined
});

// Authenticate and start bot
bot.getMe()
    .then((me) => {
        console.log('\n' + '═'.repeat(50));
        console.log('🚀 T20 CONTROL BOT ONLINE');
        console.log('═'.repeat(50));
        console.log(`Bot Name: @${me.username}`);
        console.log(`Bot ID: ${me.id}`);
        console.log(`Status: 🟢 Connected`);
        console.log(`Channel: ${CHANNEL_ID}`);
        console.log(`Admin Mode: ${ADMIN_IDS.length > 0 ? '✅ Enabled (' + ADMIN_IDS.length + ' admins)' : '⚠️ Disabled'}`);
        console.log(`Proxy: ${PROXY_URL ? '✅ ' + PROXY_URL : '❌ Direct connection'}`);
        console.log('═'.repeat(50) + '\n');

        // Start polling
        bot.startPolling();

        // Error handlers
        bot.on('error', (err) => {
            console.error('Bot error:', err);
        });

        bot.on("polling_error", (err) => {
            console.error("Polling error:", err);
            if (err && err.response && err.response.body) {
                console.error('Telegram response body:', JSON.stringify(err.response.body, null, 2));
            }
        });

        // Setup group handling
        handleGroupMessages(bot);

        // Load plugins
        const plugins = pluginLoader(bot, isAdmin, CHANNEL_ID, ADMIN_IDS, groups, botStartTime);

        // Blog fetcher
        console.log('📚 Initializing blog fetcher from T20 Tech sources...');
        blogFetcher.fetchAllBlogs(true)
            .then((blogs) => {
                console.log(`✅ Blog fetcher initialized with ${blogs.length} blogs`);
                setInterval(() => {
                    blogFetcher.fetchAllBlogs(true)
                        .then((newBlogs) => {
                            console.log(`🔄 Blog cache refreshed: ${newBlogs.length} blogs available`);
                        })
                        .catch(err => {
                            console.warn(`⚠️ Blog refresh failed: ${err.message}`);
                        });
                }, 12 * 60 * 60 * 1000);
            })
            .catch((err) => {
                console.warn(`⚠️ Blog fetcher initialization failed: ${err.message}`);
                console.log('📝 Bot will continue with tech tips and questions only');
            });

    })
    .catch((err) => {
        console.error('❌ Failed to authenticate bot token:', err.message || err);
        if (err.response && err.response.body) {
            console.error('Telegram error response:', err.response.body);
        }
        process.exit(1);
    });

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('SIGINT', () => {
    console.log('🔌 SIGINT received, shutting down gracefully...');
    try {
        bot.stopPolling();
        server.close(() => {
            console.log('✅ HTTP server closed');
            process.exit(0);
        });
    } catch (err) {
        console.error('Error stopping bot polling:', err);
        process.exit(1);
    }
});

process.on('SIGTERM', () => {
    console.log('🔌 SIGTERM received, shutting down gracefully...');
    try {
        bot.stopPolling();
        server.close(() => {
            console.log('✅ HTTP server closed');
            process.exit(0);
        });
    } catch (err) {
        console.error('Error stopping bot polling:', err);
        process.exit(1);
    }
});