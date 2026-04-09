// Welcome Commands Plugin
const path = require('path');
const fs = require('fs');
const os = require('os');
const styles = require('../utils/styles');

let sharp;
try {
    sharp = require('sharp');
} catch (err) {
    sharp = null;
}

// Settings to control welcome/goodbye messages per chat
const settings = {};

module.exports = (bot, groups, botStartTime) => {
    // Helper function to get settings for a chat
    const getSettings = (chatId) => {
        if (!settings[chatId]) {
            settings[chatId] = { welcome: true, goodbye: true };
        }
        return settings[chatId];
    };

    bot.on('message', async (msg) => {
        if (msg.chat.type !== 'group' && msg.chat.type !== 'supergroup') {
            return;
        }

        if (!groups.includes(msg.chat.id)) {
            groups.push(msg.chat.id);
        }

        const chatSettings = getSettings(msg.chat.id);

        if (msg.new_chat_members && msg.new_chat_members.length && chatSettings.welcome) {
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

        if (msg.left_chat_member && chatSettings.goodbye) {
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

    bot.onText(/\/menu/, async (msg) => {
        try {
            // Get bot info
            const me = await bot.getMe();

            // Calculate uptime
            const uptime = Date.now() - botStartTime;
            const uptimeStr = styles.formatUptime(uptime);

            // Get current time and date
            const timeStr = styles.formatTime();
            const dateStr = styles.formatDate();

            // Build the styled menu
            const botName = `${me.first_name || 'T20'} ${me.last_name || ''}`.trim().toUpperCase();

            const menuText = `${styles.menuHeader(botName)}

${styles.menuInfo('Mᴏᴅᴇ', 'public')}
${styles.menuInfo('Pʀᴇғɪx', '/')}
${styles.menuInfo('Usᴇʀ', `@${me.id}`)}
${styles.menuInfo('Cᴏᴍᴍᴀɴᴅs', '50+')}
${styles.menuInfo('Uᴘᴛɪᴍᴇ', uptimeStr)}
${styles.menuInfo('Tɪᴍᴇ', timeStr)}
${styles.menuInfo('Dᴀᴛᴇ', dateStr)}
${styles.menuInfo('Pʟᴀᴛғᴏʀᴍ', 'Linux')}
${styles.menuInfo('Rᴀᴍ', '93%')}
${styles.menuClosing()}

👑 ROYAL COMMAND CENTER
${styles.menuDivider()}

${styles.menuCategory('👤', '<b>User</b>')}
${styles.menuItem('🆔', 'ID • Info • Stats • Ping')}

${styles.menuCategory('🎮', '<b>Fun</b>')}
${styles.menuItem('🎲', '8Ball • Dice • Coin • Joke')}

${styles.menuCategory('🔧', '<b>Admin</b>')}
${styles.menuItem('🚫', 'Kick • Ban • Mute • Delete')}

${styles.menuCategory('⚠️', '<b>Mod</b>')}
${styles.menuItem('📊', 'Warn • Timeout • Softban')}

${styles.menuCategory('⚙️', '<b>Settings</b>')}
${styles.menuItem('🎛️', 'Config • Rules • AntiSpam')}

${styles.menuCategory('🤖', '<b>Chatbot</b>')}
${styles.menuItem('💬', 'AI Chat • Smart Responses')}

${styles.menuDivider()}
Type <code>/start</code> for all commands

${styles.menuFooter('ARNOLD T20')}`;

            const keyboard = [
                [
                    { text: '👑 Start', callback_data: '/start' },
                    { text: '📚 Help', callback_data: '/help' }
                ],
                [
                    { text: '👤 User Info', callback_data: '/id' },
                    { text: '🏓 Ping', callback_data: '/ping' }
                ],
                [
                    { text: '🎮 Fun', callback_data: '/joke' },
                    { text: '⚙️ Settings', callback_data: '/settings' }
                ],
                [
                    { text: '🤖 Chatbot', callback_data: '/chatbot' },
                    { text: '📊 Members', callback_data: '/members' }
                ],
                [
                    { text: '🔧 Admin', callback_data: '/admin list' },
                    { text: '🗂️ Rules', callback_data: '/rules' }
                ],
                [
                    { text: '📋 All Commands', callback_data: '/start' }
                ]
            ];

            // Send the royal menu image first, then the menu details
            try {
                const remoteMenuUrl = 'https://files.catbox.moe/fruf4o.png';
                const caption = '👑 Welcome to ARNOLD T20 Royal Command Center 👑';

                await bot.sendPhoto(msg.chat.id, remoteMenuUrl, {
                    caption,
                    parse_mode: 'HTML'
                });

                await bot.sendMessage(msg.chat.id, menuText, {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: keyboard
                    }
                });
            } catch (error) {
                console.error('Failed to send menu image, using text fallback:', error.message);
                const menuWithImageLink = menuText + '\n\n<a href="https://files.catbox.moe/fruf4o.png">👑 View Royal Menu Image</a>';

                await bot.sendMessage(msg.chat.id, menuWithImageLink, {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: keyboard
                    }
                });
            }
        } catch (error) {
            console.error('Error generating menu:', error);
            await bot.sendMessage(msg.chat.id, '❌ Failed to generate menu', { parse_mode: 'HTML' });
        }
    });

    // === TOGGLE WELCOME MESSAGES ===
    bot.onText(/\/welcome\s+(on|off)/, (msg, match) => {
        const action = match[1];
        const chatSettings = getSettings(msg.chat.id);
        chatSettings.welcome = action === 'on';
        const status = chatSettings.welcome ? 'enabled' : 'disabled';
        bot.sendMessage(msg.chat.id, `✅ Welcome messages have been <b>${status}</b>.`, { parse_mode: 'HTML' });
    });

    // === TOGGLE GOODBYE MESSAGES ===
    bot.onText(/\/goodbye\s+(on|off)/, (msg, match) => {
        const action = match[1];
        const chatSettings = getSettings(msg.chat.id);
        chatSettings.goodbye = action === 'on';
        const status = chatSettings.goodbye ? 'enabled' : 'disabled';
        bot.sendMessage(msg.chat.id, `✅ Goodbye messages have been <b>${status}</b>.`, { parse_mode: 'HTML' });
    });

    // === WELCOME STATUS ===
    bot.onText(/\/welcome\s+status/, (msg) => {
        const chatSettings = getSettings(msg.chat.id);
        const status = chatSettings.welcome ? 'enabled' : 'disabled';
        bot.sendMessage(msg.chat.id, `ℹ️ Welcome messages are currently <b>${status}</b>.`, { parse_mode: 'HTML' });
    });

    // === GOODBYE STATUS ===
    bot.onText(/\/goodbye\s+status/, (msg) => {
        const chatSettings = getSettings(msg.chat.id);
        const status = chatSettings.goodbye ? 'enabled' : 'disabled';
        bot.sendMessage(msg.chat.id, `ℹ️ Goodbye messages are currently <b>${status}</b>.`, { parse_mode: 'HTML' });
    });

    // === TEST WELCOME MESSAGE ===
    bot.onText(/\/testwelcome/, (msg) => {
        if (msg.chat.type !== 'group' && msg.chat.type !== 'supergroup') {
            bot.sendMessage(msg.chat.id, '❌ This command only works in groups.', { parse_mode: 'HTML' });
            return;
        }

        const groupName = msg.chat.title || 'this community';
        const welcomeText = `
✨ <b>WELCOME TO ${groupName.toUpperCase()}</b> ✨

👋 <b>Test User</b> just arrived and the squad is stronger already.

🔥 <b>Mission:</b> Learn fast, stay safe, and build powerful Telegram workflows.
💎 <b>Next step:</b> introduce yourself, check pinned rules, and say hi to the team.

${styles.dividerLong}
🚀 <i>Type /menu to explore commands, or /help to get started.</i>
`;

        bot.sendMessage(msg.chat.id, welcomeText, { parse_mode: 'HTML' });
    });

    // === TEST GOODBYE MESSAGE ===
    bot.onText(/\/testgoodbye/, (msg) => {
        if (msg.chat.type !== 'group' && msg.chat.type !== 'supergroup') {
            bot.sendMessage(msg.chat.id, '❌ This command only works in groups.', { parse_mode: 'HTML' });
            return;
        }

        const groupName = msg.chat.title || 'this community';
        const goodbyeText = `
🌙 <b>FAREWELL, Test User</b>.

Your journey through <b>${groupName}</b> continues beyond this chat.

💬 We'll miss your presence and hope to see you again soon.

${styles.dividerLong}
✨ <i>If you want back in, ask an admin for a fresh invite.</i>
`;

        bot.sendMessage(msg.chat.id, goodbyeText, { parse_mode: 'HTML' });
    });

    // Handle callback queries from inline keyboard buttons
    bot.on('callback_query', async (query) => {
        const command = query.data;
        const chatId = query.message.chat.id;
        const chatSettings = getSettings(chatId);

        try {
            switch (command) {
                case '/start':
                    // Trigger start command - this might need to be handled differently
                    bot.emit('message', {
                        message_id: query.message.message_id,
                        from: query.from,
                        chat: query.message.chat,
                        date: query.message.date,
                        text: '/start'
                    });
                    break;

                case '/menu':
                    // Re-trigger menu
                    bot.emit('message', {
                        message_id: query.message.message_id,
                        from: query.from,
                        chat: query.message.chat,
                        date: query.message.date,
                        text: '/menu'
                    });
                    break;

                case '/ping':
                    const latencyMs = Date.now() - (query.message.date * 1000);
                    const reply = `🏓 <b>PONG!</b>\nLatency: <b>${latencyMs} ms</b>\nStatus: <b>Online</b>`;
                    await bot.sendMessage(chatId, reply, { parse_mode: 'HTML' });
                    break;

                case '/help':
                    bot.emit('message', {
                        message_id: query.message.message_id,
                        from: query.from,
                        chat: query.message.chat,
                        date: query.message.date,
                        text: '/help'
                    });
                    break;

                case '/id':
                    const idInfo = `${styles.header('User & Chat Info', '👤')}
${styles.listItem('🆔', `ID: ${styles.code(query.from.id)}`)}
${styles.listItem('📝', `Name: ${query.from.first_name}${query.from.last_name ? ' ' + query.from.last_name : ''}`)}
${styles.listItem('👤', `Username: ${query.from.username ? '@' + query.from.username : 'None'}`)}

${styles.header('Chat Details', '💬')}
${styles.listItem('🔖', `Chat ID: ${styles.code(chatId)}`)}
${styles.listItem('📌', `Type: ${query.message.chat.type}`)}`;
                    await bot.sendMessage(chatId, idInfo, { parse_mode: 'HTML' });
                    break;

                case '/post':
                    await bot.sendMessage(chatId, '📝 To post to channel, use: <code>/post [your message]</code>', { parse_mode: 'HTML' });
                    break;

                case '/autopost':
                    await bot.sendMessage(chatId, '📅 Auto-posting commands:\n• <code>/autopost on</code> - Enable\n• <code>/autopost off</code> - Disable\n• <code>/autopost now</code> - Post immediately\n• <code>/autopost status</code> - Check status', { parse_mode: 'HTML' });
                    break;

                case '/admin list':
                    bot.emit('message', {
                        message_id: query.message.message_id,
                        from: query.from,
                        chat: query.message.chat,
                        date: query.message.date,
                        text: '/admin list'
                    });
                    break;

                case '/welcome status':
                    const welcomeStatus = chatSettings.welcome ? 'enabled' : 'disabled';
                    await bot.sendMessage(chatId, `ℹ️ Welcome messages are currently <b>${welcomeStatus}</b>.`, { parse_mode: 'HTML' });
                    break;

                case '/goodbye status':
                    const goodbyeStatus = chatSettings.goodbye ? 'enabled' : 'disabled';
                    await bot.sendMessage(chatId, `ℹ️ Goodbye messages are currently <b>${goodbyeStatus}</b>.`, { parse_mode: 'HTML' });
                    break;

                case '/testwelcome':
                    if (query.message.chat.type !== 'group' && query.message.chat.type !== 'supergroup') {
                        await bot.sendMessage(chatId, '❌ This command only works in groups.', { parse_mode: 'HTML' });
                        break;
                    }
                    const testGroupName = query.message.chat.title || 'this community';
                    const testWelcomeText = `
✨ <b>WELCOME TO ${testGroupName.toUpperCase()}</b> ✨

👋 <b>Test User</b> just arrived and the squad is stronger already.

🔥 <b>Mission:</b> Learn fast, stay safe, and build powerful Telegram workflows.
💎 <b>Next step:</b> introduce yourself, check pinned rules, and say hi to the team.

${styles.dividerLong}
🚀 <i>Type /menu to explore commands, or /help to get started.</i>
`;
                    await bot.sendMessage(chatId, testWelcomeText, { parse_mode: 'HTML' });
                    break;

                case '/testgoodbye':
                    if (query.message.chat.type !== 'group' && query.message.chat.type !== 'supergroup') {
                        await bot.sendMessage(chatId, '❌ This command only works in groups.', { parse_mode: 'HTML' });
                        break;
                    }
                    const testGroupName2 = query.message.chat.title || 'this community';
                    const testGoodbyeText = `
🌙 <b>FAREWELL, Test User</b>.

Your journey through <b>${testGroupName2}</b> continues beyond this chat.

💬 We'll miss your presence and hope to see you again soon.

${styles.dividerLong}
✨ <i>If you want back in, ask an admin for a fresh invite.</i>
`;
                    await bot.sendMessage(chatId, testGoodbyeText, { parse_mode: 'HTML' });
                    break;

                case '/groupinfo':
                    bot.emit('message', {
                        message_id: query.message.message_id,
                        from: query.from,
                        chat: query.message.chat,
                        date: query.message.date,
                        text: '/groupinfo'
                    });
                    break;

                case '/members':
                    bot.emit('message', {
                        message_id: query.message.message_id,
                        from: query.from,
                        chat: query.message.chat,
                        date: query.message.date,
                        text: '/members'
                    });
                    break;

                case '/settings':
                    bot.emit('message', {
                        message_id: query.message.message_id,
                        from: query.from,
                        chat: query.message.chat,
                        date: query.message.date,
                        text: '/settings'
                    });
                    break;

                case '/joke':
                    bot.emit('message', {
                        message_id: query.message.message_id,
                        from: query.from,
                        chat: query.message.chat,
                        date: query.message.date,
                        text: '/joke'
                    });
                    break;

                case '/rules':
                    bot.emit('message', {
                        message_id: query.message.message_id,
                        from: query.from,
                        chat: query.message.chat,
                        date: query.message.date,
                        text: '/rules'
                    });
                    break;
            }

            bot.answerCallbackQuery(query.id);
        } catch (error) {
            console.error('Error handling callback query:', error);
            bot.answerCallbackQuery(query.id, { text: 'An error occurred', show_alert: true });
        }
    });
};
