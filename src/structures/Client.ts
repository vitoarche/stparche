import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import { Player } from 'discord-player';
import { DefaultExtractors } from '@discord-player/extractor';
import { PlayDLExtractor } from "../extractors/PlayDLExtractor";
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
        // await this.player.extractors.loadMulti(DefaultExtractors);

        // Register Custom PlayDL Extractor
        await this.player.extractors.register(PlayDLExtractor, {});

        // Load Defaults AFTER custom to ensure custom has priority? 
        // Or just don't load defaults for now to see if PlayDL works in isolation.
        // Let's load defaults after.
        await this.player.extractors.loadMulti(DefaultExtractors);

        console.log("Extractors loaded:", this.player.extractors.store.keys());

        await this.login(process.env.DISCORD_TOKEN);
    }
}
