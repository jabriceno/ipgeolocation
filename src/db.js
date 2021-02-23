const { MongoClient } = require("mongodb");

const uri = "mongodb://mongodb:27017/";

class DbConnection {
    constructor() {
        this._database = null;
    }

    set database(database) {
        this._database = database;
    }

    get database() {
        return this._database;
    }

    async connect() {
        const client = new MongoClient(uri, { useUnifiedTopology: true });
        await client.connect();
        const database = client.db('ipGeolocations')
        const collection = database.collection('requestedCountries');
        await collection.createIndex({ distance: 1 });
        this._database = database;

        // cerrar conexion
    }
}

module.exports = new DbConnection();