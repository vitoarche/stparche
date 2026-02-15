import { Player } from "discord-player";
import { GuildQueue, Track } from "discord-player";
import { TextChannel } from "discord.js";

export default (player: Player) => {

    player.events.on("playerStart", (queue: GuildQueue, track: Track) => {
        const metadata = queue.metadata as any;
        if (metadata?.channel && typeof metadata.channel.send === 'function') {
            metadata.channel.send(`🎶 Çalıyor: **${track.title}**`).catch(console.error);
        }
    });

    player.events.on("emptyQueue", (queue: GuildQueue) => {
        const metadata = queue.metadata as any;
        if (metadata?.channel && typeof metadata.channel.send === 'function') {
            metadata.channel.send("✅ Kuyruk bitti, başka şarkı kalmadı.").catch(console.error);
        }
    });

    player.events.on("error", (queue: GuildQueue, error: Error) => {
        console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
    });

    player.events.on("playerError", (queue: GuildQueue, error: Error) => {
        console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
    });
}
