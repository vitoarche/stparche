"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
const cooldowns = new Set();
exports.default = {
    name: "messageCreate",
    run: async (client, message) => {
        if (message.author.bot || !message.guild)
            return;
        // Simple cooldown to prevent spamming
        const key = `${message.guild.id}-${message.author.id}`;
        if (cooldowns.has(key))
            return;
        cooldowns.add(key);
        setTimeout(() => cooldowns.delete(key), 60000); // 1 minute cooldown
        // XP Logic
        const xpToAdd = Math.floor(Math.random() * 10) + 15; // 15-24 XP
        const user = database_1.default.prepare('SELECT * FROM levels WHERE user_id = ? AND guild_id = ?').get(message.author.id, message.guild.id);
        if (!user) {
            database_1.default.prepare('INSERT INTO levels (user_id, guild_id, xp, level) VALUES (?, ?, ?, ?)').run(message.author.id, message.guild.id, xpToAdd, 1);
        }
        else {
            const nextLevel = user.level * 100; // Simple buffering: level * 100 xp needed for next level (can be improved)
            let newXp = user.xp + xpToAdd;
            let newLevel = user.level;
            if (newXp >= nextLevel) {
                newLevel++;
                newXp -= nextLevel;
                if ("send" in message.channel) {
                    message.channel.send(`🎉 Tebrikler ${message.author}! Seviye atladın! Yeni Seviye: **${newLevel}**`);
                }
            }
            database_1.default.prepare('UPDATE levels SET xp = ?, level = ? WHERE user_id = ? AND guild_id = ?').run(newXp, newLevel, message.author.id, message.guild.id);
        }
    }
};
