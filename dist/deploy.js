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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = require("dotenv");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
(0, dotenv_1.config)();
const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandsPath = path_1.default.join(__dirname, "commands");
// Recursive function to get all files
const getFiles = (dir) => {
    const files = [];
    const entries = fs_1.default.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path_1.default.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...getFiles(fullPath));
        }
        else if (entry.name.endsWith('.ts') || entry.name.endsWith('.js')) {
            files.push(fullPath);
        }
    }
    return files;
};
const commandFiles = getFiles(commandsPath);
(async () => {
    for (const file of commandFiles) {
        const command = (await Promise.resolve(`${file}`).then(s => __importStar(require(s)))).default;
        if (command && command.data) {
            commands.push(command.data.toJSON());
        }
    }
    const rest = new discord_js_1.REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        // The put method is used to fully refresh all commands in the guild with the current set
        // Note: For global commands, use Routes.applicationCommands(clientId)
        // Here we use guild commands for instant updates during dev
        if (process.env.GUILD_ID) {
            await rest.put(discord_js_1.Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands });
            console.log("Successfully reloaded application (/) commands (Guild).");
        }
        else {
            await rest.put(discord_js_1.Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
            console.log("Successfully reloaded application (/) commands (Global).");
        }
    }
    catch (error) {
        console.error(error);
    }
})();
