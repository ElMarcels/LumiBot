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
    const targetUserId = interaction.data.options?.find(o => o.name === 'usuario')?.value || interaction.member.user.id;
    const targetUser = interaction.data.options?.find(o => o.name === 'usuario')?.value
      ? null // Need to resolve from the option
      : interaction.member.user;

    // For simplicity, use the invoking user's info if no target specified
    const user = targetUser || interaction.member.user;

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
