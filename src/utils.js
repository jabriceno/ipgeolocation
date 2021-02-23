const mainLocation = { 'lat': -34.61315, 'lon': -58.37723 };

const getDistance = (lat1, lon1, lat2, lon2) => {
    const rad = function (x) { return x * Math.PI / 180; }
    const R = 6378.137;
    const dLat = rad(lat2 - lat1);
    const dLong = rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d.toFixed(0);
};

const getTimezoneOffset = (timezone) => {
    const offsetString = timezone.split("UTC")[1];
    if (Boolean(offsetString)) {
        const [hours, minutes] = offsetString.split(":");
        return (Math.abs(Number(hours)) + (Number(minutes) * 100 / 60 / 100)) * (Number(hours) > 0 ? 1 : -1);
    }
    return 0;
}

const getHourByTimezone = (timezone) => {
    const currentDate = new Date();
    const timeOffset = getTimezoneOffset(timezone);
    const tzDifference = timeOffset * 60 + currentDate.getTimezoneOffset();
    const offsetTime = new Date(currentDate.getTime() + tzDifference * 60 * 1000);
    return `${offsetTime.toLocaleTimeString()} (${timezone})`;
};

const showMainInfo = (ip, data) => {
    const { 
        countryName, 
        isoName, 
        parsedLanguages, 
        currencyName, 
        countryCurrencyToUSD, 
        currencyCode, 
        timezones, 
        distance, 
        latitude, 
        longitude 
    } = data;

    const parsedHours = timezones.map(timezone => getHourByTimezone(timezone)).join(" o ");

    console.log(`IP: ${ip}, fecha actual: ${new Date().toLocaleString()}
        Pais: ${countryName}
        ISO Code: ${isoName}
        Idiomas: ${parsedLanguages}
        Moneda: ${currencyName} ${countryCurrencyToUSD ? `(1 ${currencyCode} = ${countryCurrencyToUSD} U$S)` : ''}
        Hora: ${parsedHours}
        Distancia estimada: ${distance} kms (${mainLocation.lat}, ${mainLocation.lon}) a (${latitude}, ${longitude})`);
    process.exit(0);
    return;
}

module.exports = {
    getDistance,
    showMainInfo, 
    mainLocation
}