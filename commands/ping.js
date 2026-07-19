module.exports = {
  name: 'ping',
  description: 'Muestra la latencia del bot',
  execute(interaction) {
    return {
      embeds: [{
        title: '🏓 Pong!',
        description: `Latencia del bot: **${Date.now() - interaction.created_at}ms**`,
        color: 0xD500F9,
        footer: { text: 'LumiBot' },
        timestamp: new Date().toISOString(),
      }],
    };
  },
};
