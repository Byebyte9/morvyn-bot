const loadJson = require("../../loadJson")
const { commands } = require("../../utils/commandHandler");
const categories = require("../../settings/categories");
const config = loadJson("settings/config.json");

const botName = config.botName.value;
const prefix = config.prefix.value;
const dono = config.nomeDono.value;

module.exports = {
name: "menu",
aliases: ["menu"],
category: "menus",
desc: "Ver os comandos disponíveis",
usage: `${prefix}menu`,

run({ sock, jid, g }) {
let text = `｡☆✼★━━━━━━━━━━━━★✼☆｡
┃ 🤖 Bot: ${botName}
┃ 🎯 Versão: 0.1.1
┃ 👑 Dono: ${dono}
┃ 🚀 Prefixo: ${prefix}
｡☆✼★━━━━━━━━━━━━★✼☆｡\n${g.readMore}`;

const listed = new Set()
const grouped = {};

for (const cmd of commands.values()) {
if (cmd.hidden) continue;

if (listed.has(cmd.name)) continue;
listed.add(cmd.name);

const cat = cmd.category || "outros";
if (!grouped[cat]) grouped[cat] = [];
grouped[cat].push(cmd);
}

const orderedCategories = Object.entries(categories).sort(
(a, b) => (a[1].order ?? 99) - (b[1].order ?? 99),
);

for (const [key, info] of orderedCategories) {
if (!grouped[key]) continue;

text += `\n${info.title}\n`;

grouped[key].forEach((cmd) => {
text += `┃ ➥ ${cmd.usage} - ${cmd.desc}\n`;
});

text += "｡☆✼★━━━━━━━━━━━━★✼☆｡\n";
}

return g.replyMessage(sock, jid, text);
},
};