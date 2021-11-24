const { getPlacesByPostcodeAsync } = require("@thinwood/parcelperfect/src/places");
const logger = require("./logger");

const fetchDestination = async (order, token) => {
    const postcode = order.billing.postcode;
    const city = order.billing.city;

    const result = await getPlacesByPostcodeAsync(postcode, token);
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
            return null;
        }
    }
}

module.exports = fetchDestination;

