const loadJson = require("../../../loadJson")
const config = loadJson("./src/settings/config.json");
const prefix = config.prefix.value;
const botName = config.botName.value

module.exports = {
name: "meusdados",
category: "utilitarios",
desc: "Seus dados",
usage: `${prefix}meusdados`,

run({ sock, jid, g }) {
let texto = `Olá, eu sou ${g.pushName}\n\nMeu número é: ${g.userNumber.split("@")[0]}`

return g.replyMessage(sock, jid, texto)

}

}