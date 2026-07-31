"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TC_TOKEN_INDEX_KEY = void 0;
exports.readTcTokenIndex = readTcTokenIndex;
exports.buildMergedTcTokenIndexWrite = buildMergedTcTokenIndexWrite;
exports.isTcTokenExpired = isTcTokenExpired;
exports.shouldSendNewTcToken = shouldSendNewTcToken;
exports.resolveTcTokenJid = resolveTcTokenJid;
exports.resolveIssuanceJid = resolveIssuanceJid;
exports.buildTcTokenFromJid = buildTcTokenFromJid;
exports.storeTcTokensFromIqResult = storeTcTokensFromIqResult;
const WABinary_1 = require("../WABinary");
/**
 * "Trusted contact token" utilities, ported from xata-bail as an available
 * module. NOT wired automatically into edgar-bail's messages-recv.js /
 * messages-send.js / chats.js / process-message.js (xata-bail touches all
 * four for this feature) -- doing that blind, across the message send/receive
 * hot path, isn't safe without the ability to test against a live connection
 * here. The functions below are ready to be called manually if you want to
 * wire this in yourself.
 */
const BOT_PHONE_REGEX = /^1313555\d{4}$|^131655500\d{2}$/;
function isRegularUser(jid) {
    var _a;
    if (!jid)
        return false;
    const user = (_a = jid.split('@')[0]) !== null && _a !== void 0 ? _a : '';
    if (user === '0')
        return false;
    if (BOT_PHONE_REGEX.test(user))
        return false;
    if ((0, WABinary_1.isJidMetaAI)(jid))
        return false;
    return !!((0, WABinary_1.isPnUser)(jid) || (0, WABinary_1.isLidUser)(jid) || (0, WABinary_1.isHostedPnUser)(jid) || (0, WABinary_1.isHostedLidUser)(jid) || jid.endsWith('@c.us'));
}
const TC_TOKEN_BUCKET_DURATION = 604800; // 7 days
const TC_TOKEN_NUM_BUCKETS = 4; // ~28-day rolling window
const TC_TOKEN_INDEX_KEY = '__index';
exports.TC_TOKEN_INDEX_KEY = TC_TOKEN_INDEX_KEY;
async function readTcTokenIndex(keys) {
    var _a;
    const data = await keys.get('tctoken', [TC_TOKEN_INDEX_KEY]);
    const entry = data[TC_TOKEN_INDEX_KEY];
    if (!((_a = entry === null || entry === void 0 ? void 0 : entry.token) === null || _a === void 0 ? void 0 : _a.length))
        return [];
    try {
        const parsed = JSON.parse(Buffer.from(entry.token).toString());
        if (!Array.isArray(parsed))
            return [];
        return parsed.filter((j) => typeof j === 'string' && j.length > 0 && j !== TC_TOKEN_INDEX_KEY);
    }
    catch (_b) {
        return [];
    }
}
async function buildMergedTcTokenIndexWrite(keys, addedJids) {
    const persisted = await readTcTokenIndex(keys);
    const merged = new Set(persisted);
    for (const jid of addedJids) {
        if (jid && jid !== TC_TOKEN_INDEX_KEY)
            merged.add(jid);
    }
    return {
        [TC_TOKEN_INDEX_KEY]: { token: Buffer.from(JSON.stringify([...merged])) }
    };
}
function isTcTokenExpired(timestamp) {
    if (timestamp === null || timestamp === undefined)
        return true;
    const ts = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp;
    if (isNaN(ts))
        return true;
    const now = Math.floor(Date.now() / 1000);
    const currentBucket = Math.floor(now / TC_TOKEN_BUCKET_DURATION);
    const cutoffBucket = currentBucket - (TC_TOKEN_NUM_BUCKETS - 1);
    const cutoffTimestamp = cutoffBucket * TC_TOKEN_BUCKET_DURATION;
    return ts < cutoffTimestamp;
}
function shouldSendNewTcToken(senderTimestamp) {
    if (senderTimestamp === undefined)
        return true;
    const now = Math.floor(Date.now() / 1000);
    const currentBucket = Math.floor(now / TC_TOKEN_BUCKET_DURATION);
    const senderBucket = Math.floor(senderTimestamp / TC_TOKEN_BUCKET_DURATION);
    return currentBucket > senderBucket;
}
async function resolveTcTokenJid(jid, getLIDForPN) {
    var _a;
    if ((0, WABinary_1.isLidUser)(jid))
        return jid;
    const lid = await getLIDForPN(jid);
    return (_a = lid !== null && lid !== void 0 ? lid : jid) !== null && _a !== void 0 ? _a : jid;
}
async function resolveIssuanceJid(jid, issueToLid, getLIDForPN, getPNForLID) {
    var _a, _b;
    if (issueToLid) {
        if ((0, WABinary_1.isLidUser)(jid))
            return jid;
        const lid = await getLIDForPN(jid);
        return (_a = lid !== null && lid !== void 0 ? lid : jid) !== null && _a !== void 0 ? _a : jid;
    }
    if (!(0, WABinary_1.isLidUser)(jid))
        return jid;
    if (getPNForLID) {
        const pn = await getPNForLID(jid);
        return (_b = pn !== null && pn !== void 0 ? pn : jid) !== null && _b !== void 0 ? _b : jid;
    }
    return jid;
}
async function buildTcTokenFromJid({ authState, jid, baseContent = [], getLIDForPN }) {
    var _a, _b;
    try {
        const storageJid = await resolveTcTokenJid(jid, getLIDForPN);
        const tcTokenData = await authState.keys.get('tctoken', [storageJid]);
        const entry = tcTokenData === null || tcTokenData === void 0 ? void 0 : tcTokenData[storageJid];
        const tcTokenBuffer = entry === null || entry === void 0 ? void 0 : entry.token;
        if (!(tcTokenBuffer === null || tcTokenBuffer === void 0 ? void 0 : tcTokenBuffer.length) || isTcTokenExpired(entry === null || entry === void 0 ? void 0 : entry.timestamp)) {
            if (tcTokenBuffer) {
                const cleared = (entry === null || entry === void 0 ? void 0 : entry.senderTimestamp) !== undefined
                    ? { token: Buffer.alloc(0), senderTimestamp: entry.senderTimestamp }
                    : null;
                await authState.keys.set({ tctoken: { [storageJid]: cleared } });
            }
            return baseContent.length > 0 ? baseContent : undefined;
        }
        baseContent.push({
            tag: 'tctoken',
            attrs: {},
            content: tcTokenBuffer
        });
        return baseContent;
    }
    catch (_error) {
        return baseContent.length > 0 ? baseContent : undefined;
    }
}
async function storeTcTokensFromIqResult({ result, fallbackJid, keys, getLIDForPN, onNewJidStored }) {
    const tokensNode = (0, WABinary_1.getBinaryNodeChild)(result, 'tokens');
    if (!tokensNode)
        return;
    const tokenNodes = (0, WABinary_1.getBinaryNodeChildren)(tokensNode, 'token');
    for (const tokenNode of tokenNodes) {
        if (tokenNode.attrs.type !== 'trusted_contact' || !(tokenNode.content instanceof Uint8Array)) {
            continue;
        }
        const rawJid = (0, WABinary_1.jidNormalizedUser)(fallbackJid || tokenNode.attrs.jid);
        if (!isRegularUser(rawJid))
            continue;
        const storageJid = await resolveTcTokenJid(rawJid, getLIDForPN);
        const existingTcData = await keys.get('tctoken', [storageJid]);
        const existingEntry = existingTcData[storageJid];
        const existingTs = (existingEntry === null || existingEntry === void 0 ? void 0 : existingEntry.timestamp) ? Number(existingEntry.timestamp) : 0;
        const incomingTs = tokenNode.attrs.t ? Number(tokenNode.attrs.t) : 0;
        if (!incomingTs)
            continue;
        if (existingTs > 0 && existingTs > incomingTs)
            continue;
        await keys.set({
            tctoken: {
                [storageJid]: {
                    ...existingEntry,
                    token: Buffer.from(tokenNode.content),
                    timestamp: tokenNode.attrs.t
                }
            }
        });
        onNewJidStored === null || onNewJidStored === void 0 ? void 0 : onNewJidStored(storageJid);
    }
}
