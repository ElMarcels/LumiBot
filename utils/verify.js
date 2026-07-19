const nacl = require('tweetnacl');

const DISCORD_PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY;

function verifySignature({ signature, timestamp, body }) {
  if (!DISCORD_PUBLIC_KEY) {
    console.error('DISCORD_PUBLIC_KEY is not set');
    return false;
  }

  const publicKeyBuffer = hexToUint8Array(DISCORD_PUBLIC_KEY);
  const signatureBuffer = hexToUint8Array(signature);
  const timestampBuffer = new TextEncoder().encode(timestamp);
  const bodyBuffer = new TextEncoder().encode(body);

  const message = new Uint8Array(timestampBuffer.length + bodyBuffer.length);
  message.set(timestampBuffer);
  message.set(bodyBuffer, timestampBuffer.length);

  return nacl.sign.detached.verify(message, signatureBuffer, publicKeyBuffer);
}

function hexToUint8Array(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

module.exports = { verifySignature };
