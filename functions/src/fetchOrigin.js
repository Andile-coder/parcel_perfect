const { getPlacesByPostcodeAsync } = require("@thinwood/parcelperfect/src/places");
const logger = require("./logger");

const fetchOrigin = async (token) => {
    let originPostalcode;
    let originCity;

    if (process.env.ORIGIN_POSTCODE && process.env.ORIGIN_CITY) {

        originPostalcode = process.env.ORIGIN_POSTCODE;
        originCity = process.env.ORIGIN_CITY;

        logger.info({'originPostalcode' : originPostalcode});
        logger.info({'originCity' : originCity});

        const result = await getPlacesByPostcodeAsync(originPostalcode, token);
        logger.info({"getPlacesByPostcodeAsync" : result});

        if (result.errorcode) {
            logger.error("fetchOrigin", result.errormessage);
            throw Error;
        } else {
            const places = result.results;
            const filteredPlaces = places.filter(x => x.town.toLowerCase() === originCity.toLowerCase());
            if (filteredPlaces.length) {
                const origin = filteredPlaces[0];
                return origin;
            } else {
                return null;
            }
        }

    } else {
        return 'process.env.ORIGIN_POSTCODE && process.env.ORIGIN_CITY environment variables not set'
    }

} 

module.exports = fetchOrigin;

