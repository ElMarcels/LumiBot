const { kickMember, getGuildMember } = require('../utils/discord-api');

module.exports = {
  name: 'kick',
  description: 'Expulsa a un usuario del servidor',
  default_member_permissions: '32', // KICK_MEMBERS
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
  async execute(interaction) {
    const targetUserId = interaction.data.options.find(o => o.name === 'usuario').value;
    const reason = interaction.data.options.find(o => o.name === 'razon')?.value || 'Sin razón especificada';

    if (targetUserId === interaction.member.user.id) {
      return {
        embeds: [{
          title: '❌ Error',
          description: 'No puedes expulsarte a ti mismo.',
          color: 0xFF0000,
          footer: { text: 'LumiBot' },
        }],
      };
    }

    const targetMember = await getGuildMember(interaction.guild_id, targetUserId);
    if (targetMember.roles.includes(interaction.guild_id)) {
      return {
        embeds: [{
          title: '❌ Error',
          description: 'No puedes expulsar a un administrador del servidor.',
          color: 0xFF0000,
          footer: { text: 'LumiBot' },
        }],
      };
    }

    await kickMember(interaction.guild_id, targetUserId);

    return {
      embeds: [{
        title: '👢 Usuario expulsado',
        description: `**${targetMember.user.username}** ha sido expulsado del servidor.`,
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
