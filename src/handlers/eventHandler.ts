import { ExtendedClient } from "../structures/Client";
import fs from "fs";
import path from "path";

export default async (client: ExtendedClient) => {
    const eventsPath = path.join(__dirname, "../events");

    if (!fs.existsSync(eventsPath)) return;

    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".ts") || file.endsWith(".js"));

    for (const file of eventFiles) {
        const event = (await import(path.join(eventsPath, file))).default;
        if (event.name && event.run) {
            client.on(event.name, (...args) => event.run(client, ...args));
            console.log(`Event Loaded: ${event.name}`);
        }
    }
}
