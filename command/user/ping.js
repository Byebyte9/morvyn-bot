const config = require("../../settings/config.json");
const prefix = config.prefix.value;

module.exports = {
  name: "ping",
  aliases: [""],
  category: "utilitarios",
  desc: "Verificar se bot está ativo",
  usage: `${prefix}ping`,

  run({ sock, jid, g }) {
  	return g.replyMessage(sock, jid, 'Pong!')
  	
  }
  
}