<div align="center">

<img src="https://l.top4top.io/p_3864feij81.jpg" alt="WhatsApp Baileys Edgar" width="100%" />

<br/>
<br/>

# WhatsApp Baileys Edgar

<p>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" />
  <img src="https://img.shields.io/badge/WebSocket-010101?style=for-the-badge&logo=socketdotio&logoColor=white" />
  <img src="https://img.shields.io/badge/Open%20Source-FF4500?style=for-the-badge&logo=github&logoColor=white" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge" />
</p>

**Open-source WhatsApp automation library — no browser required.**
Built on WebSocket for speed, stability, and full multi-device support.

<br/>

[Installation](#getting-started) • [Documentation](#sendmessage-documentation) • [Features](#main-features) • [Telegram Owner](https://t.me/chicaatractiva) • [Channel](https://t.me/lawlietempire)

</div>

---

## What is Baileys Edgar?

**WhatsApp Baileys Edgar** is a powerful, open-source library for developers who need reliable WhatsApp automation without the overhead of a browser. Powered by **WebSocket technology**, it connects directly to WhatsApp's multi-device protocol — no Selenium, no Puppeteer, no headless Chrome.

Actively maintained with continuous improvements to **pairing stability**, **session management**, and **WhatsApp multi-device compatibility**.

Perfect for:
- Business bots & chat automation
- Customer service systems
- Broadcast & notification tools
- E-commerce integrations

---

## Main Features

| Feature | Description |
|---|---|
| **No Message History Required** | Runs perfectly fine without syncing or storing old chat history — connect and start sending/receiving immediately, no bulky history sync needed |
| **All Message Types Supported** | Text, image, video, audio, document, sticker, location, contact, poll, button, list, template, product, catalog, album, event, and more — every WhatsApp message type is covered |
| **Custom Pairing** | Stable pairing with your own codes — no disconnection issues |
| **Interactive Messages** | Buttons, menus, native flows, and more |
| **Session Management** | Automatic, efficient, and long-term stable |
| **Multi-Device Support** | Fully compatible with WhatsApp's latest multi-device API |
| **Lightweight & Modular** | Easy to integrate into any Node.js project |
| **Secure Auth** | Improved authentication flow with fixed prior vulnerabilities |

---

## Getting Started

Install via npm or yarn:

```bash
npm install @whiskeysockets/baileys
# or
yarn add @whiskeysockets/baileys
```

Then import and initialize:

```javascript
const { makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");

const { state, saveCreds } = await useMultiFileAuthState("auth_info");
const sock = makeWASocket({
    auth: state,
    syncFullHistory: false // no need to load message history to run
});

sock.ev.on("creds.update", saveCreds);
```

> 💡 **Tip:** Set `syncFullHistory: false` (or simply leave it unset) if you don't need old chat history — the bot will still work normally for sending and receiving every supported message type without waiting for history sync.

---

## Supported Message Types

Baileys Edgar can send and receive **every single WhatsApp message type that exists** — nothing is left out. Main ones include:

- Text, image, video, audio, document, sticker, GIF/video note (PTV)
- Location & live location
- Contact / vCard
- Poll (create, vote, add option, poll result)
- Button, list, template & interactive (native flow) messages
- Album (multiple images in one message)
- Event & event invite
- Group invite, group status & group mention
- Spoiler (blurred) messages
- Reaction & edited message
- View-once media
- Status/story mention & reply
- Newsletter / channel messages
- Payment & payment invite messages

Plus **all WhatsApp Business message types** — product message, catalog, order, invoice, business profile, and more — all fully supported.

In short: **every message type in the WhatsApp protocol is supported**, whether it's a common everyday message or a rare/business-only type.

<details>
<summary><b>Example: Poll message</b></summary>
<br/>

```javascript
await sock.sendMessage(target, {
    poll: {
        name: "Poll Title",
        values: ["Option A", "Option B"],
        selectableCount: 1,
        pollVersion: 6
    }
});
```
</details>

<details>
<summary><b>Example: Spoiler message</b></summary>
<br/>

```javascript
await sock.sendMessage(target, {
    text: "This is a spoiler!",
    spoiler: true
});
```
</details>

<details>
<summary><b>Example: Live location</b></summary>
<br/>

```javascript
await sock.sendMessage(target, {
    liveLocation: {
        degreesLatitude: -6.2,
        degreesLongitude: 106.8,
        caption: "Tracking live"
    }
});
```
</details>

---

## Additional Functions

### Parse Incoming Extended Messages
```javascript
sock.ev.on('messages.upsert', ({ messages }) => {
    const msg = messages[0];
    const extended = sock.parseExtendedMessageContent(msg.message);
    if (extended) {
        console.log(extended.type, extended.data);
    }
});
```

### Business Profile
```javascript
const profile = await sock.getBusinessProfile(jid);

await sock.updateBusinessProfile({
    description: "We're open 9-5!",
    email: "hello@example.com",
    category: "Retail"
});
```

### Get Channel ID
```javascript
await sock.newsletterId(url);
```

### Check Banned Number
```javascript
await sock.checkWhatsApp(target);
```

---

## SendMessage Documentation

For the full list of supported payload shapes (album, event, poll result, interactive message, native flow, product message, etc.), see the code examples in `lib/Socket/messages-send.js`.

---

## Community & Support

<div align="center">

**Telegram Owner:** [@chicaatractiva](https://t.me/chicaatractiva)
**Official Channel:** [t.me/lawlietempire](https://t.me/lawlietempire)

</div>

---

## License

MIT
