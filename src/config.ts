import { ColorResolvable } from "discord.js";

export const botConfig = {
    colors: {
        primary: "#5865F2" as ColorResolvable,
        success: "#57F287" as ColorResolvable,
        error: "#ED4245" as ColorResolvable,
        warning: "#FEE75C" as ColorResolvable
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
}
