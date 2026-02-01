import { REST, Routes } from "discord.js";
import { config } from "dotenv";
import fs from "fs";
import path from "path";

config();

const commands: any[] = [];
// Grab all the command files from the commands directory you created earlier
const commandsPath = path.join(__dirname, "commands");

// Recursive function to get all files
const getFiles = (dir: string): string[] => {
    const files: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...getFiles(fullPath));
        } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.js')) {
            files.push(fullPath);
        }
    }
    return files;
};

const commandFiles = getFiles(commandsPath);

(async () => {
    for (const file of commandFiles) {
        const command = (await import(file)).default;
        if (command && command.data) {
            commands.push(command.data.toJSON());
        }
    }

    const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);

    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        // Note: For global commands, use Routes.applicationCommands(clientId)
        // Here we use guild commands for instant updates during dev
        if (process.env.GUILD_ID) {
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!),
                { body: commands },
            );
            console.log("Successfully reloaded application (/) commands (Guild).");
        } else {
            await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID!),
                { body: commands },
            );
            console.log("Successfully reloaded application (/) commands (Global).");
        }


    } catch (error) {
        console.error(error);
    }
})();
