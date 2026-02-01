"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (player) => {
    player.events.on("playerStart", (queue, track) => {
        // metadata is what we passed in play() options
        const metadata = queue.metadata;
        if (metadata && metadata.channel) {
            metadata.channel.send(`🎶 Çalıyor: **${track.title}**`);
        }
        else if (metadata && metadata.editReply) {
            // If we want to send a separate message or edit the interaction response?
            // Usually better to send a new message in the channel
            // interaction.channel is available
        }
    });
    player.events.on("error", (queue, error) => {
        console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
    });
    player.events.on("playerError", (queue, error) => {
        console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
    });
};
