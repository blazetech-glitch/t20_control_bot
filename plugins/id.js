// ID Command Plugin
const styles = require('../utils/styles');

module.exports = (bot) => {
    bot.onText(/\/id/, async (msg) => {
        const user = msg.from;
        const chat = msg.chat;

        let statusBadge = '👤 Member';
        try {
            const member = await bot.getChatMember(chat.id, user.id);
            const statusMap = {
                creator: '👑 Creator/Owner',
                administrator: '🛡️ Administrator',
                member: '👤 Member',
                restricted: '🔒 Restricted',
                left: '🚪 Left',
                kicked: '⛔ Banned'
            };
            statusBadge = statusMap[member.status] || member.status;
        } catch (_) {}

        const info = `${styles.header('Your Information', '🆔')}
━━━━━━━━━━━━━━━━━━━━━━
${styles.listItem('👤', `Name: <b>${user.first_name}${user.last_name ? ' ' + user.last_name : ''}</b>`)}
${styles.listItem('🆔', `User ID: <code>${user.id}</code>}`)}
${styles.listItem('📛', `Username: ${user.username ? '@' + user.username : 'Not set'}`)}
${styles.listItem('🌐', `Language: ${user.language_code || 'Unknown'}`)}
${styles.listItem('🤖', `Is Bot: ${user.is_bot ? 'Yes' : 'No'}`)}
${styles.listItem('🏅', `Status: ${statusBadge}`)}
━━━━━━━━━━━━━━━━━━━━━━
${styles.header('Chat Information', '💬')}
${styles.listItem('📌', `Chat ID: <code>${chat.id}</code>`)}
${styles.listItem('📋', `Type: <b>${chat.type}</b>`)}
${styles.listItem('💬', `Title: <b>${chat.title || chat.first_name || 'Private'}</b>`)}`;

        bot.sendMessage(msg.chat.id, info, { parse_mode: 'HTML' });
    });
};
