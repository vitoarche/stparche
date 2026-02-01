"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: "ready",
    run: (client) => {
        console.log(`Logged in as ${client.user?.tag}!`);
        client.user?.setActivity("STP&ARCHE Music");
    }
};
