import humanizeDuration from 'humanize-duration';
import { Client, createServer, Server } from 'minecraft-protocol';
import { generateCode } from './code/gen';
import { PlayerCodeValue, RedisUtil } from './redis';

const PLAYER_CODE_EXPIRY = 180000; // 3 minutes in MS

export class Minecraft {
	private server: Server;
	private redis: RedisUtil;

	constructor(redis: RedisUtil) {
		this.redis = redis;
		this.server = this.create();
		this.server.on('login', this.handleLogin.bind(this));
		console.log('Minecraft server is listening for connections on port 25566');
	}

	create() {
		return createServer({
			motd: '§6Connect to receive your one-use code!',
			maxPlayers: 2,
			beforePing: (response, client, answerToPing) => {
				const pingResponse = {
					version: {
						name: '1.8-1.16',
						protocol: client.protocolVersion,
					},
					players: {
						max: this.server.maxPlayers,
						online: 1,
						sample: [],
					},
					description: this.server.motd,
				};

				client.write('server_info', { response: JSON.stringify(pingResponse) });
			},
		});
	}

	async handleLogin(client: Client) {
		const { username, uuid } = client;

		let code: PlayerCodeValue;

		const currentCode = await this.redis.getCodeByPlayer(uuid);
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
			await this.redis.setPlayerCode(uuid, newCode);
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
	}
}
