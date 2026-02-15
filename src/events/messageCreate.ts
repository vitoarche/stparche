import { ExtendedClient } from "../structures/Client";
import { Message } from "discord.js";
import db from "../database";

const cooldowns = new Set();

export default {
    name: "messageCreate",
    run: async (client: ExtendedClient, message: Message) => {
        if (message.author.bot || !message.guild) return;

        // Simple cooldown to prevent spamming
        const key = `${message.guild.id}-${message.author.id}`;
        if (cooldowns.has(key)) return;

        cooldowns.add(key);
        setTimeout(() => cooldowns.delete(key), 60000); // 1 minute cooldown

        // XP Logic
        const xpToAdd = Math.floor(Math.random() * 10) + 15; // 15-24 XP

        const user = db.prepare('SELECT * FROM levels WHERE user_id = ? AND guild_id = ?').get(message.author.id, message.guild.id) as any;

        if (!user) {
            db.prepare('INSERT INTO levels (user_id, guild_id, xp, level) VALUES (?, ?, ?, ?)').run(message.author.id, message.guild.id, xpToAdd, 1);
        } else {
            const nextLevel = user.level * 100; // Simple buffering: level * 100 xp needed for next level (can be improved)
            let newXp = user.xp + xpToAdd;
            let newLevel = user.level;

            if (newXp >= nextLevel) {
                newLevel++;
                newXp -= nextLevel;
                if ("send" in message.channel) {
                    await message.channel.send(`🎉 Tebrikler ${message.author}! Seviye atladın! Yeni Seviye: **${newLevel}**`).catch(console.error);
                }
            }

            db.prepare('UPDATE levels SET xp = ?, level = ? WHERE user_id = ? AND guild_id = ?').run(newXp, newLevel, message.author.id, message.guild.id);
        }
    }
}
