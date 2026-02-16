"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discord_player_1 = require("discord-player");
const command = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("play")
        .setDescription("Bir şarkı veya çalma listesi çalar.")
        .addStringOption(option => option.setName("query")
        .setDescription("Şarkı adı veya linki")
        .setRequired(true)),
    run: async ({ interaction, client }) => {
        const player = (0, discord_player_1.useMainPlayer)();
        if (!player)
            return;
        const member = interaction.member;
        if (!member.voice.channel) {
            await interaction.reply({ content: "Bir ses kanalında olmalısınız!", ephemeral: true });
            return;
        }
        const query = interaction.options.getString("query", true);
        await interaction.deferReply();
        try {
            const { track } = await player.play(member.voice.channel, query, {
                nodeOptions: {
                    metadata: interaction
                }
            });
            await interaction.editReply(`🎶 **${track.title}** çalınıyor!`);
        }
        catch (e) {
            console.log(`Main play attempt failed: ${e}`);
            // Fallback: If it's a URL and failed, try to get title via play-dl and search
            try {
                const play = await Promise.resolve().then(() => __importStar(require('play-dl')));
                if (await play.validate(query) === 'yt_video') {
                    const info = await play.video_info(query);
                    const title = info.video_details.title;
                    if (title) {
                        await interaction.editReply(`⚠️ Link doğrudan çalınamadı, ismiyle aranıyor: **${title}**...`);
                        const { track } = await player.play(member.voice.channel, title, {
                            nodeOptions: { metadata: interaction }
                        });
                        await interaction.editReply(`🎶 **${track.title}** çalınıyor! (Alternatif yöntem)`);
                        return;
                    }
                }
            }
            catch (fallbackError) {
                console.error("Fallback failed:", fallbackError);
            }
            await interaction.editReply(`❌ Bir hata oluştu: ${e}`);
        }
    }
};
exports.default = command;
