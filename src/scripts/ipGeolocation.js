const axios = require('axios').default;
const { getDistance, showMainInfo, mainLocation } = require('../utils');
const dbConnection = require('../db');
const CacheService = require('../services/cache');

const cache = new CacheService();

const main = async () => {
    const [, , ip] = process.argv;

    try { 
        await dbConnection.connect();  //@TODO: guardar la promesa para usarla solo si la cache fallo
        const database = dbConnection.database;
        const collection = database.collection('requestedCountries');

        const ipCountryData = await cache.get(ip, async () => {
            const { data } = await axios.get(`https://api.ip2country.info/ip?${ip}`);
            return data;
        }, 30 * 60);
        const { countryCode: isoName } = ipCountryData;

        const countryInfoCached = await cache.get(isoName);

        if (countryInfoCached) {
            await collection.updateOne(
                {
                    isoCode: isoName
                },
                {
                    $inc: {
                        invocations: 1
                    }
                }
            );

            showMainInfo(ip, countryInfoCached);
        }

        const { data: infoCountryData } = await axios.get(`https://restcountries.eu/rest/v2/alpha/${isoName}`);

        const {
            currencies: [{ code: currencyCode, name: currencyName }],
            name: countryName,
            languages,
            timezones,
            latlng: [lat, lon]
        } = infoCountryData;

        const parsedLanguages = languages.map(language => language.name).join(", ");

        let countryCurrencyToUSD;
        if (currencyCode !== 'USD') {
            const { data: infoConversionData } = await axios.get(`https://free.currconv.com/api/v7/convert`, {
                params: {
                    q: `${currencyCode}_USD`,
                    compact: "ultra",
                    apiKey: "1105b0daf0f31fbe9b3b",
                }
            });
            [countryCurrencyToUSD] = Object.values(infoConversionData);
        }
        const distance = getDistance(mainLocation.lat, mainLocation.lon, lat, lon);

        await collection.findOneAndUpdate(
            {
                isoCode: isoName
            },
            {
                $set: {
                    country: countryName,
                    isoCode: isoName,
                    distance: Number(distance)
                },
                $inc: {
                    invocations: 1
                }
            },
            {
                upsert: true
            }
        );

        const dataToShow = {
            countryName,
            isoName,
            parsedLanguages,
            currencyName,
            countryCurrencyToUSD,
            currencyCode,
            timezones,
            distance,
            latitude: lat,
            longitude: lon
        }

        cache.set(isoName, dataToShow);
        showMainInfo(ip, dataToShow);
    } catch (e) {
        if (e.config && e.response) {
            console.error(`Failed request to ${e.config.url}`, e.response.data);
        }
        console.error(`Can't find information for the ip address: ${ip}`, e.message);
        process.exit(0);
    }
};

main();
