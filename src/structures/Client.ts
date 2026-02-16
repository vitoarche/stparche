import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import { Player } from 'discord-player';
import { DefaultExtractors } from '@discord-player/extractor';
import { YoutubeiExtractor } from "discord-player-youtubei";
import ffmpeg from 'ffmpeg-static';

process.env.FFMPEG_PATH = ffmpeg || 'ffmpeg'; // Force FFmpeg path

export class ExtendedClient extends Client {
    public commands: Collection<string, any> = new Collection();
    public player: Player;

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers
            ],
            partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember]
        });

        this.player = new Player(this);
    }

    public async start() {
        // Register YoutubeiExtractor for YouTube (play-dl stream is broken)
        await this.player.extractors.register(YoutubeiExtractor, {});

        // Load default extractors for non-YouTube sources
        await this.player.extractors.loadMulti(DefaultExtractors);

        console.log("Extractors loaded:", this.player.extractors.store.keys());

        // Debug listener
        this.player.events.on('error', (queue, error) => console.log(`[PlayerError] ${error.message}`));
        this.player.events.on('playerError', (queue, error) => console.log(`[ConnectionError] ${error.message}`));

        await this.login(process.env.DISCORD_TOKEN);
    }
}
