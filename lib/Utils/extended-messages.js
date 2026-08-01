

const POLL_CREATION_FIELDS = [
    'pollCreationMessage',
    'pollCreationMessageV2',
    'pollCreationMessageV3',
    'pollCreationMessageV4',
    'pollCreationMessageV5',
    'pollCreationMessageV6',
]

export const EXTENDED_MESSAGE_TYPES = [
    'spoilerMessage',
    'liveLocationMessage',
    'groupInviteMessage',
    'eventInviteMessage',
    'pollAddOptionMessage',
    'pollResultSnapshotMessage',
    'pollResultSnapshotMessageV3',
    'splitPaymentMessage',
    'paymentReminderMessage',
    'conditionalRevealMessage',
    'statusQuotedMessage',
    'statusStickerInteractionMessage',
    'groupRootKeyShare',
    'rootSecretDistributeMessage',
    'newsletterAdminProfileMessage',
    'newsletterAdminProfileMessageV2',
    'newsletterAdminProfileStatusMessage',
    ...POLL_CREATION_FIELDS,
]

/**
 * Reads a message content object (proto.IMessage) and, if it's one of the
 * types added in this fork, returns `{ type, data }` with a friendly,
 * flattened shape. Returns `undefined` if the message isn't one of these
 * types (use the regular `getContentType`/`extractMessageContent` for
 * everything else).
 */
export const parseExtendedMessageContent = (content) => {
    if (!content) {
        return undefined
    }
    if (content.spoilerMessage) {
        return {
            type: 'spoiler',
            data: {
                // the actual message content is nested one level in, same
                // as viewOnceMessage — pass it through normalizeMessageContent
                // yourself if you need the fully-unwrapped inner message.
                message: content.spoilerMessage.message,
            },
        }
    }
    if (content.liveLocationMessage) {
        const l = content.liveLocationMessage
        return {
            type: 'liveLocation',
            data: {
                degreesLatitude: l.location?.degreesLatitude,
                degreesLongitude: l.location?.degreesLongitude,
                accuracyInMeters: l.accuracyInMeters,
                speedInMps: l.speedInMps,
                degreesClockwiseFromMagneticNorth: l.degreesClockwiseFromMagneticNorth,
                caption: l.caption?.text,
                sequenceNumber: l.sequenceNumber,
            },
        }
    }
    if (content.groupInviteMessage) {
        const g = content.groupInviteMessage
        return {
            type: 'groupInvite',
            data: {
                groupJid: g.groupJid,
                inviteCode: g.inviteCode,
                inviteExpiration: g.inviteExpiration,
                groupName: g.groupName,
                caption: g.caption?.text,
            },
        }
    }
    if (content.eventInviteMessage) {
        const e = content.eventInviteMessage
        return {
            type: 'eventInvite',
            data: {
                eventId: e.eventId,
                eventTitle: e.eventTitle,
                startTime: e.startTime,
                endTime: e.endTime,
                caption: e.caption,
                isCanceled: e.isCanceled,
                callLink: e.callLink,
            },
        }
    }
    if (content.pollAddOptionMessage) {
        return {
            type: 'pollAddOption',
            data: {
                options: (content.pollAddOptionMessage.pollOption || []).map(o => o.optionName),
            },
        }
    }
    if (content.pollResultSnapshotMessage || content.pollResultSnapshotMessageV3) {
        const p = content.pollResultSnapshotMessage || content.pollResultSnapshotMessageV3
        return {
            type: 'pollResultSnapshot',
            data: {
                name: p.name,
                votes: (p.pollVotes || []).map(v => ({ option: v.optionName, count: Number(v.optionVoteCount || 0) })),
            },
        }
    }
    for (const field of POLL_CREATION_FIELDS) {
        if (content[field]) {
            const p = content[field]
            return {
                type: 'pollCreation',
                data: {
                    version: POLL_CREATION_FIELDS.indexOf(field) + 1,
                    name: p.name,
                    selectableOptionsCount: p.selectableOptionsCount,
                    options: (p.options || []).map(o => o.optionName),
                },
            }
        }
    }
    if (content.splitPaymentMessage) {
        const s = content.splitPaymentMessage
        return {
            type: 'splitPayment',
            data: {
                splitId: s.splitId,
                totalAmount: s.totalAmount,
                description: s.description,
                requesterJid: s.requesterJid,
                participants: s.participants,
            },
        }
    }
    if (content.paymentReminderMessage) {
        const p = content.paymentReminderMessage
        return {
            type: 'paymentReminder',
            data: {
                reminderId: p.reminderId,
                description: p.description,
                frequency: p.frequency,
                status: p.status,
                payeeJid: p.payeeJid,
                payerJid: p.payerJid,
                amount: p.amount,
            },
        }
    }
    if (content.conditionalRevealMessage) {
        const c = content.conditionalRevealMessage
        return {
            type: 'conditionalReveal',
            data: {
                revealKeyId: c.revealKeyId,
                messageType: c.conditionalRevealMessageType,
                // encPayload/encIv are left encrypted — decrypting requires the
                // reveal key from the associated app-state action, which this
                // fork does not yet resolve automatically.
                encPayload: c.encPayload,
                encIv: c.encIv,
            },
        }
    }
    if (content.statusQuotedMessage) {
        const s = content.statusQuotedMessage
        return {
            type: 'statusQuoted',
            data: {
                quotedType: s.type,
                text: s.text,
                originalStatusId: s.originalStatusId,
            },
        }
    }
    if (content.statusStickerInteractionMessage) {
        const s = content.statusStickerInteractionMessage
        return {
            type: 'statusStickerInteraction',
            data: {
                key: s.key,
                stickerKey: s.stickerKey,
                interactionType: s.type,
            },
        }
    }
    if (content.groupRootKeyShare) {
        return {
            type: 'groupRootKeyShare',
            data: {
                keys: (content.groupRootKeyShare.keys || []).map(k => ({
                    keyId: k.keyId,
                    expiryTimestampMs: k.expiryTimestampMs,
                    createdTimestampMs: k.createdTimestampMs,
                    // groupRootKey itself is left as raw bytes — this is key
                    // material, handle it the same way you'd handle any other
                    // signal key, not as a display value.
                })),
            },
        }
    }
    if (content.rootSecretDistributeMessage) {
        return {
            type: 'rootSecretDistribute',
            // Field-level shape for this one is not documented anywhere public;
            // returned as-is rather than guessing a flattened structure.
            data: content.rootSecretDistributeMessage,
        }
    }
    if (content.newsletterAdminProfileMessage || content.newsletterAdminProfileMessageV2 || content.newsletterAdminProfileStatusMessage) {
        return {
            type: 'newsletterAdminProfile',
            // These three are FutureProofMessage wrappers (same shape as
            // viewOnceMessage) — the useful payload is one level in.
            data: {
                message: (content.newsletterAdminProfileMessage
                    || content.newsletterAdminProfileMessageV2
                    || content.newsletterAdminProfileStatusMessage)?.message,
            },
        }
    }
    return undefined
}
