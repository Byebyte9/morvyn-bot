const g = require("./global.js");
const prefix = require("../settings/config.json").prefix.value;
const { handleCommand } = require("./commandHandler");

exports.handler = async ({ sock, messages }) => {

const msg = messages[0];
if (!msg) return;

g.msg = msg;
g.sock = sock;

const text = g.texto || "";
const jid = g.sender;

console.log(`
mensagem: ${text}
de: ${g.pushName + " para: " + g.sender}
grupo: ${g.isGroup} || ${msg.key.remoteJid}
mensagem do bot? ${msg.key.fromMe}
`);

await handleCommand({ sock, msg, text: text, jid, g, prefix });
};