"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const command = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("ban")
        .setDescription("Bir kullanıcıyı sunucudan yasaklar.")
        .addUserOption(option => option.setName("target").setDescription("Yasaklanacak kullanıcı").setRequired(true))
        .addStringOption(option => option.setName("reason").setDescription("Sebep"))
        .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.BanMembers),
    run: async ({ interaction }) => {
        const target = interaction.options.getMember("target");
        const reason = interaction.options.getString("reason") || "Sebep belirtilmedi.";
        if (!target) {
            await interaction.reply({ content: "Kullanıcı bulunamadı.", ephemeral: true });
            return;
        }
        if (!target.bannable) {
            await interaction.reply({ content: "Bu kullanıcıyı yasaklayamıyorum.", ephemeral: true });
            return;
        }
        await target.ban({ reason });
        await interaction.reply(`🚫 **${target.user.tag}** sunucudan yasaklandı. Sebep: ${reason}`);
    }
};
exports.default = command;
