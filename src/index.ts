import { ExtendedClient } from "./structures/Client";
import { config } from "dotenv";
import path from "path";
import fs from "fs";

config();

export const client = new ExtendedClient();

const loadHandlers = async () => {
    const handlersPath = path.join(__dirname, 'handlers');
    const handlerFiles = fs.readdirSync(handlersPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

    for (const file of handlerFiles) {
        const filePath = path.join(handlersPath, file);
        const handler = await import(filePath);
        if (handler.default) {
            if (file.includes('playerEventHandler')) {
                handler.default(client.player);
            } else {
                handler.default(client);
            }
        }
    }
}

(async () => {
    await loadHandlers();
    await client.start();
})();
