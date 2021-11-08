const keys = require('./keys');
const redis = require('redis')


function fib(index) {
    if (index < 2) return 1;
    return fib(index - 1) + fib(index - 2);
}


const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});
const sub = redisClient.duplicate();


// Setup a handler to respond to messages by calculating the fib value
//  corresponding to the index in the message
sub.on('message', (channel, message) => {
    console.log("Got work: " + message);
    redisClient.hset('values', message, fib(parseInt(message)))
});
sub.subscribe('insert');