const { getGuildMember } = require('../utils/discord-api');

module.exports = {
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
  async execute(interaction) {
    const targetUserId = interaction.data.options?.find(o => o.name === 'usuario')?.value || interaction.member.user.id;
    const member = await getGuildMember(interaction.guild_id, targetUserId);
    const user = member.user;

    const roles = member.roles
      .filter(r => r !== interaction.guild_id)
      .map(r => `<@&${r}>`)
      .join(', ') || 'Ninguno';

    const joinedAt = new Date(member.joined_at).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const createdAt = new Date(
      (BigInt(user.id) >> 22n) + 1420070400000n
    ).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const avatarUrl = user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
      : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator || '0') % 5}.png`;

    return {
      embeds: [{
        title: `👤 Información de ${user.username}`,
        thumbnail: { url: avatarUrl },
        fields: [
          { name: 'Nombre', value: `${user.username}`, inline: true },
          { name: 'ID', value: user.id, inline: true },
          { name: 'Creado', value: createdAt, inline: true },
          { name: 'Se unió', value: joinedAt, inline: true },
          { name: 'Roles', value: roles.length > 1024 ? roles.substring(0, 1020) + '...' : roles },
        ],
        color: 0xD500F9,
        footer: { text: 'LumiBot' },
        timestamp: new Date().toISOString(),
      }],
    };
  },
};
