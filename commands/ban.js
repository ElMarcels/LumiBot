const { banMember, getGuildMember } = require('../utils/discord-api');

module.exports = {
  name: 'ban',
  description: 'Banea a un usuario del servidor',
  default_member_permissions: '4', // BAN_MEMBERS
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
  async execute(interaction) {
    const targetUserId = interaction.data.options.find(o => o.name === 'usuario').value;
    const reason = interaction.data.options.find(o => o.name === 'razon')?.value || 'Sin razón especificada';

    if (targetUserId === interaction.member.user.id) {
      return {
        embeds: [{
          title: '❌ Error',
          description: 'No puedes banear a ti mismo.',
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
            description: 'No puedes banear a un administrador del servidor.',
            color: 0xFF0000,
            footer: { text: 'LumiBot' },
          }],
        };
      }
    } catch {
      // User not in guild, but can still be banned
    }

    await banMember(interaction.guild_id, targetUserId, reason);

    return {
      embeds: [{
        title: '🔨 Usuario baneado',
        description: `**<@${targetUserId}>** ha sido baneado del servidor.`,
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
