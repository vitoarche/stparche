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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.default = async (client) => {
    const commandsPath = path_1.default.join(__dirname, "../commands");
    // Ensure directory exists
    if (!fs_1.default.existsSync(commandsPath))
        return;
    const commandFiles = fs_1.default.readdirSync(commandsPath).filter(file => file.endsWith(".ts") || file.endsWith(".js"));
    // Handling subdirectories if we want categorizing
    const dirs = fs_1.default.readdirSync(commandsPath).filter(file => fs_1.default.statSync(path_1.default.join(commandsPath, file)).isDirectory());
    // Load top level commands
    for (const file of commandFiles) {
        const command = (await Promise.resolve(`${path_1.default.join(commandsPath, file)}`).then(s => __importStar(require(s)))).default;
        if (command && command.data) {
            client.commands.set(command.data.name, command);
            console.log(`Command Loaded: ${command.data.name}`);
        }
    }
    // Load subdirectories
    for (const dir of dirs) {
        const subFiles = fs_1.default.readdirSync(path_1.default.join(commandsPath, dir)).filter(file => file.endsWith(".ts") || file.endsWith(".js"));
        for (const file of subFiles) {
            const command = (await Promise.resolve(`${path_1.default.join(commandsPath, dir, file)}`).then(s => __importStar(require(s)))).default;
            if (command && command.data) {
                client.commands.set(command.data.name, command);
                console.log(`Command Loaded: ${command.data.name} (Category: ${dir})`);
            }
        }
    }
};
