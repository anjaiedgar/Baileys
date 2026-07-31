"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeBusinessSocket = void 0;
const business_1 = require("../Utils/business");
const WABinary_1 = require("../WABinary");
const generic_utils_1 = require("../WABinary/generic-utils");
const messages_recv_1 = require("./messages-recv");
const makeBusinessSocket = (config) => {
    const sock = (0, messages_recv_1.makeMessagesRecvSocket)(config);
    const { authState, query, waUploadToServer } = sock;
    const getCatalog = async ({ jid, limit, cursor }) => {
        var _a;
        jid = jid || ((_a = authState.creds.me) === null || _a === void 0 ? void 0 : _a.id);
        jid = (0, WABinary_1.jidNormalizedUser)(jid);
        const queryParamNodes = [
            {
                tag: 'limit',
                attrs: {},
                content: Buffer.from((limit || 10).toString())
            },
            {
                tag: 'width',
                attrs: {},
                content: Buffer.from('100')
            },
            {
                tag: 'height',
                attrs: {},
                content: Buffer.from('100')
            },
        ];
        if (cursor) {
            queryParamNodes.push({
                tag: 'after',
                attrs: {},
                content: cursor
            });
        }
        const result = await query({
            tag: 'iq',
            attrs: {
                to: WABinary_1.S_WHATSAPP_NET,
                type: 'get',
                xmlns: 'w:biz:catalog'
            },
            content: [
                {
                    tag: 'product_catalog',
                    attrs: {
                        jid,
                        'allow_shop_source': 'true'
                    },
                    content: queryParamNodes
                }
            ]
        });
        return (0, business_1.parseCatalogNode)(result);
    };
    const getCollections = async (jid, limit = 51) => {
        var _a;
        jid = jid || ((_a = authState.creds.me) === null || _a === void 0 ? void 0 : _a.id);
        jid = (0, WABinary_1.jidNormalizedUser)(jid);
        const result = await query({
            tag: 'iq',
            attrs: {
                to: WABinary_1.S_WHATSAPP_NET,
                type: 'get',
                xmlns: 'w:biz:catalog',
                'smax_id': '35'
            },
            content: [
                {
                    tag: 'collections',
                    attrs: {
                        'biz_jid': jid,
                    },
                    content: [
                        {
                            tag: 'collection_limit',
                            attrs: {},
                            content: Buffer.from(limit.toString())
                        },
                        {
                            tag: 'item_limit',
                            attrs: {},
                            content: Buffer.from(limit.toString())
                        },
                        {
                            tag: 'width',
                            attrs: {},
                            content: Buffer.from('100')
                        },
                        {
                            tag: 'height',
                            attrs: {},
                            content: Buffer.from('100')
                        }
                    ]
                }
            ]
        });
        return (0, business_1.parseCollectionsNode)(result);
    };
    const getOrderDetails = async (orderId, tokenBase64) => {
        const result = await query({
            tag: 'iq',
            attrs: {
                to: WABinary_1.S_WHATSAPP_NET,
                type: 'get',
                xmlns: 'fb:thrift_iq',
                'smax_id': '5'
            },
            content: [
                {
                    tag: 'order',
                    attrs: {
                        op: 'get',
                        id: orderId
                    },
                    content: [
                        {
                            tag: 'image_dimensions',
                            attrs: {},
                            content: [
                                {
                                    tag: 'width',
                                    attrs: {},
                                    content: Buffer.from('100')
                                },
                                {
                                    tag: 'height',
                                    attrs: {},
                                    content: Buffer.from('100')
                                }
                            ]
                        },
                        {
                            tag: 'token',
                            attrs: {},
                            content: Buffer.from(tokenBase64)
                        }
                    ]
                }
            ]
        });
        return (0, business_1.parseOrderDetailsNode)(result);
    };
    const productUpdate = async (productId, update) => {
        update = await (0, business_1.uploadingNecessaryImagesOfProduct)(update, waUploadToServer);
        const editNode = (0, business_1.toProductNode)(productId, update);
        const result = await query({
            tag: 'iq',
            attrs: {
                to: WABinary_1.S_WHATSAPP_NET,
                type: 'set',
                xmlns: 'w:biz:catalog'
            },
            content: [
                {
                    tag: 'product_catalog_edit',
                    attrs: { v: '1' },
                    content: [
                        editNode,
                        {
                            tag: 'width',
                            attrs: {},
                            content: '100'
                        },
                        {
                            tag: 'height',
                            attrs: {},
                            content: '100'
                        }
                    ]
                }
            ]
        });
        const productCatalogEditNode = (0, generic_utils_1.getBinaryNodeChild)(result, 'product_catalog_edit');
        const productNode = (0, generic_utils_1.getBinaryNodeChild)(productCatalogEditNode, 'product');
        return (0, business_1.parseProductNode)(productNode);
    };
    const productCreate = async (create) => {
        // ensure isHidden is defined
        create.isHidden = !!create.isHidden;
        create = await (0, business_1.uploadingNecessaryImagesOfProduct)(create, waUploadToServer);
        const createNode = (0, business_1.toProductNode)(undefined, create);
        const result = await query({
            tag: 'iq',
            attrs: {
                to: WABinary_1.S_WHATSAPP_NET,
                type: 'set',
                xmlns: 'w:biz:catalog'
            },
            content: [
                {
                    tag: 'product_catalog_add',
                    attrs: { v: '1' },
                    content: [
                        createNode,
                        {
                            tag: 'width',
                            attrs: {},
                            content: '100'
                        },
                        {
                            tag: 'height',
                            attrs: {},
                            content: '100'
                        }
                    ]
                }
            ]
        });
        const productCatalogAddNode = (0, generic_utils_1.getBinaryNodeChild)(result, 'product_catalog_add');
        const productNode = (0, generic_utils_1.getBinaryNodeChild)(productCatalogAddNode, 'product');
        return (0, business_1.parseProductNode)(productNode);
    };
    const productDelete = async (productIds) => {
        const result = await query({
            tag: 'iq',
            attrs: {
                to: WABinary_1.S_WHATSAPP_NET,
                type: 'set',
                xmlns: 'w:biz:catalog'
            },
            content: [
                {
                    tag: 'product_catalog_delete',
                    attrs: { v: '1' },
                    content: productIds.map(id => ({
                        tag: 'product',
                        attrs: {},
                        content: [
                            {
                                tag: 'id',
                                attrs: {},
                                content: Buffer.from(id)
                            }
                        ]
                    }))
                }
            ]
        });
        const productCatalogDelNode = (0, generic_utils_1.getBinaryNodeChild)(result, 'product_catalog_delete');
        return {
            deleted: +((productCatalogDelNode === null || productCatalogDelNode === void 0 ? void 0 : productCatalogDelNode.attrs.deleted_count) || 0)
        };
    };
    // Mirrors getBusinessProfile's read shape (see Socket/chats.js) as a
    // 'set' iq instead of 'get' — WhatsApp's business_profile endpoint
    // follows the usual symmetric get/set pattern for these fields.
    const updateBusinessProfile = async (update) => {
        const content = [];
        if (typeof update.description !== 'undefined') {
            content.push({ tag: 'description', attrs: {}, content: Buffer.from(update.description) });
        }
        if (typeof update.address !== 'undefined') {
            content.push({ tag: 'address', attrs: {}, content: Buffer.from(update.address) });
        }
        if (typeof update.website !== 'undefined') {
            content.push({ tag: 'website', attrs: {}, content: Buffer.from(update.website) });
        }
        if (typeof update.email !== 'undefined') {
            content.push({ tag: 'email', attrs: {}, content: Buffer.from(update.email) });
        }
        if (typeof update.category !== 'undefined') {
            content.push({
                tag: 'categories', attrs: {}, content: [
                    { tag: 'category', attrs: {}, content: Buffer.from(update.category) }
                ]
            });
        }
        return query({
            tag: 'iq',
            attrs: { to: 's.whatsapp.net', xmlns: 'w:biz', type: 'set' },
            content: [{
                    tag: 'business_profile',
                    attrs: { v: '244' },
                    content: [{ tag: 'profile', attrs: {}, content }]
                }]
        });
    };
    // ⚠️ EXPERIMENTAL — unlike updateBusinessProfile (which mirrors the
    // already-verified getBusinessProfile read shape), the exact wire
    // format WhatsApp uses for away-message/greeting-message toggles on
    // multi-device linked sessions is not publicly documented and was not
    // available to test against a real payload. This is a best-effort
    // guess following the same `w:biz` iq convention as the rest of this
    // file. Verify against a real chat/business account before relying on
    // it — it may need adjusting (or may not work at all) if WhatsApp
    // expects a different tag/attr layout.
    const setAwayMessage = async (message, enabled = true) => {
        return query({
            tag: 'iq',
            attrs: { to: 's.whatsapp.net', xmlns: 'w:biz', type: 'set' },
            content: [{
                    tag: 'away_message',
                    attrs: { enabled: enabled ? '1' : '0' },
                    content: message ? Buffer.from(message) : undefined
                }]
        });
    };
    // ⚠️ EXPERIMENTAL — see setAwayMessage note above; same caveat applies.
    const setGreetingMessage = async (message, enabled = true) => {
        return query({
            tag: 'iq',
            attrs: { to: 's.whatsapp.net', xmlns: 'w:biz', type: 'set' },
            content: [{
                    tag: 'greeting_message',
                    attrs: { enabled: enabled ? '1' : '0' },
                    content: message ? Buffer.from(message) : undefined
                }]
        });
    };
    // ⚠️ EXPERIMENTAL — see setAwayMessage note above; same caveat applies.
    const setCatalogVisibility = async (visible) => {
        return query({
            tag: 'iq',
            attrs: { to: 's.whatsapp.net', xmlns: 'w:biz:catalog', type: 'set' },
            content: [{
                    tag: 'product_catalog',
                    attrs: {},
                    content: [{ tag: 'is_hidden', attrs: {}, content: Buffer.from(visible ? '0' : '1') }]
                }]
        });
    };
    return {
        ...sock,
        logger: config.logger,
        getOrderDetails,
        getCatalog,
        getCollections,
        productCreate,
        productDelete,
        productUpdate,
        updateBusinessProfile,
        setAwayMessage,
        setGreetingMessage,
        setCatalogVisibility
    };
};
exports.makeBusinessSocket = makeBusinessSocket;
