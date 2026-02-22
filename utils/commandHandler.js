const loadJson = require("../loadJson")
const fs = require('fs')
const path = require('path')
const logs = loadJson('settings/options.json')

const commands = new Map()

function loadCommands() {
const types = ['user', 'admin', 'owner']

for (const type of types) {
const baseDir = path.join(__dirname, '..', 'command', type)

if (!fs.existsSync(baseDir)) continue

const files = fs.readdirSync(baseDir)

for (const file of files) {
const fullPath = path.join(baseDir, file)

// se for pasta, ignora por enquanto
if (fs.statSync(fullPath).isDirectory()) continue

if (!file.endsWith('.js')) continue

const command = require(fullPath)

if (!command?.name || !command?.run) {
console.log('❌ Comando inválido:', file)
continue
}

command.type = type
commands.set(command.name, command)

if (command.aliases) {
for (const alias of command.aliases) {
commands.set(alias, command)
}
}

}
}

if (logs.mostrarTodosComandos) {
console.log(`✅ ${commands.size} comandos carregados`)
}

}

function handleCommand({ sock, msg, text: texto, jid, g, prefix }) {
if (!texto || !texto.startsWith(prefix)) return;

const args = texto.slice(prefix.length).trim().split(/ +/);
const commandName = args.shift().toLowerCase();

const command = commands.get(commandName);

if (logs.mostrarComandosChamados) {
console.log("Comando chamado:", commandName)
}

if (!command) return;

if (command.type === "admin" && !g.isAdmin) return;
if (command.type === "owner" && !g.isOwner) return;

return command.run({ sock, msg, jid, args, g });
}

module.exports = { loadCommands, handleCommand, commands }