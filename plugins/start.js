// Start Command Plugin
const styles = require('../utils/styles');

module.exports = (bot) => {
    bot.onText(/\/start/, (msg) => {
        const firstName = msg.from.first_name || 'User';

        const startText = `👑━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━👑
🐺🔥 <b>T20 WOLF CONTROL BOT</b> 🔥🐺
👑━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━👑

👋 Welcome, <b>${firstName}</b>!
I'm your advanced Telegram control bot.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎬 <b>MOVIE HUB</b> — New Feature!
  🍿 /movies — Browse & download movies
  🔍 /moviesearch — Search any movie
  📺 /moviecat — Browse by category
  🔥 /latestmovies — Latest releases
  📈 /trending — Trending now
  📀 /moviehelp — Download guide

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 <b>AI CHATBOT</b>
  💬 /chat — Talk to T20 WOLF AI
  🐺 /chatbot — AI help menu

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 <b>GROUP MANAGEMENT</b>
  🚫 /kick  ⛔ /ban  🔇 /mute
  ✅ /unban  🔊 /unmute  🗑️ /delete
  📌 /pin  ⚠️ /warn  ⏱️ /timeout

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎮 <b>FUN COMMANDS</b>
  🎱 /8ball  🎲 /roll  🪙 /flip
  🎯 /choose  😂 /joke  ⭐ /rate

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 <b>INFO & UTILITY</b>
  🆔 /id  👤 /userinfo  📊 /stats
  👥 /groupinfo  👥 /members  🏓 /ping

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📢 <b>CHANNEL</b>
  📝 /post  📡 /broadcast
  📅 /autopost — Auto content posting

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ <b>SETTINGS</b>
  ⚙️ /settings  🌐 /setlang
  🛡️ /antispam  📋 /rules  /setrules

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 Type /help for detailed info
📖 Type /commands for full list
👑 <i>Master: ARNOLD T20</i>`;

        bot.sendMessage(msg.chat.id, startText, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '🎬 Movie Hub', callback_data: 'movie_menu' },
                        { text: '🤖 AI Chat', callback_data: 'chatbot_info' }
                    ],
                    [
                        { text: '📖 All Commands', callback_data: 'show_commands' },
                        { text: '⚙️ Settings', callback_data: 'show_settings' }
                    ],
                    [
                        { text: '🌐 BlazeMovieHub', url: 'https://blazemoviehub.t20tech.site' }
                    ]
                ]
            }
        });
    });

    // Handle start menu callbacks
    bot.on('callback_query', async (query) => {
        const data = query.data;

        try {
            if (data === 'chatbot_info') {
                const text = `🤖 <b>T20 WOLF AI Chatbot</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 Talk to our advanced AI chatbot!

<b>How to use:</b>
• <code>/chat hello</code> — Start a conversation
• DM me directly — Auto chat mode
• Ask me anything — I'll respond intelligently

🐺 Powered by T20 WOLF AI`;

                await bot.answerCallbackQuery(query.id);
                await bot.sendMessage(query.message.chat.id, text, { parse_mode: 'HTML' });

            } else if (data === 'show_commands') {
                await bot.answerCallbackQuery(query.id);
                await bot.sendMessage(query.message.chat.id,
                    '📖 Use <code>/commands</code> to see the full command list!', { parse_mode: 'HTML' });

            } else if (data === 'show_settings') {
                await bot.answerCallbackQuery(query.id);
                await bot.sendMessage(query.message.chat.id,
                    '⚙️ Use <code>/settings</code> to view and configure settings!', { parse_mode: 'HTML' });
            }
        } catch (err) {
            if (!err.message.includes('message is not modified')) {
                console.error('Start callback error:', err.message);
            }
            try { await bot.answerCallbackQuery(query.id); } catch (_) {}
        }
    });
};
