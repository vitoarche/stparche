"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendedClient = void 0;
const discord_js_1 = require("discord.js");
const discord_player_1 = require("discord-player");
const extractor_1 = require("@discord-player/extractor");
const discord_player_youtubei_1 = require("discord-player-youtubei");
const ffmpeg_static_1 = __importDefault(require("ffmpeg-static"));
process.env.FFMPEG_PATH = ffmpeg_static_1.default || 'ffmpeg'; // Force FFmpeg path
class ExtendedClient extends discord_js_1.Client {
    commands = new discord_js_1.Collection();
    player;
    constructor() {
        super({
            intents: [
                discord_js_1.GatewayIntentBits.Guilds,
                discord_js_1.GatewayIntentBits.GuildVoiceStates,
                discord_js_1.GatewayIntentBits.GuildMessages,
                discord_js_1.GatewayIntentBits.MessageContent,
                discord_js_1.GatewayIntentBits.GuildMembers
            ],
            partials: [discord_js_1.Partials.Channel, discord_js_1.Partials.Message, discord_js_1.Partials.User, discord_js_1.Partials.GuildMember]
        });
        this.player = new discord_player_1.Player(this);
    }
    async start() {
        // Register YoutubeiExtractor for YouTube (play-dl stream is broken)
        await this.player.extractors.register(discord_player_youtubei_1.YoutubeiExtractor, {});
        // Load default extractors for non-YouTube sources
        await this.player.extractors.loadMulti(extractor_1.DefaultExtractors);
        console.log("Extractors loaded:", this.player.extractors.store.keys());
        // Debug listener
        this.player.events.on('error', (queue, error) => console.log(`[PlayerError] ${error.message}`));
        this.player.events.on('playerError', (queue, error) => console.log(`[ConnectionError] ${error.message}`));
        await this.login(process.env.DISCORD_TOKEN);
    }
}
exports.ExtendedClient = ExtendedClient;
