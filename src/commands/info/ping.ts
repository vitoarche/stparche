import { SlashCommandBuilder } from "discord.js";
import { ExtendedClient } from "../../structures/Client";
import { Command } from "../../structures/Command";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pong! Botun gecikmesini gösterir."),
    run: async ({ interaction, client }) => {
        await interaction.reply(`Pong! Gecikme: ${client.ws.ping}ms`);
    }
}

export default command;
