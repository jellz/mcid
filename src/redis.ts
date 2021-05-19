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

	async getCodeByPlayer(uuid: string): Promise<PlayerCodeValue | null> {
		const json = await this.client.get(`player_code:${uuid}`);
		if (!json) return null;

		return JSON.parse(json);
	}

	async getPlayerByCode(code: string): Promise<PlayerCodeValue | null> {
		const json = await this.client.get(`code_player:${code}`);
		if (!json) return null;

		return JSON.parse(json);
	}

	async setPlayerCode(uuid: string, value: PlayerCodeValue) {
		await this.newCodeGeneratedAnalytics();
		await this.client.set(`code_player:${value.code}`, JSON.stringify(value), [
			'PX',
			value.expiry - value.created,
		]);
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

	async getAnalytics() {
		const totalCodesGenerated = await this.client.get(
			'analytics:total_codes_generated'
		);
		const lastGeneratedTime = await this.client.get(
			'analytics:last_code_generated_time'
		);
		return {
			totalCodesGenerated: totalCodesGenerated
				? parseInt(totalCodesGenerated)
				: null,
			lastGeneratedTime: lastGeneratedTime ? parseInt(lastGeneratedTime) : null,
		};
	}

	async deleteCode(code: string) {
		const value = await this.getPlayerByCode(code);
		if (!value) return null;

		await this.client.del(
			`player_code:${value.uuid}`,
			`code_player:${value.code}`
		);

		return value;
	}
}
