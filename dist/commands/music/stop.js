"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discord_player_1 = require("discord-player");
const command = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("stop")
        .setDescription("Müziği durdurur ve botu kanaldan çıkarır."),
    run: async ({ interaction }) => {
        const queue = (0, discord_player_1.useQueue)(interaction.guildId);
        if (!queue) {
            await interaction.reply({ content: "Şu anda çalan bir müzik yok.", ephemeral: true });
            return;
        }
        queue.delete();
        await interaction.reply("🛑 Müzik durduruldu ve liste temizlendi.");
    }
};
exports.default = command;
