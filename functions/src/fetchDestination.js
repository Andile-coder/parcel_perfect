const { getPlacesByNameAsync, getPlacesByPostcodeAsync } = require("@themidastouch/parcelperfect/src/places");

const logger = require("./logger");

const fetchDestination = async (order, token) => {
    const postcode = order.billing.postcode;
    const city = order.billing.city;

    const result1 = await getPlacesByNameAsync(city, token);
    logger.log('info', result1);

    const result2 = await getPlacesByPostcodeAsync(postcode, token);
    logger.log('info', result2);

    const result = result1 ? result1 : result2;

    if (result.errorcode) {
        logger.error("fetchDestination", result.errormessage);
        throw Error;      
    } else {
        const places = result1 ? result1.results : result2.results ;
        const filteredPlaces = places.filter(x => x.town.toLowerCase().includes(city.toLowerCase()));

        if (filteredPlaces.length) {
            const destination = filteredPlaces[0];
            return destination;
        } else {
            logger.log('info', 'Places returned by getPlacesByNameAsync does not match user input city');
            return null;
        }
    }
}

module.exports = fetchDestination;

