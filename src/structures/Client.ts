import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import { Player } from 'discord-player';
import { DefaultExtractors } from '@discord-player/extractor';
import { YtDlpExtractor } from '../extractors/YtDlpExtractor';
import ffmpeg from 'ffmpeg-static';

process.env.FFMPEG_PATH = ffmpeg || 'ffmpeg';

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
        // YtDlpExtractor: yt-dlp binary üzerinden YouTube stream (en stabil yöntem)
        await this.player.extractors.register(YtDlpExtractor, {});

        // Diğer extractor'lar (SoundCloud, Spotify, Apple Music vb.)
        await this.player.extractors.loadMulti(DefaultExtractors);

        console.log("Extractors loaded:", this.player.extractors.store.keys());

        await this.login(process.env.DISCORD_TOKEN);
    }
}
