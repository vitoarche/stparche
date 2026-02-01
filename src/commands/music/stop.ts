import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../structures/Command";
import { useQueue } from "discord-player";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Müziği durdurur ve botu kanaldan çıkarır."),
    run: async ({ interaction }) => {
        const queue = useQueue(interaction.guildId!);

        if (!queue) {
            await interaction.reply({ content: "Şu anda çalan bir müzik yok.", ephemeral: true });
            return;
        }

        queue.delete();
        await interaction.reply("🛑 Müzik durduruldu ve liste temizlendi.");
    }
}

export default command;
