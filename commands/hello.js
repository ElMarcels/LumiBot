module.exports = {
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
  execute(interaction) {
    const nombre = interaction.data.options?.find(o => o.name === 'nombre')?.value || interaction.member.user.username;

    return {
      embeds: [{
        title: '👋 ¡Hola!',
        description: `¡Hola **${nombre}**! Soy **LumiBot**, tu asistente de Discord. ¿En qué puedo ayudarte hoy?`,
        color: 0xD500F9,
        thumbnail: { url: interaction.member.user.avatar
          ? `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}.png`
          : `https://cdn.discordapp.com/embed/avatars/${parseInt(interaction.member.user.discriminator || '0') % 5}.png` },
        footer: { text: 'LumiBot' },
        timestamp: new Date().toISOString(),
      }],
    };
  },
};
