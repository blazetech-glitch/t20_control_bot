// Movie Download Commands Plugin
// Integrates with BlazeMovieHub (blazemoviehub.t20tech.site)

const styles = require('../utils/styles');

const SITE_URL = 'https://blazemoviehub.t20tech.site';

const MOVIE_CATEGORIES = [
    { name: '🎬 Action', slug: 'action' },
    { name: '😂 Comedy', slug: 'comedy' },
    { name: '😱 Horror', slug: 'horror' },
    { name: '💕 Romance', slug: 'romance' },
    { name: '🔫 Thriller', slug: 'thriller' },
    { name: '🚀 Sci-Fi', slug: 'sci-fi' },
    { name: '🧙 Fantasy', slug: 'fantasy' },
    { name: '🎭 Drama', slug: 'drama' },
    { name: '🕵️ Crime', slug: 'crime' },
    { name: '🌍 Adventure', slug: 'adventure' },
    { name: '🎨 Animation', slug: 'animation' },
    { name: '📽️ Documentary', slug: 'documentary' },
    { name: '🎵 Bollywood', slug: 'bollywood' },
    { name: '📺 TV Series', slug: 'tv-series' },
    { name: '🌟 Hollywood', slug: 'hollywood' },
    { name: '🌏 Nollywood', slug: 'nollywood' },
];

const QUALITIES = [
    { name: '📀 4K Ultra HD', value: '2160p' },
    { name: '🎬 Full HD 1080p', value: '1080p' },
    { name: '📺 HD 720p', value: '720p' },
    { name: '📱 Mobile 480p', value: '480p' },
    { name: '💾 Low 360p', value: '360p' },
];

function buildCategoryKeyboard() {
    const rows = [];
    for (let i = 0; i < MOVIE_CATEGORIES.length; i += 2) {
        const row = [];
        row.push({
            text: MOVIE_CATEGORIES[i].name,
            callback_data: `movie_cat_${MOVIE_CATEGORIES[i].slug}`
        });
        if (MOVIE_CATEGORIES[i + 1]) {
            row.push({
                text: MOVIE_CATEGORIES[i + 1].name,
                callback_data: `movie_cat_${MOVIE_CATEGORIES[i + 1].slug}`
            });
        }
        rows.push(row);
    }
    rows.push([
        { text: '🔍 Search Movie', callback_data: 'movie_search_help' },
        { text: '🌐 Visit Site', url: SITE_URL }
    ]);
    rows.push([
        { text: '🔥 Latest Movies', callback_data: 'movie_latest' },
        { text: '📈 Trending Now', callback_data: 'movie_trending' }
    ]);
    return { inline_keyboard: rows };
}

function buildQualityKeyboard(category) {
    const rows = QUALITIES.map(q => [{
        text: q.name,
        url: `${SITE_URL}/?category=${encodeURIComponent(category)}&quality=${q.value}`
    }]);
    rows.push([
        { text: '🔙 Back to Categories', callback_data: 'movie_menu' },
        { text: '🌐 Open Site', url: SITE_URL }
    ]);
    return { inline_keyboard: rows };
}

function buildMainMenuKeyboard() {
    return {
        inline_keyboard: [
            [
                { text: '🎬 Browse Categories', callback_data: 'movie_categories' },
                { text: '🔍 Search Movies', callback_data: 'movie_search_help' }
            ],
            [
                { text: '🔥 Latest Movies', callback_data: 'movie_latest' },
                { text: '📈 Trending Now', callback_data: 'movie_trending' }
            ],
            [
                { text: '📀 Download Guide', callback_data: 'movie_download_guide' },
                { text: '⭐ Top Rated', callback_data: 'movie_top_rated' }
            ],
            [
                { text: '🌐 Visit BlazeMovieHub', url: SITE_URL }
            ]
        ]
    };
}

