// Admin Commands Plugin
const styles = require('../utils/styles');

module.exports = (bot, isAdmin) => {
    // === KICK USER ===
    bot.onText(/\/kick/, (msg) => {
        if (!isAdmin(msg.from.id)) {
            bot.sendMessage(msg.chat.id, styles.errorMsg('Admin command only.'), { parse_mode: 'HTML' });
            return;
        }
        if (msg.reply_to_message) {
            const userId = msg.reply_to_message.from.id;
            const userName = msg.reply_to_message.from.first_name;
            bot.banChatMember(msg.chat.id, userId)
                .then(() => bot.unbanChatMember(msg.chat.id, userId))
                .then(() => {
                    bot.sendMessage(msg.chat.id, styles.successMsg(`User <b>${userName}</b> has been kicked.`), { parse_mode: 'HTML' });
                })
                .catch(err => bot.sendMessage(msg.chat.id, styles.errorMsg(`${err.message}`), { parse_mode: 'HTML' }));
        } else {
            bot.sendMessage(msg.chat.id, '📝 Reply to a message to kick the user.', { parse_mode: 'HTML' });
        }
    });

    // === BAN USER ===
    bot.onText(/\/ban/, (msg) => {
        if (!isAdmin(msg.from.id)) {
            bot.sendMessage(msg.chat.id, styles.errorMsg('Admin command only.'), { parse_mode: 'HTML' });
            return;
        }
        if (msg.reply_to_message) {
            const userId = msg.reply_to_message.from.id;
            const userName = msg.reply_to_message.from.first_name;
            bot.banChatMember(msg.chat.id, userId)
                .then(() => {
                    bot.sendMessage(msg.chat.id, styles.successMsg(`User <b>${userName}</b> has been banned.`), { parse_mode: 'HTML' });
                })
                .catch(err => bot.sendMessage(msg.chat.id, styles.errorMsg(`${err.message}`), { parse_mode: 'HTML' }));
        } else {
            bot.sendMessage(msg.chat.id, '📝 Reply to a message to ban the user.', { parse_mode: 'HTML' });
        }
    });

    // === UNBAN USER ===
    bot.onText(/\/unban\s+(.+)/, (msg, match) => {
        if (!isAdmin(msg.from.id)) {
            bot.sendMessage(msg.chat.id, styles.errorMsg('Admin command only.'), { parse_mode: 'HTML' });
            return;
        }
        const userId = match[1].trim();
        bot.unbanChatMember(msg.chat.id, userId)
            .then(() => bot.sendMessage(msg.chat.id, styles.successMsg(`User has been unbanned.`), { parse_mode: 'HTML' }))
            .catch(err => bot.sendMessage(msg.chat.id, styles.errorMsg(`${err.message}`), { parse_mode: 'HTML' }));
    });

    // === MUTE USER ===
    bot.onText(/\/mute/, (msg) => {
        if (!isAdmin(msg.from.id)) {
            bot.sendMessage(msg.chat.id, styles.errorMsg('Admin command only.'), { parse_mode: 'HTML' });
            return;
        }
        if (msg.reply_to_message) {
            const userId = msg.reply_to_message.from.id;
            const userName = msg.reply_to_message.from.first_name;
            bot.restrictChatMember(msg.chat.id, userId, { can_send_messages: false })
                .then(() => bot.sendMessage(msg.chat.id, styles.successMsg(`<b>${userName}</b> has been muted.`), { parse_mode: 'HTML' }))
                .catch(err => bot.sendMessage(msg.chat.id, styles.errorMsg(`${err.message}`), { parse_mode: 'HTML' }));
        } else {
            bot.sendMessage(msg.chat.id, '📝 Reply to a message to mute the user.', { parse_mode: 'HTML' });
        }
    });

    // === UNMUTE USER ===
    bot.onText(/\/unmute/, (msg) => {
        if (!isAdmin(msg.from.id)) {
            bot.sendMessage(msg.chat.id, styles.errorMsg('Admin command only.'), { parse_mode: 'HTML' });
            return;
        }
        if (msg.reply_to_message) {
            const userId = msg.reply_to_message.from.id;
            const userName = msg.reply_to_message.from.first_name;
            bot.restrictChatMember(msg.chat.id, userId, { can_send_messages: true })
                .then(() => bot.sendMessage(msg.chat.id, styles.successMsg(`<b>${userName}</b> has been unmuted.`), { parse_mode: 'HTML' }))
                .catch(err => bot.sendMessage(msg.chat.id, styles.errorMsg(`${err.message}`), { parse_mode: 'HTML' }));
        } else {
            bot.sendMessage(msg.chat.id, '📝 Reply to a message to unmute the user.', { parse_mode: 'HTML' });
        }
    });

    // === DELETE MESSAGE ===
    bot.onText(/\/delete/, (msg) => {
        if (!isAdmin(msg.from.id)) {
            bot.sendMessage(msg.chat.id, styles.errorMsg('Admin command only.'), { parse_mode: 'HTML' });
            return;
        }
        if (msg.reply_to_message) {
            bot.deleteMessage(msg.chat.id, msg.reply_to_message.message_id)
                .then(() => bot.sendMessage(msg.chat.id, styles.successMsg(`Message has been deleted.`), { parse_mode: 'HTML' }))
                .catch(err => bot.sendMessage(msg.chat.id, styles.errorMsg(`${err.message}`), { parse_mode: 'HTML' }));
        } else {
            bot.sendMessage(msg.chat.id, '📝 Reply to a message to delete it.', { parse_mode: 'HTML' });
        }
    });

    // === SET PROFILE STATUS ===
    bot.onText(/\/setstatus\s+([\s\S]+)/, async (msg, match) => {
        if (!isAdmin(msg.from.id)) {
            bot.sendMessage(msg.chat.id, styles.errorMsg('Admin command only.'), { parse_mode: 'HTML' });
            return;
        }

        const statusText = match[1].trim();
        if (!statusText) {
            bot.sendMessage(msg.chat.id, styles.errorMsg('Usage: /setstatus Your status message here'), { parse_mode: 'HTML' });
            return;
        }

        try {
            if (typeof bot.setMyDescription === 'function') {
                await bot.setMyDescription({ description: statusText });
            } else if (typeof bot._request === 'function') {
                await bot._request('setMyDescription', { description: statusText });
            }

            if (typeof bot.setMyShortDescription === 'function') {
                await bot.setMyShortDescription({ short_description: statusText.slice(0, 120) });
            } else if (typeof bot._request === 'function') {
                await bot._request('setMyShortDescription', { short_description: statusText.slice(0, 120) });
            }

            bot.sendMessage(msg.chat.id, styles.successMsg('✅ Profile status updated successfully.'), { parse_mode: 'HTML' });
        } catch (err) {
            bot.sendMessage(msg.chat.id, styles.errorMsg(`❌ Failed to update status: ${err.message}`), { parse_mode: 'HTML' });
        }
    });

    // === PIN MESSAGE ===
    bot.onText(/\/pin/, (msg) => {
        if (!isAdmin(msg.from.id)) {
            bot.sendMessage(msg.chat.id, styles.errorMsg('Admin command only.'), { parse_mode: 'HTML' });
            return;
        }
        if (msg.reply_to_message) {
            bot.pinChatMessage(msg.chat.id, msg.reply_to_message.message_id)
                .then(() => bot.sendMessage(msg.chat.id, styles.successMsg(`Message has been pinned.`), { parse_mode: 'HTML' }))
                .catch(err => bot.sendMessage(msg.chat.id, styles.errorMsg(`${err.message}`), { parse_mode: 'HTML' }));
        } else {
            bot.sendMessage(msg.chat.id, '📝 Reply to a message to pin it.', { parse_mode: 'HTML' });
        }
    });
};
