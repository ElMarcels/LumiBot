module.exports = {
  name: 'ping',
  description: 'Muestra la latencia del bot',
  execute(interaction) {
    return {
      embeds: [{
        title: '🏓 Pong!',
        description: `Latencia del bot: **${Date.now() - new Date(interaction.created_at).getTime()}ms**`,
        color: 0xD500F9,
        footer: { text: 'LumiBot' },
        timestamp: new Date().toISOString(),
      }],
    };
  },
};
