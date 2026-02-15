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
            console.log(`Main play attempt failed: ${e}`);
            // Fallback: If it's a URL and failed, try to get title via play-dl and search
            try {
                const play = await import('play-dl');
                if (await play.validate(query) === 'yt_video') {
                    const info = await play.video_info(query);
                    const title = info.video_details.title;
                    if (title) {
                        await interaction.editReply(`⚠️ Link doğrudan çalınamadı, ismiyle aranıyor: **${title}**...`);
                        const { track } = await player.play(member.voice.channel, title, {
                            nodeOptions: { metadata: { channel: interaction.channel, interaction: interaction } }
                        });
                        await interaction.editReply(`🎶 **${track.title}** sıraya eklendi! (Alternatif yöntem)`);
                        return;
                    }
                }
            } catch (fallbackError) {
                console.error("Fallback failed:", fallbackError);
            }

            await interaction.editReply(`❌ Bir hata oluştu: ${e}`);
        }
    }
}

export default command;
