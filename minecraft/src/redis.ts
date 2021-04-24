import { createNodeRedisClient, WrappedNodeRedisClient } from 'handy-redis';
import { ClientOpts } from 'redis';

export interface PlayerCodeValue {
	code: string;
	created: number;
	expiry: number;
	uuid: string;
	username: string;
}

export class RedisUtil {
	private client: WrappedNodeRedisClient;

	constructor(options?: ClientOpts) {
		this.client = createNodeRedisClient(options);
		// Enable snapshotting every 2 minutes - just for analytic persistence (total codes generated)
		this.client.config('SET', 'save', '120 1');
	}

	async getPlayerCode(uuid: string): Promise<PlayerCodeValue | null> {
		const json = await this.client.get(`player_code:${uuid}`);
		if (!json) return null;

		return JSON.parse(json);
	}

	async setPlayerCode(uuid: string, value: PlayerCodeValue) {
		await this.newCodeGeneratedAnalytics();
		return await this.client.set(`player_code:${uuid}`, JSON.stringify(value), [
			'PX',
			value.expiry - value.created,
		]);
	}

	async newCodeGeneratedAnalytics() {
		await this.client.incr('analytics:total_codes_generated');
		await this.client.set(
			'analytics:last_code_generated_time',
			Date.now().toString()
		);
	}
}
