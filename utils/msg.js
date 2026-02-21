exports.extractTypeMessage = (msg) => {
  const text = msg.message?.conversation
  const extendedText = msg.message?.extendedTextMessage?.text
  const extendedTextText = extendedText?.text
  const imageText = msg.message?.imageMessage?.caption
  const videoText = msg.message?.videoMessage?.caption

  const fullMessage = text || extendedTextText || imageText || videoText

  if (!fullMessage) {
    return null
  }
  
}