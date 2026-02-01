"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const command = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("kick")
        .setDescription("Bir kullanıcıyı sunucudan atar.")
        .addUserOption(option => option.setName("target").setDescription("Atılacak kullanıcı").setRequired(true))
        .addStringOption(option => option.setName("reason").setDescription("Sebep"))
        .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.KickMembers),
    run: async ({ interaction }) => {
        const target = interaction.options.getMember("target");
        const reason = interaction.options.getString("reason") || "Sebep belirtilmedi.";
        if (!target) {
            await interaction.reply({ content: "Kullanıcı bulunamadı.", ephemeral: true });
            return;
        }
        if (!target.kickable) {
            await interaction.reply({ content: "Bu kullanıcıyı atamıyorum (Yetersiz yetki veya rol sırası).", ephemeral: true });
            return;
        }
        await target.kick(reason);
        await interaction.reply(`🔨 **${target.user.tag}** sunucudan atıldı. Sebep: ${reason}`);
    }
};
exports.default = command;
