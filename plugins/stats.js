// Stats Command Plugin
const styles = require('../utils/styles');

module.exports = (bot, groups, adminCount, channelId) => {
    bot.onText(/\/stats/, async (msg) => {
        const uptimeMs = process.uptime() * 1000;
        const uptime = styles.formatUptime(uptimeMs);
        const memUsage = process.memoryUsage();
        const memMB = (memUsage.heapUsed / 1024 / 1024).toFixed(1);
        const totalMemMB = (memUsage.heapTotal / 1024 / 1024).toFixed(1);

        let botInfo = { username: 'T20WolfBot', id: 'N/A' };
        try {
            const me = await bot.getMe();
            botInfo = me;
        } catch (_) {}

        const stats = `${styles.header('T20 Wolf Bot — Statistics', '📊')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 <b>Bot Info</b>
${styles.listItem('📛', `Name: @${botInfo.username || 'N/A'}`)}
${styles.listItem('🆔', `Bot ID: ${styles.code(botInfo.id)}`)}
${styles.listItem('🟢', `Status: Online & Running`)}

⏱️ <b>Performance</b>
${styles.listItem('🕐', `Uptime: <b>${uptime}</b>`)}
${styles.listItem('💾', `Memory: <b>${memMB}MB / ${totalMemMB}MB</b>`)}
${styles.listItem('🖥️', `Node.js: <b>${process.version}</b>`)}

📊 <b>Activity</b>
${styles.listItem('👥', `Groups Tracked: <b>${groups?.length || 0}</b>`)}
${styles.listItem('🔑', `Admins: <b>${adminCount || 0}</b>`)}
${styles.listItem('📢', `Channel: <b>${channelId || 'Not Set'}</b>`)}

🎬 <b>Movie Hub</b>
${styles.listItem('🌐', `BlazeMovieHub: <a href="https://blazemoviehub.t20tech.site">Online</a>`)}
${styles.listItem('🍿', `Categories: <b>16</b>`)}
${styles.listItem('📀', `Qualities: <b>5 options</b>`)}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👑 <i>Master: ARNOLD T20</i>`;

        bot.sendMessage(msg.chat.id, stats, {
            parse_mode: 'HTML',
            disable_web_page_preview: true
        });
    });
};
