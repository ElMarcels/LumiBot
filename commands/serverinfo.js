const { getGuild } = require('../utils/discord-api');

module.exports = {
  name: 'serverinfo',
  description: 'Muestra información del servidor',
  async execute(interaction) {
    const guild = await getGuild(interaction.guild_id);

    const createdAt = new Date(guild.created_at).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const verificationLevels = {
      0: 'Ninguno',
      1: 'Bajo',
      2: 'Medio',
      3: 'Alto',
      4: 'Muy alto',
    };

    const iconUrl = guild.icon
      ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=1024`
      : null;

    const embed = {
      title: `🏠 ${guild.name}`,
      color: 0xD500F9,
      fields: [
        { name: 'ID', value: guild.id, inline: true },
        { name: 'Creado', value: createdAt, inline: true },
        { name: 'Miembros', value: `${guild.approximate_member_count}`, inline: true },
        { name: 'Canales de texto', value: `${guild.channels?.filter(c => c.type === 0).length || 0}`, inline: true },
        { name: 'Canales de voz', value: `${guild.channels?.filter(c => c.type === 2).length || 0}`, inline: true },
        { name: 'Roles', value: `${guild.roles?.length || 0}`, inline: true },
        { name: 'Nivel de verificación', value: verificationLevels[guild.verification_level] || 'Desconocido', inline: true },
      ],
      footer: { text: 'LumiBot' },
      timestamp: new Date().toISOString(),
    };

    if (iconUrl) embed.thumbnail = { url: iconUrl };

    return { embeds: [embed] };
  },
};
