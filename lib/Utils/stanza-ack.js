"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAckStanza = buildAckStanza;
/**
 * Builds an ACK stanza for a received node.
 * Pure function -- no I/O, no side effects.
 *
 * NOTE: ported as an available utility. Not automatically wired into
 * edgar-bail's existing ack-sending call sites (which build their ack
 * stanzas inline) to avoid touching the message receive hot path blindly.
 */
function buildAckStanza(node, errorCode, meId) {
    const { tag, attrs } = node;
    const stanza = {
        tag: 'ack',
        attrs: {
            id: attrs.id,
            to: attrs.from,
            class: tag
        }
    };
    if (errorCode) {
        stanza.attrs.error = errorCode.toString();
    }
    if (attrs.participant) {
        stanza.attrs.participant = attrs.participant;
    }
    if (attrs.recipient) {
        stanza.attrs.recipient = attrs.recipient;
    }
    if (attrs.type) {
        stanza.attrs.type = attrs.type;
    }
    if (tag === 'message' && meId) {
        stanza.attrs.from = meId;
    }
    return stanza;
}
