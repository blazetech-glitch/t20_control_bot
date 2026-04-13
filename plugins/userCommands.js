// User Commands Plugin
const styles = require('../utils/styles');

module.exports = (bot) => {
    // === USER INFO ===
    bot.onText(/\/userinfo/, (msg) => {
        const target = msg.reply_to_message ? msg.reply_to_message.from : msg.from;

        const info = `${styles.header('User Information', '👤')}
━━━━━━━━━━━━━━━━━━━━━━
${styles.listItem('👤', `Name: <b>${target.first_name}${target.last_name ? ' ' + target.last_name : ''}</b>`)}
${styles.listItem('🆔', `ID: ${styles.code(target.id)}`)}
${styles.listItem('📛', `Username: ${target.username ? '@' + target.username : 'Not set'}`)}
${styles.listItem('🤖', `Is Bot: ${target.is_bot ? '✅ Yes' : '❌ No'}`)}
${styles.listItem('🌐', `Language: ${target.language_code || 'Unknown'}`)}
━━━━━━━━━━━━━━━━━━━━━━`;

        bot.sendMessage(msg.chat.id, info, { parse_mode: 'HTML' });
    });

    // === ECHO ===
    bot.onText(/\/echo(?:\s+(.+))?/, (msg, match) => {
        const text = match[1] || 'No text provided. Usage: /echo <text>';
        const echo = `🔊 <b>Echo:</b>\n${text}`;
        bot.sendMessage(msg.chat.id, echo, { parse_mode: 'HTML' });
    });

    // === HELP COMMAND (handled by help.js, this is a fallback) ===

    // === COMMANDS COMMAND (Alternative to start) ===
    bot.onText(/\/commands/, (msg) => {
        const commands = `${styles.header('T20 Wolf Bot — All Commands', '🤖')}

${styles.section('🎬', 'Movie Hub (BlazeMovieHub)', [
            styles.listItem('🍿', '<code>/movies</code> — Main movie menu'),
            styles.listItem('🔍', '<code>/moviesearch &lt;title&gt;</code> — Search movies'),
            styles.listItem('📺', '<code>/moviecat &lt;genre&gt;</code> — Browse by category'),
            styles.listItem('🔥', '<code>/latestmovies</code> — Latest releases'),
            styles.listItem('📈', '<code>/trending</code> — Trending now'),
            styles.listItem('⭐', '<code>/toprated</code> — Top rated movies'),
            styles.listItem('📀', '<code>/moviehelp</code> — Download guide'),
        ])}

${styles.section('🤖', 'AI Chatbot', [
            styles.listItem('💬', '<code>/chat &lt;message&gt;</code> — Talk to T20 WOLF AI'),
            styles.listItem('🐺', '<code>/chatbot</code> — AI help & info'),
        ])}

${styles.section('👤', 'User Info', [
            styles.listItem('🆔', '<code>/id</code> — Your ID & chat info'),
            styles.listItem('👨‍💼', '<code>/userinfo</code> — User info (reply or own)'),
            styles.listItem('📊', '<code>/stats</code> — Bot statistics'),
            styles.listItem('👥', '<code>/groupinfo</code> — Group details'),
            styles.listItem('👥', '<code>/members</code> — Member count'),
            styles.listItem('👤', '<code>/profile</code> — Your profile'),
            styles.listItem('🏓', '<code>/ping</code> — Bot latency'),
            styles.listItem('🔊', '<code>/echo &lt;text&gt;</code> — Echo text'),
        ])}

${styles.section('🎮', 'Fun & Games', [
            styles.listItem('🎱', '<code>/8ball &lt;question&gt;</code> — Magic 8 ball'),
            styles.listItem('🎲', '<code>/roll &lt;xdy&gt;</code> — Roll dice'),
            styles.listItem('🪙', '<code>/flip</code> — Flip a coin'),
            styles.listItem('🎯', '<code>/choose &lt;a|b|c&gt;</code> — Choose option'),
            styles.listItem('⭐', '<code>/rate &lt;thing&gt;</code> — Rate something'),
            styles.listItem('😂', '<code>/joke</code> — Random joke'),
            styles.listItem('🔄', '<code>/reverse &lt;text&gt;</code> — Reverse text'),
            styles.listItem('🔤', '<code>/upper &lt;text&gt;</code> — Uppercase'),
            styles.listItem('🔡', '<code>/lower &lt;text&gt;</code> — Lowercase'),
        ])}

${styles.section('🔧', 'Admin Commands', [
            styles.listItem('🚫', '<code>/kick</code> — Kick user (reply)'),
            styles.listItem('⛔', '<code>/ban</code> — Ban user (reply)'),
            styles.listItem('✅', '<code>/unban &lt;id&gt;</code> — Unban user'),
            styles.listItem('🔇', '<code>/mute</code> — Mute user (reply)'),
            styles.listItem('🔊', '<code>/unmute</code> — Unmute user (reply)'),
            styles.listItem('🗑️', '<code>/delete</code> — Delete message (reply)'),
            styles.listItem('📌', '<code>/pin</code> — Pin message (reply)'),
            styles.listItem('📌', '<code>/unpin</code> — Unpin message'),
            styles.listItem('📝', '<code>/setdesc &lt;text&gt;</code> — Set group description'),
            styles.listItem('💬', '<code>/setstatus &lt;text&gt;</code> — Set bot status'),
        ])}

${styles.section('⚠️', 'Moderation', [
            styles.listItem('⚠️', '<code>/warn</code> — Warn user (reply, 3=kick)'),
            styles.listItem('📊', '<code>/warnings</code> — Check warnings (reply)'),
            styles.listItem('🧹', '<code>/clearwarn</code> — Clear warnings (reply)'),
            styles.listItem('⏱️', '<code>/timeout &lt;mins&gt;</code> — Timeout (reply)'),
            styles.listItem('🔄', '<code>/softban</code> — Softban (reply)'),
        ])}

${styles.section('⚙️', 'Settings', [
            styles.listItem('🎛️', '<code>/settings</code> — View settings'),
            styles.listItem('🌐', '<code>/setlang &lt;lang&gt;</code> — Set language'),
            styles.listItem('🛡️', '<code>/antispam on/off</code> — Anti-spam'),
            styles.listItem('👋', '<code>/welcome on/off</code> — Welcome msg'),
            styles.listItem('🌙', '<code>/goodbye on/off</code> — Goodbye msg'),
            styles.listItem('📋', '<code>/setrules &lt;text&gt;</code> — Set rules'),
            styles.listItem('📋', '<code>/rules</code> — View rules'),
        ])}

${styles.section('📢', 'Channel', [
            styles.listItem('📝', '<code>/post &lt;text&gt;</code> — Post to channel'),
            styles.listItem('🧪', '<code>/testchannel</code> — Test channel connection'),
            styles.listItem('📡', '<code>/broadcast &lt;text&gt;</code> — Broadcast to groups'),
        ])}

${styles.section('📅', 'Auto-Posting', [
            styles.listItem('▶️', '<code>/autopost on</code> — Enable auto-posting'),
            styles.listItem('⏹️', '<code>/autopost off</code> — Disable auto-posting'),
            styles.listItem('⏰', '<code>/autopost now</code> — Post immediately'),
            styles.listItem('📊', '<code>/autopost status</code> — Check status'),
        ])}

${styles.section('👥', 'Group Management', [
            styles.listItem('👋', '<code>/testwelcome</code> — Test welcome msg'),
            styles.listItem('🌙', '<code>/testgoodbye</code> — Test goodbye msg'),
            styles.listItem('👥', '<code>/togglewelcome</code> — Toggle welcome'),
            styles.listItem('🤖', '<code>/togglechatbot</code> — Toggle chatbot'),
        ])}

${styles.divider}
💡 /help &lt;topic&gt; for detailed help on any section
👑 <i>Master: ARNOLD T20</i>`;

        bot.sendMessage(msg.chat.id, commands, { parse_mode: 'HTML' });
    });
};
