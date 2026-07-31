"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USyncUsernameProtocol = void 0;
const WABinary_1 = require("../../WABinary");
class USyncUsernameProtocol {
    constructor() {
        this.name = 'username';
    }
    getQueryElement() {
        return {
            tag: 'username',
            attrs: {},
        };
    }
    getUserElement(user) {
        void user;
        return null;
    }
    parser(node) {
        if (node.tag === 'username') {
            (0, WABinary_1.assertNodeErrorFree)(node);
            return typeof node.content === 'string' ? node.content : null;
        }
        return null;
    }
}
exports.USyncUsernameProtocol = USyncUsernameProtocol;
