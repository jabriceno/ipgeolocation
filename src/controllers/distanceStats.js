const getNearest = async ({ database }, res) => {
    const collection = database.collection('requestedCountries');
    const nearest = await collection.findOne({}, { sort: { distance: 1 }, projection: { _id: 0 } } );
    res.json(nearest);
}

const getFarthest = async ({ database }, res) => {
    const collection = database.collection('requestedCountries');
    const farthest = await collection.findOne({}, {sort: { distance: -1 }, projection: { _id: 0 } } );
    res.json(farthest);
}

const getDistanceAverage = async ({ database }, res) => {
    const collection = database.collection('requestedCountries');
    const [ average ] = await collection.aggregate(
        [{ $match: {} }, 
        {
            $group: {
                _id: null,
                totalDistancexInvocations: { $sum: { $multiply: [ "$distance", "$invocations" ] } },
                totalInvocations: { $sum: "$invocations" }
            }
        },
        {
            $project: {
                _id: 0,
                average: { $round: [ { $divide: [ "$totalDistancexInvocations", "$totalInvocations" ] }, 2 ] }
            }
        }]
    ).toArray();
    
    res.json(average);
}

module.exports = { 
    getNearest,
    getFarthest,
    getDistanceAverage
}