module.exports = {
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
  execute(interaction) {
    let user;

    if (interaction.data.options?.length) {
      const targetId = interaction.data.options.find(o => o.name === 'usuario')?.value;
      user = interaction.data.resolved?.users?.[targetId] || { id: targetId, username: 'Usuario' };
    } else {
      user = interaction.member.user;
    }

    const avatarUrl = user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=1024`
      : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator || '0') % 5}.png`;

    return {
      embeds: [{
        title: `🖼️ Avatar de ${user.username}`,
        image: { url: avatarUrl },
        color: 0xD500F9,
        footer: { text: 'LumiBot' },
        timestamp: new Date().toISOString(),
      }],
    };
  },
};
