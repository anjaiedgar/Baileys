"use strict";
// Ported from xata-bail's Utils/browser-utils.js.
//
// NOTE: edgar-bail already has its own `Browsers` export in generics.js,
// used as a function: Browsers("Chrome") -> [os, "Chrome", osRelease].
// xata-bail's version has a different shape: an object of per-platform
// builders, e.g. Browsers.ubuntu("Chrome") -> ['Ubuntu', 'Chrome', '22.04.4'].
// To avoid silently breaking every existing call site (including
// Defaults/index.js, which does Utils_1.Browsers("Chrome")), this is kept
// as a separate export, `BrowserPresets`, instead of overwriting `Browsers`.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExtraPlatformId = exports.BrowserPresets = void 0;
const os_1 = require("os");
const WAProto_1 = require("../../WAProto");

const PLATFORM_MAP = {
    aix: 'AIX',
    darwin: 'Mac OS',
    win32: 'Windows',
    android: 'Android',
    freebsd: 'FreeBSD',
    openbsd: 'OpenBSD',
    sunos: 'Solaris',
    linux: 'Linux',
    haiku: undefined,
    cygwin: undefined,
    netbsd: undefined
};

const BROWSER_MAP = {
    safari: 'Safari',
    chrome: 'Chrome',
    edge: 'Edge',
    firefox: 'Firefox',
    opera: 'Opera',
    brave: 'Brave',
    samsung: 'Samsung Internet'
};

const getBrowserN = (bros) => BROWSER_MAP[bros] || bros;

// Usage: BrowserPresets.ubuntu('Chrome'), BrowserPresets.appropriate('Chrome'), etc.
exports.BrowserPresets = {
    ubuntu: browser => ['Ubuntu', getBrowserN(browser), '22.04.4'],
    macOS: browser => ['Mac OS', getBrowserN(browser), '14.4.1'],
    baileys: browser => ['Baileys', getBrowserN(browser), '6.5.0'],
    windows: browser => ['Windows', getBrowserN(browser), '10.0.22631'],
    iOS: browser => ['iOS', getBrowserN(browser), '18.2'],
    android: browser => ['Android', getBrowserN(browser), '14.0.0'],
    safari: browser => ['Safari', getBrowserN(browser), '26.5'],
    custom: (platform, browser, ver) => {
        const platformN = PLATFORM_MAP[platform] || platform;
        return [platformN, getBrowserN(browser), ver];
    },
    /** Auto-detect based on the host OS & release, like the existing Browsers() does. */
    appropriate: browser => [PLATFORM_MAP[os_1.platform()] || 'Ubuntu', getBrowserN(browser), os_1.release()]
};

// Named getExtraPlatformId to avoid clashing with the existing getPlatformId
// already exported from generics.js.
exports.getExtraPlatformId = (browser) => {
    const platformType = WAProto_1.proto.DeviceProps.PlatformType[browser.toUpperCase()];
    return platformType ? platformType.toString() : '1'; // chrome
};
