import { ExtendedClient } from "../structures/Client";
import { Interaction } from "discord.js";

export default {
    name: "interactionCreate",
    run: async (client: ExtendedClient, interaction: Interaction) => {
        if (!interaction.isChatInputCommand()) return; // Only handle slash commands

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.run({ interaction, client });
        } catch (error) {
            console.error(error);
            try {
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: "Komut çalıştırılırken bir hata oluştu!", ephemeral: true });
                } else {
                    await interaction.reply({ content: "Bir hata oluştu!", ephemeral: true });
                }
            } catch (e) {
                // Interaction süresi dolmuş olabilir, sessizce logla
                console.error("Error handler failed:", e);
            }
        }
    }
}
