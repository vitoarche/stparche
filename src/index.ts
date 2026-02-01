import { ExtendedClient } from "./structures/Client";
import { config } from "dotenv";
import path from "path";
import fs from "fs";

config();

export const client = new ExtendedClient();

// Handler Loading Logic (Basic)
// We will move this to separate handlers later or expanded here
const loadHandlers = async () => {
    const handlersPath = path.join(__dirname, 'handlers');
    const handlerFiles = fs.readdirSync(handlersPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

    for (const file of handlerFiles) {
        const filePath = path.join(handlersPath, file);
        const handler = await import(filePath);
        if (handler.default) {
            // Check if it's the player handler (convention or just try passing client or player)
            // But our player handler needs 'player', others need 'client'.
            // Simple check:
            if (file.includes('playerEventHandler')) {
                handler.default(client.player);
            } else {
                handler.default(client);
            }
        }
    }
}

loadHandlers();

(async () => {
    await client.start();
})();
