"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const database_1 = __importDefault(require("../../database"));
const command = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("rank")
        .setDescription("Seviyenizi ve XP durumunuzu gösterir.")
        .addUserOption(option => option.setName("target").setDescription("Başka bir kullanıcının seviyesi")),
    run: async ({ interaction }) => {
        const target = interaction.options.getUser("target") || interaction.user;
        const user = database_1.default.prepare('SELECT * FROM levels WHERE user_id = ? AND guild_id = ?').get(target.id, interaction.guildId);
        if (!user) {
            await interaction.reply(`${target.username} henüz hiç XP kazanmamış.`);
            return;
        }
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle(`Rank: ${target.username}`)
            .addFields({ name: 'Level', value: `${user.level}`, inline: true }, { name: 'XP', value: `${user.xp}`, inline: true })
            .setThumbnail(target.displayAvatarURL());
        await interaction.reply({ embeds: [embed] });
    }
};
exports.default = command;
