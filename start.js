const {
useMultiFileAuthState,
fetchLatestBaileysVersion,
DisconnectReason
} = require("baileys");
const pino = require("pino");
const path = require("path");
const { handler } = require("./utils/handler");
const { loadCommands } = require("./utils/commandHandler.js");

const config = require("./settings/config.json");
const nomeDono = config.nomeDono.value;
const donoNumber = config.donoNumber.value

async function startBot() {
const { default: makeWaSocket } = await import("baileys");

	const { state, saveCreds } = await useMultiFileAuthState(
	path.resolve(__dirname, "assets", "auth")
	);
	const { version } = await fetchLatestBaileysVersion();

	const sock = makeWaSocket({
	auth: state,
	printQRInTerminal: false,
	logger: pino({ level: "silent" }),
	});

	if (!sock.authState.creds.registered) {

	setTimeout(async () => {
	try {
	const code = await sock.requestPairingCode(donoNumber);
	console.log(`Código de pareamento: ${code}`);
	} catch (error) {
	console.log("erro ao tentar conectar", error);
	}
	}, 3000);
	}

	sock.ev.on('creds.update', saveCreds);

	sock.ev.on('connection.update', (update) => {
	const { connection, lastDisconnect } = update;

	if (connection === "close") {
	console.log("🔁 Reconectando...");
	startBot();
	} else if (connection === "open") {
	console.log(`Olá, ${nomeDono}!\n`);
	}
	});

	loadCommands();

	sock.ev.on("messages.upsert", async ({ messages }) => {
	await handler({ sock, messages });
	
	
	});
	}
	
startBot()