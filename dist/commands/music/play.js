"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discord_player_1 = require("discord-player");
const command = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("play")
        .setDescription("Bir şarkı veya çalma listesi çalar.")
        .addStringOption(option => option.setName("query")
        .setDescription("Şarkı adı veya linki")
        .setRequired(true)),
    run: async ({ interaction, client }) => {
        const player = (0, discord_player_1.useMainPlayer)();
        if (!player)
            return;
        const member = interaction.member;
        if (!member.voice.channel) {
            await interaction.reply({ content: "Bir ses kanalında olmalısınız!", ephemeral: true });
            return;
        }
        const query = interaction.options.getString("query", true);
        await interaction.deferReply();
        try {
            const { track } = await player.play(member.voice.channel, query, {
                nodeOptions: {
                    metadata: interaction
                }
            });
            await interaction.editReply(`🎶 **${track.title}** çalınıyor!`);
        }
        catch (e) {
            console.error(e); // Better error logging
            await interaction.editReply(`❌ Bir hata oluştu: ${e}`);
        }
    }
};
exports.default = command;
