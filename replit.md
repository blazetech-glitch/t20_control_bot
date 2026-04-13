# T20 Wolf Control Bot

## Overview
Advanced Telegram bot with group management, AI chatbot, auto-posting, and movie download features.

## Architecture
- **Entry Point**: `bot.js` — Initializes Express health server + Telegram bot, loads plugins
- **Plugin System**: `plugins/index.js` — Loads all feature modules
- **Config**: `config.js` — Environment variable handling

## Required Environment Variables
- `TELEGRAM_TOKEN` — Bot token from @BotFather (required)
- `CHANNEL_ID` — Target channel (default: `@t20classictech`)
- `ADMIN_IDS` — Comma-separated admin user IDs (optional)
- `SOCKS_PROXY` — SOCKS5 proxy URL (optional)

## Key Features

### Movie Hub (BlazeMovieHub)
- Commands: `/movies`, `/moviesearch`, `/moviecat`, `/latestmovies`, `/trending`, `/toprated`, `/moviehelp`
- Site: https://blazemoviehub.t20tech.site
- 16 categories: Action, Comedy, Horror, Romance, Thriller, Sci-Fi, Fantasy, Drama, Crime, Adventure, Animation, Documentary, Bollywood, TV Series, Hollywood, Nollywood
- 5 quality options: 4K, 1080p, 720p, 480p, 360p
- Full inline keyboard navigation

### AI Chatbot (T20 WOLF AI)
- `/chat <message>` — Chat with AI
- DM mode — Auto AI responses in private chat
- API: Supabase-hosted T20 WOLF AI endpoint

### Group Management
- Admin: kick, ban, unban, mute, unmute, delete, pin, unpin, setdesc, setstatus
- Moderation: warn (auto-kick at 3), warnings, clearwarn, timeout, softban
- Settings: antispam, togglewelcome, togglechatbot, setlang, setrules

### Auto-Posting
- Posts tech tips, questions, motivational messages, blog content every 5 hours
- Blog source: blog.t20tech.site
- Commands: `/autopost on/off/now/status`

### Welcome System
- Sends welcome message with user photo on join
- Sends goodbye message on leave
- Royal-themed menu via `/menu`

## Plugins
- `movieCommands.js` — BlazeMovieHub movie download system
- `adminCommands.js` — kick, ban, mute, delete, pin, setstatus
- `moderationCommands.js` — warn, timeout, softban, unpin, setdesc
- `adminManagement.js` — admin list, admin panel, amiadmin check
- `chatbot.js` — T20 WOLF AI integration
- `autoPostingCommands.js` — Scheduled content posting
- `welcomeCommands.js` — Welcome/goodbye + /menu
- `funCommands.js` — 8ball, roll, flip, choose, rate, joke, reverse, upper, lower
- `infoCommands.js` — groupinfo, members, profile
- `userCommands.js` — userinfo, echo, /commands
- `channelCommands.js` — post, testchannel, setchannel, broadcast
- `settingsCommands.js` — settings, setlang, antispam, togglewelcome, setrules, rules
- `help.js` — Help with topic support (/help movies, /help admin, /help ai)
- `start.js` — Start command with inline keyboard
- `stats.js` — Bot statistics with uptime + memory
- `ping.js` — Two-stage ping with API + message latency
- `id.js` — User + chat ID info with status

## Run Command
```
npm install && npm start
```