module.exports = (bot) => {

    // === MAIN MOVIES MENU ===
    bot.onText(/\/movies$/, (msg) => {
        const text = `🎬 <b>BlazeMovieHub — T20 Movie Center</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎥 <b>Stream &amp; Download Movies in HD</b>
🌐 Powered by <a href="${SITE_URL}">BlazeMovieHub</a>
👑 By <b>Arnold T20</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🍿 Choose an option below to get started:
• Browse by genre/category
• Search any movie or TV series
• Get latest &amp; trending releases
• Download in multiple quality options

📱 All qualities: 4K • 1080p • 720p • 480p`;

        bot.sendMessage(msg.chat.id, text, {
            parse_mode: 'HTML',
            reply_markup: buildMainMenuKeyboard(),
            disable_web_page_preview: false
        });
    });

    // === MOVIE CATEGORIES MENU ===
    bot.onText(/\/moviecat(?:\s+(.+))?/, (msg, match) => {
        const catQuery = match && match[1] ? match[1].trim().toLowerCase() : null;

        if (catQuery) {
            const found = MOVIE_CATEGORIES.find(c =>
                c.slug.includes(catQuery) || c.name.toLowerCase().includes(catQuery)
            );

            if (found) {
                const text = `${found.name} <b>Movies</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎬 Browsing <b>${found.name}</b> movies on BlazeMovieHub

Choose your preferred download quality:`;

                bot.sendMessage(msg.chat.id, text, {
                    parse_mode: 'HTML',
                    reply_markup: buildQualityKeyboard(found.slug)
                });
                return;
            }
        }

        const text = `🎬 <b>Movie Categories</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🍿 Select a category to browse movies:`;

        bot.sendMessage(msg.chat.id, text, {
            parse_mode: 'HTML',
            reply_markup: buildCategoryKeyboard()
        });
    });

    // === MOVIE SEARCH ===
    bot.onText(/\/moviesearch(?:\s+(.+))?/, (msg, match) => {
        if (!match || !match[1]) {
            const text = `🔍 <b>Movie Search</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Usage: <code>/moviesearch &lt;movie name&gt;</code>

Examples:
• <code>/moviesearch Avengers</code>
• <code>/moviesearch Spider-Man</code>
• <code>/moviesearch Fast and Furious</code>`;

            bot.sendMessage(msg.chat.id, text, { parse_mode: 'HTML' });
            return;
        }

        const query = match[1].trim();
        const searchUrl = `${SITE_URL}/?search=${encodeURIComponent(query)}`;
        const altUrl = `${SITE_URL}/search?q=${encodeURIComponent(query)}`;

        const text = `🔍 <b>Search Results for:</b> <i>${query}</i>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎬 Click the button below to view all results for <b>"${query}"</b> on BlazeMovieHub.

💡 You'll find:
• Movies matching your search
• HD &amp; 4K download options
• Stream or download directly
• Multiple quality choices`;

        bot.sendMessage(msg.chat.id, text, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: `🔍 Search "${query.slice(0, 20)}"`, url: searchUrl }
                    ],
                    [
                        { text: '🎬 Browse All Movies', url: SITE_URL },
                        { text: '🔙 Movie Menu', callback_data: 'movie_menu' }
                    ]
                ]
            }
        });
    });

    // === LATEST MOVIES ===
    bot.onText(/\/latestmovies/, (msg) => {
        const text = `🔥 <b>Latest Movies &amp; Series</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎬 Fresh releases just added on BlazeMovieHub!

📅 Updated daily with the newest:
• Hollywood blockbusters
• Bollywood hits
• Nollywood releases
• TV Series &amp; Seasons
• Anime &amp; Animations

🌐 Click below to see what's new:`;

        bot.sendMessage(msg.chat.id, text, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '🔥 View Latest Movies', url: `${SITE_URL}/?sort=latest` }
                    ],
                    [
                        { text: '📺 Latest TV Series', url: `${SITE_URL}/?category=tv-series&sort=latest` },
                        { text: '🎬 Latest Films', url: `${SITE_URL}/?sort=latest&type=movie` }
                    ],
                    [
                        { text: '🔙 Back to Menu', callback_data: 'movie_menu' }
                    ]
                ]
            }
        });
    });

    // === TRENDING MOVIES ===
    bot.onText(/\/trending/, (msg) => {
        const text = `📈 <b>Trending Now on BlazeMovieHub</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔥 Most popular movies being downloaded right now!

🏆 Trending Categories:
• 🎬 Top Action Hits
• 😂 Comedy Favorites
• 😱 Horror Thrillers
• 💕 Romantic Picks
• 🚀 Sci-Fi Blockbusters

👇 Click to explore trending content:`;

        bot.sendMessage(msg.chat.id, text, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '📈 View Trending Movies', url: `${SITE_URL}/?sort=trending` }
                    ],
                    [
                        { text: '🔥 Top Action', url: `${SITE_URL}/?category=action&sort=trending` },
                        { text: '😂 Top Comedy', url: `${SITE_URL}/?category=comedy&sort=trending` }
                    ],
                    [
                        { text: '😱 Top Horror', url: `${SITE_URL}/?category=horror&sort=trending` },
                        { text: '🚀 Top Sci-Fi', url: `${SITE_URL}/?category=sci-fi&sort=trending` }
                    ],
                    [
                        { text: '🔙 Back to Menu', callback_data: 'movie_menu' }
                    ]
                ]
            }
        });
    });

    // === DOWNLOAD GUIDE ===
    bot.onText(/\/moviehelp/, (msg) => {
        const text = `📀 <b>How to Download Movies</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎬 <b>Step-by-Step Download Guide</b>

<b>Step 1:</b> 🔍 Search or browse movies
   → Use /moviesearch or /moviecat

<b>Step 2:</b> 🌐 Open BlazeMovieHub
   → Click any link from the bot

<b>Step 3:</b> 🎬 Select your movie
   → Browse results and click on movie

<b>Step 4:</b> 📀 Choose quality
   → Pick from 4K, 1080p, 720p, 480p, 360p

<b>Step 5:</b> ⬇️ Download
   → Click the download button on the site

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ <b>Available Qualities:</b>
📀 4K Ultra HD (2160p) — Best Quality
🎬 Full HD (1080p) — Recommended
📺 HD (720p) — Good Quality
📱 SD (480p) — Mobile Friendly
💾 Low (360p) — Saves Data

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 Site: <a href="${SITE_URL}">BlazeMovieHub</a>
👑 By Arnold T20`;

        bot.sendMessage(msg.chat.id, text, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '🌐 Go to BlazeMovieHub', url: SITE_URL }
                    ],
                    [
                        { text: '🔍 Search a Movie', callback_data: 'movie_search_help' },
                        { text: '🎬 Browse Categories', callback_data: 'movie_categories' }
                    ]
                ]
            }
        });
    });

    // === TOP RATED MOVIES ===
    bot.onText(/\/toprated/, (msg) => {
        const text = `⭐ <b>Top Rated Movies on BlazeMovieHub</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏆 Highest-rated movies of all time!

🌟 Categories:
• All-time classics
• Award winners
• Critic favorites
• Fan favorites

👇 Explore top-rated content:`;

        bot.sendMessage(msg.chat.id, text, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '⭐ View Top Rated', url: `${SITE_URL}/?sort=top_rated` }
                    ],
                    [
                        { text: '🎭 Top Drama', url: `${SITE_URL}/?category=drama&sort=top_rated` },
                        { text: '🎬 Top Action', url: `${SITE_URL}/?category=action&sort=top_rated` }
                    ],
                    [
                        { text: '🌍 Top Adventure', url: `${SITE_URL}/?category=adventure&sort=top_rated` },
                        { text: '🕵️ Top Crime', url: `${SITE_URL}/?category=crime&sort=top_rated` }
                    ],
                    [
                        { text: '🔙 Back to Menu', callback_data: 'movie_menu' }
                    ]
                ]
            }
        });
    });

    // === HANDLE INLINE KEYBOARD CALLBACKS ===
    bot.on('callback_query', async (query) => {
        const data = query.data;
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;

        try {
            if (data === 'movie_menu') {
                const text = `🎬 <b>BlazeMovieHub — T20 Movie Center</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎥 <b>Stream &amp; Download Movies in HD</b>
🌐 Powered by <a href="${SITE_URL}">BlazeMovieHub</a>
👑 By <b>Arnold T20</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🍿 Choose an option below to get started:`;

                await bot.editMessageText(text, {
                    chat_id: chatId,
                    message_id: msgId,
                    parse_mode: 'HTML',
                    reply_markup: buildMainMenuKeyboard()
                });
                await bot.answerCallbackQuery(query.id);

            } else if (data === 'movie_categories') {
                const text = `🎬 <b>Movie Categories</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🍿 Select a category to browse movies:`;

                await bot.editMessageText(text, {
                    chat_id: chatId,
                    message_id: msgId,
                    parse_mode: 'HTML',
                    reply_markup: buildCategoryKeyboard()
                });
                await bot.answerCallbackQuery(query.id);

            } else if (data.startsWith('movie_cat_')) {
                const slug = data.replace('movie_cat_', '');
                const cat = MOVIE_CATEGORIES.find(c => c.slug === slug);
                const catName = cat ? cat.name : slug;

                const text = `${catName} <b>Movies</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎬 Browsing <b>${catName}</b> movies on BlazeMovieHub

📀 Choose your preferred download quality:`;

                await bot.editMessageText(text, {
                    chat_id: chatId,
                    message_id: msgId,
                    parse_mode: 'HTML',
                    reply_markup: buildQualityKeyboard(slug)
                });
                await bot.answerCallbackQuery(query.id, { text: `Opening ${catName}...` });

            } else if (data === 'movie_search_help') {
                const text = `🔍 <b>Search for Movies</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type the command below to search:

<code>/moviesearch &lt;movie name&gt;</code>

Examples:
• <code>/moviesearch Avengers</code>
• <code>/moviesearch John Wick</code>
• <code>/moviesearch Black Panther</code>

Or click the button to search on BlazeMovieHub directly:`;

                await bot.editMessageText(text, {
                    chat_id: chatId,
                    message_id: msgId,
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '🌐 Search on BlazeMovieHub', url: SITE_URL }],
                            [{ text: '🔙 Back to Menu', callback_data: 'movie_menu' }]
                        ]
                    }
                });
                await bot.answerCallbackQuery(query.id);

            } else if (data === 'movie_latest') {
                const text = `🔥 <b>Latest Movies &amp; Series</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎬 Fresh releases just added on BlazeMovieHub!

👇 Click to see what's new:`;

                await bot.editMessageText(text, {
                    chat_id: chatId,
                    message_id: msgId,
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '🔥 View Latest Movies', url: `${SITE_URL}/?sort=latest` }],
                            [
                                { text: '📺 Latest TV Series', url: `${SITE_URL}/?category=tv-series&sort=latest` },
                                { text: '🎬 Latest Films', url: `${SITE_URL}/?sort=latest&type=movie` }
                            ],
                            [{ text: '🔙 Back to Menu', callback_data: 'movie_menu' }]
                        ]
                    }
                });
                await bot.answerCallbackQuery(query.id);

            } else if (data === 'movie_trending') {
                const text = `📈 <b>Trending Now on BlazeMovieHub</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔥 Most popular movies being downloaded right now!

👇 Click to explore trending content:`;

                await bot.editMessageText(text, {
                    chat_id: chatId,
                    message_id: msgId,
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '📈 View All Trending', url: `${SITE_URL}/?sort=trending` }],
                            [
                                { text: '🎬 Action', url: `${SITE_URL}/?category=action&sort=trending` },
                                { text: '😂 Comedy', url: `${SITE_URL}/?category=comedy&sort=trending` }
                            ],
                            [
                                { text: '😱 Horror', url: `${SITE_URL}/?category=horror&sort=trending` },
                                { text: '💕 Romance', url: `${SITE_URL}/?category=romance&sort=trending` }
                            ],
                            [{ text: '🔙 Back to Menu', callback_data: 'movie_menu' }]
                        ]
                    }
                });
                await bot.answerCallbackQuery(query.id);

            } else if (data === 'movie_top_rated') {
                const text = `⭐ <b>Top Rated Movies</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏆 Highest-rated movies on BlazeMovieHub!

👇 Click to view top rated:`;

                await bot.editMessageText(text, {
                    chat_id: chatId,
                    message_id: msgId,
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '⭐ View Top Rated', url: `${SITE_URL}/?sort=top_rated` }],
                            [
                                { text: '🎭 Drama', url: `${SITE_URL}/?category=drama&sort=top_rated` },
                                { text: '🕵️ Crime', url: `${SITE_URL}/?category=crime&sort=top_rated` }
                            ],
                            [{ text: '🔙 Back to Menu', callback_data: 'movie_menu' }]
                        ]
                    }
                });
                await bot.answerCallbackQuery(query.id);

            } else if (data === 'movie_download_guide') {
                const text = `📀 <b>How to Download Movies</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<b>Step 1:</b> 🔍 Search or browse
<b>Step 2:</b> 🌐 Open BlazeMovieHub
<b>Step 3:</b> 🎬 Select your movie
<b>Step 4:</b> 📀 Choose quality (4K/1080p/720p)
<b>Step 5:</b> ⬇️ Click download

⚡ <b>Quality options:</b>
📀 4K • 🎬 1080p • 📺 720p • 📱 480p • 💾 360p`;

                await bot.editMessageText(text, {
                    chat_id: chatId,
                    message_id: msgId,
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '🌐 Go to BlazeMovieHub', url: SITE_URL }],
                            [{ text: '🔙 Back to Menu', callback_data: 'movie_menu' }]
                        ]
                    }
                });
                await bot.answerCallbackQuery(query.id);
            }

        } catch (err) {
            if (!err.message.includes('message is not modified')) {
                console.error('Callback query error:', err.message);
            }
            try { await bot.answerCallbackQuery(query.id); } catch (_) {}
        }
    });
};
