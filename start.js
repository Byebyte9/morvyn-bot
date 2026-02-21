const { 
  default: makeWaSocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason
 } = require('@whiskeysockets/baileys')
const pino = require('pino')
const path = require('path')
const { handler } = require('./utils/handler')

const config = require('./settings/config.json')
const nomeDono = config.nomeDono.value
const { question } = require('./utils/rl')

async function startBot() {

  const { state, saveState } = await useMultiFileAuthState(path.resolve(__dirname, 'assets', 'session'))
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWaSocket({
    auth: state,
    version,
    logger: pino({ level: 'silent' }),
    browser: ['Morvyn', '1.0.0']
  })

  if (!sock.authState.creds.registered) {
    const option = await question(
      "Como deseja conectar?\n1 - QR Code\n2 - Número\n\nEscolha: "
    )

    if (option === '2') {
      let phoneNumber = await question(
        "Insira seu número (5561999999999)\nNúmero: "
      )

      phoneNumber = phoneNumber.replace(/[^0-9]/g, "")

      if (!phoneNumber) {
        throw new Error('Número de telefone inválido')
      }

      const code = await sock.requestPairingCode(phoneNumber)
      console.log(`Código de pareamento: ${code}`)
    }

    if (option === '1') {
      console.log("Use o QR Code exibido no terminal para conectar.")
    }

    if (option !== '1' && option !== '2') {
      throw new Error('Opção inválida')
    }
  }

  sock.ev.on('creds.update', saveState)

  sock.ev.on('connection.update', (connection) => {
    const { connection, lastDisconnect } = connection

    if (connection === 'close') {
      const shouldReconnect =
        sock?.lastDisconnect?.error?.output?.statusCode !==
        DisconnectReason.loggedOut

      console.log('🔁 Reconectando...')

      if (shouldReconnect) {
        startBot()
      } else if (connection === 'open') {
        console.log(`Olá, ${nomeDono}!\n`)
      }
    }
  })

  sock.ev.on('messages.upsert', async ({ messages }) => {
    await handler({ sock, messages })
  })
  
}

startBot()