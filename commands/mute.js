const { muteMember, getGuildMember } = require('../utils/discord-api');

module.exports = {
  name: 'mute',
  description: 'Silencia a un usuario en el servidor',
  default_member_permissions: '4', // MANAGE_ROLES (needed for timeout)
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
  async execute(interaction) {
    const targetUserId = interaction.data.options.find(o => o.name === 'usuario').value;
    const reason = interaction.data.options.find(o => o.name === 'razon')?.value || 'Sin razón especificada';

    if (targetUserId === interaction.member.user.id) {
      return {
        embeds: [{
          title: '❌ Error',
          description: 'No puedes silenciarte a ti mismo.',
          color: 0xFF0000,
          footer: { text: 'LumiBot' },
        }],
      };
    }

    try {
      const targetMember = await getGuildMember(interaction.guild_id, targetUserId);

      if (targetMember.roles.includes(interaction.guild_id)) {
        return {
          embeds: [{
            title: '❌ Error',
            description: 'No puedes silenciar a un administrador del servidor.',
            color: 0xFF0000,
            footer: { text: 'LumiBot' },
          }],
        };
      }
    } catch {
      return {
        embeds: [{
          title: '❌ Error',
          description: 'No se pudo encontrar al usuario en este servidor.',
          color: 0xFF0000,
          footer: { text: 'LumiBot' },
        }],
      };
    }

    await muteMember(interaction.guild_id, targetUserId);

    return {
      embeds: [{
        title: '🔇 Usuario silenciado',
        description: `**<@${targetUserId}>** ha sido silenciado en el servidor.`,
        fields: [
          { name: 'Razón', value: reason },
          { name: 'Moderador', value: `<@${interaction.member.user.id}>` },
        ],
        color: 0xD500F9,
        footer: { text: 'LumiBot' },
        timestamp: new Date().toISOString(),
      }],
    };
  },
};
