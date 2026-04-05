// Welcome Commands Plugin
const styles = require('../utils/styles');

module.exports = (bot, groups) => {
    bot.on('message', async (msg) => {
        if (msg.chat.type !== 'group' && msg.chat.type !== 'supergroup') {
            return;
        }

        if (!groups.includes(msg.chat.id)) {
            groups.push(msg.chat.id);
        }

        if (msg.new_chat_members && msg.new_chat_members.length) {
            const names = msg.new_chat_members.map(user => `${user.first_name || 'New member'}${user.last_name ? ' ' + user.last_name : ''}`);
            const joinedUsers = names.join(', ');
            const groupName = msg.chat.title || 'this community';
            const welcomeText = `
✨ <b>WELCOME TO ${groupName.toUpperCase()}</b> ✨

👋 <b>${joinedUsers}</b> just arrived and the squad is stronger already.

🔥 <b>Mission:</b> Learn fast, stay safe, and build powerful Telegram workflows.
💎 <b>Next step:</b> introduce yourself, check pinned rules, and say hi to the team.

${styles.dividerLong}
🚀 <i>Type /menu to explore commands, or /help to get started.</i>
`;

            try {
                await bot.sendMessage(msg.chat.id, welcomeText, { parse_mode: 'HTML' });
            } catch (err) {
                console.error('❌ Failed to send welcome message:', err.message || err);
            }
        }

        if (msg.left_chat_member) {
            const user = msg.left_chat_member;
            const groupName = msg.chat.title || 'this community';
            const goodbyeText = `
🌙 <b>FAREWELL, ${user.first_name || 'friend'}</b>.

Your journey through <b>${groupName}</b> continues beyond this chat.

💬 We'll miss your presence and hope to see you again soon.

${styles.dividerLong}
✨ <i>If you want back in, ask an admin for a fresh invite.</i>
`;

            try {
                await bot.sendMessage(msg.chat.id, goodbyeText, { parse_mode: 'HTML' });
            } catch (err) {
                console.error('❌ Failed to send goodbye message:', err.message || err);
            }
        }
    });

    bot.onText(/\/ping/, (msg) => {
        const latencyMs = Date.now() - (msg.date * 1000);
        const reply = `🏓 <b>PONG!</b>\nLatency: <b>${latencyMs} ms</b>\nStatus: <b>Online</b>`;
        bot.sendMessage(msg.chat.id, reply, { parse_mode: 'HTML' });
    });

    bot.onText(/\/menu/, (msg) => {
        const menuText = `${styles.header('T20 CONTROL MENU', '📜')}
Choose a command from the buttons below or type it manually.

${styles.divider}
<b>Tip:</b> Use <code>/help</code> or <code>/start</code> to see more features.`;

        const keyboard = [
            [
                { text: '/start', callback_data: '/start' },
                { text: '/menu', callback_data: '/menu' }
            ],
            [
                { text: '/ping', callback_data: '/ping' },
                { text: '/help', callback_data: '/help' }
            ],
            [
                { text: '/id', callback_data: '/id' },
                { text: '/post', callback_data: '/post' }
            ],
            [
                { text: '/autopost', callback_data: '/autopost' },
                { text: '/admin list', callback_data: '/admin list' }
            ]
        ];

        const options = {
            caption: menuText,
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: keyboard
            }
        };

        bot.sendPhoto(msg.chat.id, 'https://files.catbox.moe/eycaql.png', options);
    });

    // Handle callback queries from inline keyboard buttons
    bot.on('callback_query', (query) => {
        const command = query.data;
        const fakeMsg = {
            message_id: query.message.message_id,
            from: query.from,
            chat: query.message.chat,
            date: query.message.date,
            text: command
        };
        bot.emit('message', fakeMsg);
        bot.answerCallbackQuery(query.id);
    });
};
