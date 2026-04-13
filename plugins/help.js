// Help Command Plugin
const styles = require('../utils/styles');

module.exports = (bot) => {
    bot.onText(/\/help(?:\s+(.+))?/, (msg, match) => {
        const topic = match && match[1] ? match[1].trim().toLowerCase() : null;

        if (topic === 'movies' || topic === 'movie') {
            const movieHelp = `🎬 <b>Movie Commands Help</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${styles.listItem('🍿', '<code>/movies</code> — Main movie menu with full options')}
${styles.listItem('🔍', '<code>/moviesearch &lt;title&gt;</code> — Search any movie or show')}
${styles.listItem('📺', '<code>/moviecat &lt;genre&gt;</code> — Browse by category/genre')}
${styles.listItem('🔥', '<code>/latestmovies</code> — Latest movie releases')}
${styles.listItem('📈', '<code>/trending</code> — Currently trending movies')}
${styles.listItem('⭐', '<code>/toprated</code> — Top rated movies of all time')}
${styles.listItem('📀', '<code>/moviehelp</code> — Full download guide')}

<b>Available Categories:</b>
🎬 Action | 😂 Comedy | 😱 Horror | 💕 Romance
🔫 Thriller | 🚀 Sci-Fi | 🧙 Fantasy | 🎭 Drama
🕵️ Crime | 🌍 Adventure | 🎨 Animation
📽️ Documentary | 🎵 Bollywood | 📺 TV Series
🌟 Hollywood | 🌏 Nollywood

<b>Download Qualities:</b>
📀 4K (2160p) • 🎬 1080p • 📺 720p • 📱 480p • 💾 360p

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 Site: <a href="https://blazemoviehub.t20tech.site">BlazeMovieHub</a>`;

            bot.sendMessage(msg.chat.id, movieHelp, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🎬 Open Movie Menu', callback_data: 'movie_menu' }],
                        [{ text: '🌐 Visit BlazeMovieHub', url: 'https://blazemoviehub.t20tech.site' }]
                    ]
                }
            });
            return;
        }

        if (topic === 'admin') {
            const adminHelp = `🔧 <b>Admin Commands Help</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
All admin commands require admin rights.

${styles.listItem('🚫', '<code>/kick</code> — Kick a user (reply to their message)')}
${styles.listItem('⛔', '<code>/ban</code> — Permanently ban a user (reply)')}
${styles.listItem('✅', '<code>/unban &lt;user_id&gt;</code> — Unban a user by ID')}
${styles.listItem('🔇', '<code>/mute</code> — Mute a user (reply)')}
${styles.listItem('🔊', '<code>/unmute</code> — Unmute a user (reply)')}
${styles.listItem('🗑️', '<code>/delete</code> — Delete a message (reply)')}
${styles.listItem('📌', '<code>/pin</code> — Pin a message (reply)')}
${styles.listItem('📌', '<code>/unpin</code> — Unpin a message (reply)')}
${styles.listItem('📝', '<code>/setdesc &lt;text&gt;</code> — Set group description')}
${styles.listItem('💬', '<code>/setstatus &lt;text&gt;</code> — Set bot status')}
${styles.listItem('⚠️', '<code>/warn</code> — Warn a user (3 warns = kick)')}
${styles.listItem('📊', '<code>/warnings</code> — Check warnings (reply)')}
${styles.listItem('🧹', '<code>/clearwarn</code> — Clear warnings (reply)')}
${styles.listItem('⏱️', '<code>/timeout &lt;mins&gt;</code> — Timeout user (reply)')}
${styles.listItem('🔄', '<code>/softban</code> — Soft ban (kick without perm ban)')}`;

            bot.sendMessage(msg.chat.id, adminHelp, { parse_mode: 'HTML' });
            return;
        }

        if (topic === 'chat' || topic === 'ai') {
            const chatHelp = `🤖 <b>AI Chatbot Help</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${styles.listItem('💬', '<code>/chat &lt;message&gt;</code> — Chat with T20 WOLF AI')}
${styles.listItem('🤖', '<code>/chatbot</code> — Full chatbot help menu')}
${styles.listItem('📩', 'DM the bot directly — Auto AI chat mode')}

🐺 Powered by T20 WOLF AI
⚡ Real-time intelligent responses`;

            bot.sendMessage(msg.chat.id, chatHelp, { parse_mode: 'HTML' });
            return;
        }

        // Full help menu
        const helpText = `${styles.header('T20 Wolf Bot — Help Center', '❓')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${styles.listItem('🎬', '<b>Movie Hub:</b> /help movies')}
${styles.listItem('🔧', '<b>Admin Commands:</b> /help admin')}
${styles.listItem('🤖', '<b>AI Chatbot:</b> /help ai')}
${styles.listItem('📖', '<b>All Commands:</b> /commands')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<b>Quick Commands:</b>
${styles.listItem('👤', '/id /userinfo /stats /groupinfo /members')}
${styles.listItem('🎮', '/8ball /roll /flip /choose /joke /rate')}
${styles.listItem('🔧', '/kick /ban /mute /warn /timeout')}
${styles.listItem('📢', '/post /broadcast /autopost')}
${styles.listItem('⚙️', '/settings /antispam /welcome /setrules')}
${styles.listItem('🎬', '/movies /moviesearch /moviecat /trending')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 Use /help &lt;topic&gt; for detailed help
👑 <i>Master: ARNOLD T20</i>`;

        bot.sendMessage(msg.chat.id, helpText, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '🎬 Movie Help', callback_data: 'help_movies' },
                        { text: '🔧 Admin Help', callback_data: 'help_admin' }
                    ],
                    [
                        { text: '📖 All Commands', callback_data: 'show_all_commands' },
                        { text: '🤖 AI Help', callback_data: 'help_ai' }
                    ]
                ]
            }
        });
    });

    // Help callback queries
    bot.on('callback_query', async (query) => {
        const data = query.data;

        try {
            if (data === 'help_movies') {
                await bot.answerCallbackQuery(query.id);
                await bot.sendMessage(query.message.chat.id,
                    '🎬 Use <code>/help movies</code> for movie help, or <code>/movies</code> to open the movie menu!',
                    { parse_mode: 'HTML' });

            } else if (data === 'help_admin') {
                await bot.answerCallbackQuery(query.id);
                await bot.sendMessage(query.message.chat.id,
                    '🔧 Use <code>/help admin</code> to see all admin commands!',
                    { parse_mode: 'HTML' });

            } else if (data === 'help_ai') {
                await bot.answerCallbackQuery(query.id);
                await bot.sendMessage(query.message.chat.id,
                    '🤖 Use <code>/chat hello</code> to start talking to T20 WOLF AI!',
                    { parse_mode: 'HTML' });

            } else if (data === 'show_all_commands') {
                await bot.answerCallbackQuery(query.id);
                await bot.sendMessage(query.message.chat.id,
                    '📖 Use <code>/commands</code> to see all available commands!',
                    { parse_mode: 'HTML' });
            }
        } catch (err) {
            if (!err.message.includes('message is not modified')) {
                console.error('Help callback error:', err.message);
            }
            try { await bot.answerCallbackQuery(query.id); } catch (_) {}
        }
    });
};
