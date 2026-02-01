import { ExtendedClient } from "../structures/Client";

export default {
    name: "ready",
    run: (client: ExtendedClient) => {
        console.log(`Logged in as ${client.user?.tag}!`);
        client.user?.setActivity("STP&ARCHE Music");
    }
}
