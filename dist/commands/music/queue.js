"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discord_player_1 = require("discord-player");
const command = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("queue")
        .setDescription("Müzik kuyruğunu gösterir."),
    run: async ({ interaction }) => {
        const queue = (0, discord_player_1.useQueue)(interaction.guildId);
        if (!queue || !queue.tracks.toArray().length) {
            await interaction.reply({ content: "Kuyruk boş.", ephemeral: true });
            return;
        }
        const tracks = queue.tracks.toArray();
        const currentTrack = queue.currentTrack;
        const list = tracks.slice(0, 10).map((track, i) => {
            return `${i + 1}. **${track.title}** - ${track.author}`;
        }).join("\n");
        await interaction.reply({
            embeds: [{
                    title: "Müzik Kuyruğu",
                    description: `**Çalıyor:** ${currentTrack?.title}\n\n${list}\n\n${tracks.length > 10 ? `...ve ${tracks.length - 10} şarkı daha.` : ""}`,
                    color: 0x5865F2,
                    footer: { text: "STP&ARCHE Bot" }
                }]
        });
    }
};
exports.default = command;
