import { Minecraft } from './minecraft';
import { RedisUtil } from './redis';
import { Web } from './web';

const redis = new RedisUtil({
	url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
});

new Minecraft(redis);
new Web(redis);
