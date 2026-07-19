const { verifySignature } = require('../utils/verify');

const INTERACTION_TYPE = {
  PING: 1,
  APPLICATION_COMMAND: 2,
};

const INTERACTION_RESPONSE_TYPE = {
  PONG: 1,
  CHANNEL_MESSAGE: 4,
  DEFERRED_CHANNEL_MESSAGE: 5,
};

// Load all commands
const ping = require('../commands/ping');
const hello = require('../commands/hello');
const userinfo = require('../commands/userinfo');
const avatar = require('../commands/avatar');
const serverinfo = require('../commands/serverinfo');
const kick = require('../commands/kick');
const ban = require('../commands/ban');
const mute = require('../commands/mute');

const commands = {
  ping,
  hello,
  userinfo,
  avatar,
  serverinfo,
  kick,
  ban,
  mute,
};

module.exports = async (req, res) => {
  // Handle GET requests (for Vercel deployment verification)
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      message: 'LumiBot is running!',
      commands: Object.keys(commands),
    });
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const signature = req.headers['x-signature-ed25519'];
    const timestamp = req.headers['x-signature-timestamp'];
    const body = JSON.stringify(req.body);

    if (!verifySignature({ signature, timestamp, body })) {
      return res.status(401).json({ error: 'Invalid request signature' });
    }

    const interaction = req.body;

    // Handle PING interaction (Discord verification)
    if (interaction.type === INTERACTION_TYPE.PING) {
      return res.status(200).json({ type: INTERACTION_RESPONSE_TYPE.PONG });
    }

    // Handle slash commands
    if (interaction.type === INTERACTION_TYPE.APPLICATION_COMMAND) {
      const commandName = interaction.data.name;
      const command = commands[commandName];

      if (!command) {
        return res.status(200).json({
          type: INTERACTION_RESPONSE_TYPE.CHANNEL_MESSAGE,
          data: {
            content: `Comando desconocido: ${commandName}`,
            flags: 64, // EPHEMERAL
          },
        });
      }

      try {
        const response = await command.execute(interaction);
        return res.status(200).json({
          type: INTERACTION_RESPONSE_TYPE.CHANNEL_MESSAGE,
          data: response,
        });
      } catch (error) {
        console.error(`Error executing command ${commandName}:`, error);
        return res.status(200).json({
          type: INTERACTION_RESPONSE_TYPE.CHANNEL_MESSAGE,
          data: {
            content: '❌ Hubo un error al ejecutar este comando.',
            flags: 64,
          },
        });
      }
    }

    return res.status(400).json({ error: 'Unknown interaction type' });
  } catch (error) {
    console.error('Error processing interaction:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
