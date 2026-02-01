import { ExtendedClient } from "../structures/Client";
import fs from "fs";
import path from "path";
import { Command } from "../structures/Command";

export default async (client: ExtendedClient) => {
    const commandsPath = path.join(__dirname, "../commands");

    // Ensure directory exists
    if (!fs.existsSync(commandsPath)) return;

    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".ts") || file.endsWith(".js"));

    // Handling subdirectories if we want categorizing
    const dirs = fs.readdirSync(commandsPath).filter(file => fs.statSync(path.join(commandsPath, file)).isDirectory());

    // Load top level commands
    for (const file of commandFiles) {
        const command: Command = (await import(path.join(commandsPath, file))).default;
        if (command && command.data) {
            client.commands.set(command.data.name, command);
            console.log(`Command Loaded: ${command.data.name}`);
        }
    }

    // Load subdirectories
    for (const dir of dirs) {
        const subFiles = fs.readdirSync(path.join(commandsPath, dir)).filter(file => file.endsWith(".ts") || file.endsWith(".js"));
        for (const file of subFiles) {
            const command: Command = (await import(path.join(commandsPath, dir, file))).default;
            if (command && command.data) {
                client.commands.set(command.data.name, command);
                console.log(`Command Loaded: ${command.data.name} (Category: ${dir})`);
            }
        }
    }
}
