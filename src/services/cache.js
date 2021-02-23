const redis = require('../redis')

class Cache {

    constructor() {
        const { client, getAsync, setAsync } = redis();
        this.redisClient = client;
        this.getAsync = getAsync;
        this.setAsync = setAsync;
    }

    async get(key, storeFunction, ttl) {
        const value = await this.getAsync(key);
        if (value) {
            return Promise.resolve(JSON.parse(value));
        }

        if (storeFunction) {
            return storeFunction().then(async (result) => {
                if (result.countryCode !== '') {
                    await this.set(key, result, ttl);
                }
                return result;
            });
        }
    }

    set(key, value, ttl = 60 * 60 * 24) {
        return this.setAsync(key, JSON.stringify(value), 'EX', ttl);
    }
}

module.exports = Cache;