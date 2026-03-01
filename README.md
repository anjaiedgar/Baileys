*Modified Whatsapp-API*
<p align='center'>
<img src="https://files.catbox.moe/rhm9rt.webp" width="172">
</p>
Usage
"depencies": {
  "@whiskeysockets/baileys": "github:anjaiedgar/Baileys"
}

Import
const { default:makeWASocket, // Other Options
} = require('@whiskeysockets/baileys');
How To Connect To Whatsapp
With QR Code
const { default: makeWASocket } = require('@whiskeysockets/baileys');
const client = makeWASocket({
  browser: ['Ubuntu', 'Chrome', '20.00.1'],
  printQRInTerminal: true
})
Connect With Number
const { default: makeWASocket, fetchLatestWAWebVersion } = require('@whiskeysockets/baileys');
const client = makeWASocket({
  browser: ['Ubuntu', 'Chrome', '20.00.1'],
  printQRInTerminal: false,
  version: fetchLatestWAWebVersion() // Other options
});
const number = "628XXXXX";
const code = await client.requestPairingCode(number.trim)
/* Use : (number, "YYYYYYYY") for custom-pairing */
console.log("Ur pairing code : " + code)
Sending messages
send orderMessage
const fs = require('fs');
const ZeppImg = fs.readFileSync('./ZeppImage');
await client.sendMessage(m.chat, {
  thumbnail: ZeppImg,
  message: "Gotta get a grip",
  orderTitle: "Edgar-Corporation",
  totalAmount1000: 72502,
  totalCurrencyCode: "IDR"
}, { quoted:m })
send pollResultSnapshotMessage
await client.sendMessage(m.chat, {
  pollResultMessage: {
    name: "Edgar-Corporation",
    options: [
      { optionName: "poll 1" },
      { optionName: "poll 2" }
    ],
    newsletter: {
      newsletterName: "Edgar | Killer Queen Information",
      newsletterJid: "1@newsletter"
    }
  }
})
send productMessage
await client.relayMessage(m.chat, {
  productMessage: {
    title: "Edgar.pdf",
    description: "zZZ...",
    thumbnail: { url: "./ZeppImage" },
    productId: "EXAMPLE_TOKEN",
    retailerId: "EXAMPLE_RETAILER_ID",
    url: "https:                     
    body: "//t.me/YuukeyDEdgar",
    body: "Nak Tido",
    footer: "Footer",
    buttons: [
      {
        name: "cta_url",
        buttonParamsJson: "{\"display_text\":\"Edgar-Pdf\",\"url\":\"https:                       
      }
    ],
    priceAmount1000: 72502,
    currencyCode: "//t.me/YuukeyDEdgar\"}"
      }
    ],
    priceAmount1000: 72502,
    currencyCode: "IDR"
  }
})
*Telegram:* https://t.me/chicaatractiva
*Github:* anjaiedgar
