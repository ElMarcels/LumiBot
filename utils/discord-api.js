const DISCORD_API_BASE = 'https://discord.com/api/v10';
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

async function discordFetch(endpoint, options = {}) {
  const url = `${DISCORD_API_BASE}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bot ${DISCORD_TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Discord API error ${res.status}: ${error}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

async function sendMessage(channelId, payload) {
  return discordFetch(`/channels/${channelId}/messages`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

async function getGuild(guildId) {
  return discordFetch(`/guilds/${guildId}?with_counts=true`);
}

async function getGuildMember(guildId, userId) {
  return discordFetch(`/guilds/${guildId}/members/${userId}`);
}

async function kickMember(guildId, userId) {
  return discordFetch(`/guilds/${guildId}/members/${userId}`, {
    method: 'DELETE',
  });
}

async function banMember(guildId, userId, reason) {
  return discordFetch(`/guilds/${guildId}/bans/${userId}?delete_message_days=0`, {
    method: 'PUT',
    body: JSON.stringify({ reason }),
  });
}

async function muteMember(guildId, userId) {
  return discordFetch(`/guilds/${guildId}/members/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify({ mute: true }),
  });
}

module.exports = {
  sendMessage,
  getGuild,
  getGuildMember,
  kickMember,
  banMember,
  muteMember,
};
