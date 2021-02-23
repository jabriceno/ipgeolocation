const redis = require("redis");
const { promisify } = require("util");

const url = "redis://redis:6379/";

const redisConnection = () => {
    const client = redis.createClient({
        url
    });

    client.on("error", function (error) {
        console.error(error);
    });

    const getAsync = promisify(client.get).bind(client);
    const setAsync = promisify(client.set).bind(client);

    return {client, getAsync, setAsync};
};

module.exports = redisConnection;