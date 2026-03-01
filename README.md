# Modified Whatsapp-API
<p align='center'>
<img src="https://files.catbox.moe/rhm9rt.webp" width="172">
</p>

---

## Usage

```json
"dependencies": {
  "@whiskeysockets/baileys": "github:anjaiedgar/Baileys"
}
Import
Javascript
Salin kode
const {
  default: makeWASocket,
  // Other Options 
} = require('@whiskeysockets/baileys');
How To Connect To Whatsapp
With QR Code
Javascript
Salin kode
const { default: makeWASocket } = require('@whiskeysockets/baileys');

const client = makeWASocket({
  browser: ['Ubuntu', 'Chrome', '20.00.1'],
  printQRInTerminal: true
})
Connect With Number
Javascript
Salin kode
const { default: makeWASocket, fetchLatestWAWebVersion } = require('@whiskeysockets/baileys');

const client = makeWASocket({
  browser: ['Ubuntu', 'Chrome', '20.00.1'],
  printQRInTerminal: false,
  version: fetchLatestWAWebVersion()
});

const number = "628XXXXX";
const code = await client.requestPairingCode(number.trim);

/* Use : (number, "YYYYYYYY") for custom-pairing */
console.log("Pairing code : " + code);
Sending Messages
Send Order Message
Javascript
Salin kode
const fs = require('fs');
const ZeppImg = fs.readFileSync('./ZeppImage');

await client.sendMessage(m.chat, {
  thumbnail: ZeppImg,
  message: "Gotta get a grip",
  orderTitle: "ChicaAtractiva Corporation",
  totalAmount1000: 72502,
  totalCurrencyCode: "IDR"
}, { quoted:m })
Send Poll Result Snapshot Message
Javascript
Salin kode
await client.sendMessage(m.chat, {
  pollResultMessage: {
    name: "ChicaAtractiva Information",
    options: [
      { optionName: "poll 1" },
      { optionName: "poll 2" }
    ],
    newsletter: {
      newsletterName: "ChicaAtractiva Info",
      newsletterJid: "1@newsletter"
    }
  }
})
Send Product Message
Javascript
Salin kode
await client.relayMessage(m.chat, {
  productMessage: {
    title: "Edgar.pdf",
    description: "zZZ...",
    thumbnail: { url: "./ZeppImage" },
    productId: "EXAMPLE_TOKEN",
    retailerId: "EXAMPLE_RETAILER_ID",
    url: "https://t.me/chicaatractiva",
    body: "Nak Tido",
    footer: "Footer",
    buttons: [
      {
        name: "cta_url",
        buttonParamsJson: "{\"display_text\":\"ChicaAtractiva-Pdf\",\"url\":\"https://t.me/chicaatractiva\"}"
      }
    ],
    priceAmount1000: 72502,
    currencyCode: "IDR"
  }
})
