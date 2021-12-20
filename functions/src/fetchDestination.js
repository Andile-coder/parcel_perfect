const { getPlacesByPostcodeAsync } = require("@themidastouch/parcelperfect/src/places");
const logger = require("./logger");

const fetchDestination = async (order, token) => {
    const postcode = order.billing.postcode;
    const city = order.billing.city;

    const result = await getPlacesByPostcodeAsync(postcode, token);
    logger.log('info', result);

    if (result.errorcode) {
        logger.error("fetchDestination", result.errormessage);
        throw Error;
    } else {
        const places = result.results;
        const filteredPlaces = places.filter(x => x.town.toLowerCase().includes(city.toLowerCase()));

        if (filteredPlaces.length) {
            const destination = filteredPlaces[0];
            return destination;
        } else {
            logger.log('info', 'Places returned by getPlacesByPostcodeAsync does not match user input city');
            return null;
        }
    }
}

module.exports = fetchDestination;