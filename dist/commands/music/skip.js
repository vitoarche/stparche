"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discord_player_1 = require("discord-player");
const command = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("skip")
        .setDescription("Çalan şarkıyı geçer."),
    run: async ({ interaction }) => {
        const queue = (0, discord_player_1.useQueue)(interaction.guildId);
        if (!queue || !queue.isPlaying()) {
            await interaction.reply({ content: "Şu anda çalan bir şarkı yok.", ephemeral: true });
            return;
        }
        queue.node.skip();
        await interaction.reply("⏭️ Şarkı geçildi!");
    }
};
exports.default = command;
