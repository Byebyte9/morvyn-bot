const loadJson = require("../../../loadJson")
const config = loadJson("./src/settings/config.json");
const prefix = config.prefix.value;
const botName = config.botName.value

module.exports = {
name: "bot",
category: "utilitarios",
desc: "Infos do bot",
usage: `${prefix}bot`,

run({ sock, jid, g }) {
let texto = `Olá, eu sou ${botName}!\n\nEspero poder alegar seu dia!`

return g.replyMessage(sock, jid, texto)

}

}