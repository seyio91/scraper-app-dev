const asyncRedis = require("async-redis");
const { REDIS_HOST, REDIS_PORT } = require('./keys')
const client = asyncRedis.createClient({ host: REDIS_HOST, port: REDIS_PORT });

const { publish } = require('./event')

async function redisSubscriber(){
	client.on('message', function(channel, message){
        publish(message)
    });

await client.subscribe('UPDATED_VIEW')

}

module.exports = redisSubscriber