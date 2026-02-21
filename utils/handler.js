const g = require('./utils/global')
const prefix = require('../settings/config.json').prefix.value
const { extractTypeMessage } = require('./msg')
const { handleCommand, loadCommands } = require('./commandHandler')

exports.handler = async ({ sock, messages }) => {

  loadCommands()

   const msg = messages[0]
   if (!msg) return

   g.msg = msg
   g.sock = sock

   const text = extractTypeMessage(msg) || ''
   const jid = g.sender

   console.log(`
      mensagem: ${text}
      tipo: ${g.typeMessage}
      de: ${g.pushName + " para: " + g.sender}
      grupo: ${g.isGroup} || ${msg.key.remoteJid}
      mensagem do bot? ${msg.key.fromMe}
    `);

    await handleCommand({ sock, msg, text: text, jid, g, prefix })

}