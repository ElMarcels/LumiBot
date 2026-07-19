const DISCORD_API_BASE = 'https://discord.com/api/v10';
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const APPLICATION_ID = process.env.DISCORD_APPLICATION_ID;

const commands = [
  {
    name: 'ping',
    description: 'Muestra la latencia del bot',
  },
  {
    name: 'hello',
    description: 'El bot te saluda',
    options: [
      {
        name: 'nombre',
        description: 'Tu nombre para personalizar el saludo',
        type: 3,
        required: false,
      },
    ],
  },
  {
    name: 'userinfo',
    description: 'Muestra información de un usuario',
    options: [
      {
        name: 'usuario',
        description: 'El usuario del que quieres ver información',
        type: 6,
        required: false,
      },
    ],
  },
  {
    name: 'avatar',
    description: 'Muestra el avatar de un usuario',
    options: [
      {
        name: 'usuario',
        description: 'El usuario del que quieres ver el avatar',
        type: 6,
        required: false,
      },
    ],
  },
  {
    name: 'serverinfo',
    description: 'Muestra información del servidor',
  },
  {
    name: 'kick',
    description: 'Expulsa a un usuario del servidor',
    default_member_permissions: '32',
    options: [
      {
        name: 'usuario',
        description: 'El usuario que quieres expulsar',
        type: 6,
        required: true,
      },
      {
        name: 'razon',
        description: 'Razón de la expulsión',
        type: 3,
        required: false,
      },
    ],
  },
  {
    name: 'ban',
    description: 'Banea a un usuario del servidor',
    default_member_permissions: '4',
    options: [
      {
        name: 'usuario',
        description: 'El usuario que quieres banear',
        type: 6,
        required: true,
      },
      {
        name: 'razon',
        description: 'Razón del baneo',
        type: 3,
        required: false,
      },
    ],
  },
  {
    name: 'mute',
    description: 'Silencia a un usuario en el servidor',
    default_member_permissions: '4',
    options: [
      {
        name: 'usuario',
        description: 'El usuario que quieres silenciar',
        type: 6,
        required: true,
      },
      {
        name: 'razon',
        description: 'Razón del silenciamiento',
        type: 3,
        required: false,
      },
    ],
  },
];

async function deployCommands() {
  if (!DISCORD_TOKEN || !APPLICATION_ID) {
    console.error('Error: DISCORD_TOKEN and DISCORD_APPLICATION_ID must be set in environment variables.');
    console.error('Copy .env.example to .env and fill in your credentials.');
    process.exit(1);
  }

  const url = `${DISCORD_API_BASE}/applications/${APPLICATION_ID}/commands`;

  try {
    console.log(`Deploying ${commands.length} slash commands...`);

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bot ${DISCORD_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commands),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Discord API error ${res.status}: ${error}`);
    }

    const data = await res.json();
    console.log(`Successfully deployed ${data.length} slash commands.`);
  } catch (error) {
    console.error('Error deploying commands:', error);
    process.exit(1);
  }
}

deployCommands();
