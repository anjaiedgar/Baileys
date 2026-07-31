"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Defaults_1 = require("../Defaults");
const registration_1 = require("./registration");
/**
 * export the last socket layer
 *
 * NOTE: makeWASocket is now ASYNC. This changed to allow wiring in the
 * `username` and `communities` feature layers (ported from xata-bail),
 * which are written as native ESM (.mjs) modules and can only be loaded
 * into this CommonJS chain via a dynamic import().
 *
 * Before: const sock = makeWASocket(config)
 * Now:    const sock = await makeWASocket(config)
 */
const makeWASocket = async (config) => {
    // existing, untouched synchronous CJS chain
    // (socket -> usync -> chats -> groups -> newsletter -> messages-send ->
    //  messages-recv -> business -> registration)
    const baseSock = (0, registration_1.makeRegistrationSocket)({
        ...Defaults_1.DEFAULT_CONNECTION_CONFIG,
        ...config
    });
    // new ESM feature layers, loaded via dynamic import and layered on top
    const { makeUsernameSocketLayer } = await import('./username.mjs');
    const { makeCommunitiesSocketLayer } = await import('./communities.mjs');
    let sock = makeUsernameSocketLayer(baseSock);
    sock = makeCommunitiesSocketLayer(sock);
    return sock;
};
exports.default = makeWASocket;
exports.makeWASocket = makeWASocket;
