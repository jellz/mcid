import humanizeDuration from 'humanize-duration';
import { createServer } from 'minecraft-protocol';
import { generateCode } from './code/gen';
import { PlayerCodeValue, RedisUtil } from './redis';

const PLAYER_CODE_EXPIRY = 180000; // 3 minutes in MS

const redis = new RedisUtil({
	url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
});

const server = createServer({
	motd: '§6Connect to receive your one-use code!',
	maxPlayers: 2,
	beforePing: (response, client, answerToPing) => {
		const pingResponse = {
			version: {
				name: '1.8-1.16',
				protocol: client.protocolVersion,
			},
			players: {
				max: server.maxPlayers,
				online: 1,
				sample: [],
			},
			description: server.motd,
		};

		client.write('server_info', { response: JSON.stringify(pingResponse) });
	},
});

console.log('Created server, listening for logins');

server.on('login', async client => {
	const { username, uuid } = client;

	let code: PlayerCodeValue;

	const currentCode = await redis.getPlayerCode(uuid);
	console.log(currentCode);
	if (!currentCode) {
		const created = Date.now();
		const expiry = created + PLAYER_CODE_EXPIRY;
		const newCode: PlayerCodeValue = {
			code: generateCode(),
			created,
			expiry,
			username,
			uuid,
		};
		await redis.setPlayerCode(uuid, newCode);
		code = newCode;
	} else {
		code = currentCode;
	}

	const expiryDuration = humanizeDuration(code.expiry - Date.now(), {
		largest: 2,
		delimiter: ' and ',
		round: true,
	});

	client.end(
		`§6Your one-use code is §e§l${code.code}\n§7§oExpires in ${expiryDuration}\n\n\n§cDo not share this code as it is proof of your identity!`
	);
});
