const loadJson = require("../loadJson")
const g = require("./global.js");
<<<<<<< HEAD
const prefix = require("../settings/config.json").prefix.value;
=======
const prefix = loadJson("settings/config.json").prefix.value;
const logs = loadJson('settings/options.json')


>>>>>>> dev
const { handleCommand } = require("./commandHandler");

exports.handler = async ({ sock, messages }) => {

const msg = messages[0];
if (!msg) return;

g.msg = msg;
g.sock = sock;

const text = g.texto || "";
const jid = g.sender;

if (logs.mostrarMensagens) {
let cargo = "Membro"

if (g.isOwner) cargo = "Dono"
else if (g.isAdmin) cargo = "Admin"

console.log(`
Mensagem: ${text || "Mensagem não textual"}
Usuário: ${g.pushName} -> ${cargo}
Mensagem do Bot: ${msg?.key?.fromMe ? "Sim": "Não"}
`)
}

await handleCommand({ sock, msg, text: text, jid, g, prefix });
};