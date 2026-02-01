import { SlashCommandBuilder, PermissionFlagsBits, GuildMember } from "discord.js";
import { Command } from "../../structures/Command";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Bir kullanıcıyı sunucudan yasaklar.")
        .addUserOption(option => option.setName("target").setDescription("Yasaklanacak kullanıcı").setRequired(true))
        .addStringOption(option => option.setName("reason").setDescription("Sebep"))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    run: async ({ interaction }) => {
        const target = interaction.options.getMember("target") as GuildMember;
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
}

export default command;
