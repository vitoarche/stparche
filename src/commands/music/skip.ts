import { SlashCommandBuilder, GuildMember } from "discord.js";
import { Command } from "../../structures/Command";
import { useQueue } from "discord-player";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Çalan şarkıyı geçer."),
    run: async ({ interaction }) => {
        const queue = useQueue(interaction.guildId!);

        if (!queue || !queue.isPlaying()) {
            await interaction.reply({ content: "Şu anda çalan bir şarkı yok.", ephemeral: true });
            return;
        }

        queue.node.skip();
        await interaction.reply("⏭️ Şarkı geçildi!");
    }
}

export default command;
