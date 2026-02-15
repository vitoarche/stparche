import { ExtendedClient } from "../structures/Client";
import fs from "fs";
import path from "path";
import { Command } from "../structures/Command";

export default async (client: ExtendedClient) => {
    const commandsPath = path.join(__dirname, "../commands");

    // Ensure directory exists
    if (!fs.existsSync(commandsPath)) return;

    const entries = fs.readdirSync(commandsPath, { withFileTypes: true });

    // Sadece alt dizinlerden komut yükle (üst dizindeki dosyaları yoksay)
    const dirs = entries.filter(entry => entry.isDirectory()).map(entry => entry.name);

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
