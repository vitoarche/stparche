import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { Command } from "../../structures/Command";
import db from "../../database";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName("rank")
        .setDescription("Seviyenizi ve XP durumunuzu gösterir.")
        .addUserOption(option => option.setName("target").setDescription("Başka bir kullanıcının seviyesi")),
    run: async ({ interaction }) => {
        const target = interaction.options.getUser("target") || interaction.user;

        const user = db.prepare('SELECT * FROM levels WHERE user_id = ? AND guild_id = ?').get(target.id, interaction.guildId!) as any;

        if (!user) {
            await interaction.reply(`${target.username} henüz hiç XP kazanmamış.`);
            return;
        }

        const nextLevelXp = user.level * 100;
        const progressPercent = Math.floor((user.xp / nextLevelXp) * 100);
        const barLength = 10;
        const filledBars = Math.round((user.xp / nextLevelXp) * barLength);
        const progressBar = "█".repeat(filledBars) + "░".repeat(barLength - filledBars);

        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle(`Rank: ${target.username}`)
            .addFields(
                { name: 'Level', value: `${user.level}`, inline: true },
                { name: 'XP', value: `${user.xp} / ${nextLevelXp}`, inline: true },
                { name: 'İlerleme', value: `${progressBar} %${progressPercent}`, inline: false }
            )
            .setThumbnail(target.displayAvatarURL());

        await interaction.reply({ embeds: [embed] });
    }
}

export default command;
