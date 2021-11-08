
// Keys
const keys = require('./keys');

// Express app setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());


// Postgres client setup
const { Pool } = require('pg');

const pgClient = new Pool({
    host: keys.pgHost,
    port: keys.pgPort,
    database: keys.pgDatabase,
    user: keys.pgUser,
    password: keys.pgPassword
});

pgClient.on('error', () => console.error('No postgres connection'));
console.log("Postgres db ready");

pgClient.on("connect", (client) => {
    client
        .query("CREATE TABLE IF NOT EXISTS seen (index INT)")
        .catch((err) => console.error("ERROR: Initialising postgres db: " + err));
  });

// Redis client setup
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});
const redisPublisher = redisClient.duplicate();
console.log('Redis ready');

// Express routes and handlers
app.get('/', (req, res) => {
    res.send('Hi');
});

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT index FROM seen');
    res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send(values);
    });
});

app.post('/values', async (req, res) => {
    const index = req.body.index;

    if (parseInt(index) > 40) {
        return res.status(422).send('Index too large');
    }

    redisClient.hset('values', index, 'tbc');
    redisPublisher.publish('insert', index);

    pgClient.query('INSERT INTO seen (index) VALUES ($1)', [index]);

    res.send({ working: true });
});

app.listen(5000, err => {
    console.log('listening on port 5000');
});