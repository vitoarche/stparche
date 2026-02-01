import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from "discord.js";
import { ExtendedClient } from "./Client";

export interface Command {
    data: SlashCommandBuilder | any;
    run: (options: { interaction: ChatInputCommandInteraction, client: ExtendedClient }) => Promise<void>;
}
