import { Player } from "discord-player";
import { GuildQueue, Track } from "discord-player";
import { TextChannel } from "discord.js";

export default (player: Player) => {

    player.events.on("playerStart", (queue: GuildQueue, track: Track) => {
        // metadata is what we passed in play() options
        const metadata = queue.metadata as any;
        if (metadata && metadata.channel) {
            metadata.channel.send(`🎶 Çalıyor: **${track.title}**`);
        } else if (metadata && metadata.editReply) {
            // If we want to send a separate message or edit the interaction response?
            // Usually better to send a new message in the channel
            // interaction.channel is available
        }
    });

    player.events.on("error", (queue: GuildQueue, error: Error) => {
        console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
    });

    player.events.on("playerError", (queue: GuildQueue, error: Error) => {
        console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
    });
}
