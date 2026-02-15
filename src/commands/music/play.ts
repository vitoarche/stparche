import { SlashCommandBuilder, GuildMember, ChatInputCommandInteraction } from "discord.js";
import { Command } from "../../structures/Command";
import { useMainPlayer } from "discord-player";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Bir şarkı veya çalma listesi çalar.")
        .addStringOption(option =>
            option.setName("query")
                .setDescription("Şarkı adı veya linki")
                .setRequired(true)
        ),
    run: async ({ interaction, client }) => {
        const player = useMainPlayer();
        if (!player) return;

        const member = interaction.member as GuildMember;
        if (!member.voice.channel) {
            await interaction.reply({ content: "Bir ses kanalında olmalısınız!", ephemeral: true });
            return;
        }

        const query = interaction.options.getString("query", true);

        await interaction.deferReply();

        try {
            const { track } = await player.play(member.voice.channel, query, {
                nodeOptions: {
                    metadata: { channel: interaction.channel, interaction: interaction }
                }
            });

            await interaction.editReply(`🎶 **${track.title}** sıraya eklendi!`);
        } catch (e) {
            console.error(`Play failed: ${e}`);
            await interaction.editReply(`❌ Şarkı çalınamadı. Lütfen farklı bir link veya arama terimi deneyin.`);
        }
    }
}

export default command;
