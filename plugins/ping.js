// Ping Command Plugin
module.exports = (bot) => {
    bot.onText(/\/ping/, async (msg) => {
        const sent = Date.now();
        const msgLatency = sent - (msg.date * 1000);

        const sentMsg = await bot.sendMessage(msg.chat.id,
            `🏓 <b>Pinging...</b>`,
            { parse_mode: 'HTML' }
        );

        const roundTrip = Date.now() - sent;

        await bot.editMessageText(
            `🏓 <b>PONG!</b>
━━━━━━━━━━━━━━━━━━━━━━
⚡ <b>API Latency:</b> ${roundTrip}ms
📡 <b>Msg Latency:</b> ${msgLatency > 0 ? msgLatency : '<1'}ms
🟢 <b>Status:</b> Online
━━━━━━━━━━━━━━━━━━━━━━
🤖 T20 Wolf Bot is alive!`,
            {
                chat_id: msg.chat.id,
                message_id: sentMsg.message_id,
                parse_mode: 'HTML'
            }
        );
    });
};
