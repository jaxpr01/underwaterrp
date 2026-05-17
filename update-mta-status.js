const fs = require('fs');
const path = require('path');
const Gamedig = require('gamedig');

const STATUS_FILE = path.join(__dirname, '..', 'server-status.json');
const SERVER_IP = '147.135.31.154';
const SERVER_PORT = 30020;
const GAME_TYPE = 'gtasamta';

(async () => {
  const status = {
    name: null,
    ip: SERVER_IP,
    port: SERVER_PORT,
    players: null,
    maxPlayers: null,
    ping: null,
    uptime: null,
    online: false,
    timestamp: new Date().toISOString(),
    error: null
  };

  try {
    const result = await Gamedig.GameDig.query({
      type: GAME_TYPE,
      host: SERVER_IP,
      port: SERVER_PORT
    });

    status.name = result.name || null;
    status.players = result.players.length;
    status.maxPlayers = result.maxplayers ?? null;
    status.ping = result.ping ?? null;
    status.online = true;
    status.error = null;
  } catch (error) {
    status.error = error.message || String(error);
  }

  fs.writeFileSync(STATUS_FILE, JSON.stringify(status, null, 2), 'utf8');
  console.log('Updated status file:', STATUS_FILE);
})();
