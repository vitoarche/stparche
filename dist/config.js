"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    colors: {
        primary: "#5865F2",
        success: "#57F287",
        error: "#ED4245",
        warning: "#FEE75C"
    },
    prefix: "!", // Eğer prefixli komut yapılacaksa (şimdilik slash odaklıyız)
    opt: {
        maxVol: 100,
        loopMessage: false,
        discordPlayer: {
            ytdlOptions: {
                quality: 'highestaudio',
                highWaterMark: 1 << 25
            }
        }
    }
};
