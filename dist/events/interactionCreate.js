"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: "interactionCreate",
    run: async (client, interaction) => {
        if (!interaction.isChatInputCommand())
            return; // Only handle slash commands
        const command = client.commands.get(interaction.commandName);
        if (!command)
            return;
        try {
            await command.run({ interaction, client });
        }
        catch (error) {
            console.error(error);
            await interaction.reply({ content: "Bir hata oluştu!", ephemeral: true });
        }
    }
};
