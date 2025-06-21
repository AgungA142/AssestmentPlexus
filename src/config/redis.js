const redis = require('redis');
const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;

const redisClient = redis.createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
  password: REDIS_PASSWORD,
});
redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});
redisClient.on('connect', () => {
  console.log('Connected to Redis');
});
redisClient.connect().catch((err) => {
  console.error('Failed to connect to Redis', err);
});

module.exports = redisClient;