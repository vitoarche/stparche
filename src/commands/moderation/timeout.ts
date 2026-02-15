import { SlashCommandBuilder, PermissionFlagsBits, GuildMember } from "discord.js";
import { Command } from "../../structures/Command";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName("timeout")
        .setDescription("Bir kullanıcıya zamanaşımı (timeout) uygular.")
        .addUserOption(option => option.setName("target").setDescription("Kullanıcı").setRequired(true))
        .addIntegerOption(option => option.setName("duration").setDescription("Süre (dakika, maks 40320)").setRequired(true).setMinValue(1).setMaxValue(40320))
        .addStringOption(option => option.setName("reason").setDescription("Sebep"))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    run: async ({ interaction }) => {
        const target = interaction.options.getMember("target") as GuildMember;
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
}

export default command;
