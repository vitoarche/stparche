"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendedClient = void 0;
const discord_js_1 = require("discord.js");
const discord_player_1 = require("discord-player");
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
        this.player.extractors.loadDefault();
    }
    start() {
        this.login(process.env.DISCORD_TOKEN);
    }
}
exports.ExtendedClient = ExtendedClient;
