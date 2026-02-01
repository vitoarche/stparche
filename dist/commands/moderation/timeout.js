"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const command = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("timeout")
        .setDescription("Bir kullanıcıya zamanaşımı (timeout) uygular.")
        .addUserOption(option => option.setName("target").setDescription("Kullanıcı").setRequired(true))
        .addIntegerOption(option => option.setName("duration").setDescription("Süre (dakika)").setRequired(true))
        .addStringOption(option => option.setName("reason").setDescription("Sebep"))
        .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ModerateMembers),
    run: async ({ interaction }) => {
        const target = interaction.options.getMember("target");
        const duration = interaction.options.getInteger("duration", true);
        const reason = interaction.options.getString("reason") || "Sebep belirtilmedi.";
        if (!target) {
            await interaction.reply({ content: "Kullanıcı bulunamadı.", ephemeral: true });
            return;
        }
        if (!target.moderatable) {
            await interaction.reply({ content: "Bu kullanıcıya işlem yapamıyorum.", ephemeral: true });
            return;
        }
        await target.timeout(duration * 60 * 1000, reason);
        await interaction.reply(`🔇 **${target.user.tag}** kullanıcısına **${duration} dakika** timeout uygulandı. Sebep: ${reason}`);
    }
};
exports.default = command;
