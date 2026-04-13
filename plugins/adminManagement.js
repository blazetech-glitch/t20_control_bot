// Admin Management Plugin
const styles = require('../utils/styles');

module.exports = (bot, isAdmin, adminIds) => {
    // === LIST ADMINS ===
    bot.onText(/\/admin\s+(list)/, (msg) => {
        if (adminIds.length === 0) {
            bot.sendMessage(msg.chat.id, styles.infoMsg(
                '<b>No admin restrictions configured.</b>\n\n' +
                'All users can use admin commands.\n\n' +
                '💡 Set <code>ADMIN_IDS</code> environment variable to restrict access.\n' +
                'Example: <code>123456789,987654321</code>'
            ), { parse_mode: 'HTML' });
        } else {
            const list = adminIds.map((id, i) => `${i + 1}. <code>${id}</code>`).join('\n');
            bot.sendMessage(msg.chat.id, `${styles.header('Configured Admins', '👑')}\n━━━━━━━━━━━━━━━━━━━━━━\n${list}\n━━━━━━━━━━━━━━━━━━━━━━\n📊 Total: <b>${adminIds.length}</b>`, { parse_mode: 'HTML' });
        }
    });

    // === ADMIN HELP ===
    bot.onText(/\/admin$/, (msg) => {
        const text = `${styles.header('Admin Control Panel', '🔧')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<b>Available Admin Commands:</b>

👥 <b>User Management:</b>
  /kick — Kick user (reply)
  /ban — Permanently ban (reply)
  /unban &lt;id&gt; — Unban by user ID
  /mute — Mute user (reply)
  /unmute — Unmute user (reply)

⚠️ <b>Moderation:</b>
  /warn — Warn user (3 warns = kick)
  /warnings — Check warns (reply)
  /clearwarn — Clear warns (reply)
  /timeout &lt;mins&gt; — Timed mute
  /softban — Kick + unban (reply)

📌 <b>Messages:</b>
  /delete — Delete message (reply)
  /pin — Pin message (reply)
  /unpin — Unpin (reply)

⚙️ <b>Settings:</b>
  /settings — Group settings
  /antispam on/off — Toggle antispam
  /setlang &lt;lang&gt; — Set language
  /setrules &lt;rules&gt; — Set group rules
  /setdesc &lt;text&gt; — Set description

📢 <b>Channel:</b>
  /post &lt;text&gt; — Post to channel
  /broadcast &lt;text&gt; — Broadcast
  /autopost on/off — Auto-posting

📋 <b>Admin Management:</b>
  /admin list — List configured admins
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔒 All admin commands require admin rights`;

        bot.sendMessage(msg.chat.id, text, { parse_mode: 'HTML' });
    });

    // === CHECK IF ADMIN ===
    bot.onText(/\/amiadmin/, async (msg) => {
        const userId = msg.from.id;
        const admin = isAdmin(userId);

        let chatAdmin = false;
        try {
            const member = await bot.getChatMember(msg.chat.id, userId);
            chatAdmin = ['creator', 'administrator'].includes(member.status);
        } catch (_) {}

        const text = `${styles.header('Admin Status Check', '🔑')}
━━━━━━━━━━━━━━━━━━━━━━
${styles.listItem('🤖', `Bot Admin: ${admin ? '✅ Yes' : '❌ No'}`)}
${styles.listItem('👥', `Chat Admin: ${chatAdmin ? '✅ Yes' : '❌ No'}`)}
${styles.listItem('🆔', `Your ID: ${styles.code(userId)}`)}`;

        bot.sendMessage(msg.chat.id, text, { parse_mode: 'HTML' });
    });
};
