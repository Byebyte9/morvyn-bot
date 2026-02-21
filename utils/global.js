module.exports = {
  msg: null,
  sock: null,

  get texto() {
    const textMessage = this.msg?.message?.conversation;
    const extendedTextMessage = this.msg?.message?.extendedTextMessage?.text;
    const imageText = this.msg?.message?.imageMessage?.caption;
    const videoText = this.msg?.message?.videoMessage?.caption;

    return (
      textMessage || 
      extendedTextMessage || 
      imageText || 
      videoText
    );
  },

  //              is

  get isGroup() {
    return this.msg?.key?.remoteJid?.endsWith("@g.us");
  },

  get isOwner() {
    return this.msg?.key?.fromMe;
  },

  get isAdmin() {
    if (!this.isGroup) return false;

    const metadata =
      this.msg.groupMetadata ||
      this.sock?.groupMetadataCache?.[this.msg.key.remoteJid];

    if (!metadata || !metadata.participants) return false;

    const participant = metadata.participants.find((p) => p.id === this.sender);

    return participant?.admin !== null && participant?.admin !== undefined;
  },

  get isFromMe() {
    return this.msg?.key?.fromMe;
  },

  get isBot() {
    return this.msg?.key?.fromMe;
  },

  get isText() {
    return !!this.msg?.message?.conversation;
  },

  get isImage() {
    return !!this.msg?.message?.imageMessage;
  },

  get isVideo() {
    return !!this.msg?.message?.videoMessage || !!this.msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage
  },

  get isAudio() {
    return !!this.msg?.message?.audioMessage;
  },

  get isSticker() {
    return !!this.msg?.message?.stickerMessage?.mimetype;
  },

  get isDocument() {
    return !!this.msg?.message?.documentMessage;
  },

  get isGif() {
    return !!this.msg?.message?.videoMessage?.gifPlayback;
  },

  get isQuotedMsg() {
    return this.msg?.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  },

  get isReply() {
    return !!this.extendedTextMessage && !!this.extendedTextMessage.contextInfo?.quotedMessage;
  },



  
  ////////////////////////////////////////////////
  //           Mandar mensagens
  ////////////////////////////////////////////////
  
  sendText(jid, text, extra = {}) {
    return this.sock.sendMessage(jid, { text, ...extra });
  },

  replyMessage(sock, jid, text, extra = {}) {
    if (!this.msg) return;

    return sock.sendMessage(jid, { text, ...extra }, 
    { quoted: this.msg });
  },

  async sendImage(jid, image, caption = '', extra = {}) {
    return await this.sock.sendMessage(jid, {
      image: image,
      caption: caption,
      ...extra
    },
    { quoted: this.msg });
  },

  sendAudio(jid, audio, extra = {}) {
    return this.sock.sendMessage(jid, { audio, ...extra });
  },

  async sendSticker(sock, jid, stickerBuffer, options = {}) {
    try {
      await sock.sendMessage(jid, {
        sticker: stickerBuffer,
        ...options
      })

    } catch (err) {
      console.log('Erro ao enviar sticker:', err)
      return null
    }
  },

  async sendReaction(sock, jid, emoji) {
    return sock.sendMessage(jid, {
      react: {
        text: emoji,
        key: this.msg.key
      }
    })
  },

  sendPoll(jid, question, options = []) {
    if (!options.length) return;

    return this.sock.sendMessage(jid, { poll: { name: question, values: options, selectableCount: 1 } });
  },




  //           Utilidades

  get mencionado() {
    return this.msg?.message?.extendedTextMessage?.contextInfo
      ?.mentionedJid?.[0];
  },

  get senderSplit() {
    return this.sender.split("@")[0];
  },


  get readMore() {
    return "\u200E".repeat(3500);
  },

  get number() {
    return this.msg.key.remoteJid.split("@")[0];
  },

  get sender() {
    return this.msg.key.participant || this.msg.key.remoteJid;
  },

  get pushName() {
    return this.msg.pushName || "Bot";
  },

  get mentionedJid() {
    return this.msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid?.split(
      "@",
    )[0];
  },

  get typeMessage() {
    return Object.keys(this.msg.message)[0];
  },

  get replyAuthor() {
    return this.msg?.message?.extendedTextMessage?.contextInfo?.participant;
  },

  get replyText() {
    return this.msg?.message?.extendedTextMessage?.contextInfo?.text;
  },

  get groupName() {
    const metadata =
      this.sock.groupMetadata(this.msg.key.remoteJid) || this.msg.groupMetadata;

    return metadata.subject;
  },

  get groupMembers() {
    return (
      this.sock.groupMetadata(this.msg.key.remoteJid) || this.msg.groupMetadata
    );
  },

  async downloadMedia() {
    const { downloadContentFromMessage } = require('@whiskeysockets/baileys')

    if (!this.msg) return null

    try {
      let message = this.msg.message

      if (this.isQuotedMsg) {
        message = message.extendedTextMessage.contextInfo.quotedMessage
      }

      const type = Object.keys(message).find(
        key => key === 'imageMessage' || key === 'videoMessage'
      )

      if (!type) return null

      const stream = await downloadContentFromMessage(
        message[type],
        type.replace('Message', '')
      )

      const chunks = []
      for await (const chunk of stream) {
        chunks.push(chunk)
      }

      return Buffer.concat(chunks)

    } catch (err) {
      console.log("Erro ao baixar mídia:", err.message)
      return null
    }
  },


  async profilePicBuffer(jid) {
    const axios = require('axios')
    const fs = require('fs')

    let userPicUrl

    try {
      userPicUrl = await this.sock.profilePictureUrl(jid, 'image')
    } catch {
      userPicUrl = null
    }

    let buffer

    if (userPicUrl) {
      const response = await axios.get(userPicUrl, {
        responseType: 'arraybuffer'
      })
      buffer = Buffer.from(response.data)
    } else {
      buffer = fs.readFileSync('./assets/profile.jpg')
    }

    return buffer
  },

  


  //          Tratamento de Erros



  handleErrors(error, context = {}) {
    const {
      command = 'desconhecido',
      jid = this.msg.key.remoteJid,
    } = context

    console.log(`❌ Erro ao executar o comando: ${command} com o user: ${this.pushName}`)
    console.log("Mensagem: ", error.message);
    console.log("Stack: ", error.stack?.split("\n")[0]);
    
    if (jid) {
      this.sendText(jid, `🚨 Opa! Algo deu errado aqui 😅\n tente novamente em alguns segundos.`);
    }

  },

  async safeRun(fn, context) {
    try {
      await fn();
    } catch (err) {
      this.handleErrors(err, context);
    }
  }
  
};