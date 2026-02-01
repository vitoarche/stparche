"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const command = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pong! Botun gecikmesini gösterir."),
    run: async ({ interaction, client }) => {
        await interaction.reply(`Pong! Gecikme: ${client.ws.ping}ms`);
    }
};
exports.default = command;
