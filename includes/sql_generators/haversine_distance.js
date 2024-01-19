/**
 * Calculates the distance between two sets of latitude and longitude.
 * The formula is from the following blog post:
 * http://daynebatten.com/2015/09/latitude-longitude-distance-sql/
 * 
 * @param {number} lat1 - The latitude of the first point.
 * @param {number} lon1 - The longitude of the first point.
 * @param {number} lat2 - The latitude of the second point.
 * @param {number} lon2 - The longitude of the second point.
 * @param {string} [unit='mi'] - The unit of distance to be returned. Can be 'mi' for miles or 'km' for kilometers.
 * @returns {number} The distance between the two points in the specified unit.
 * @throws {Error} If the unit input is not 'mi' or 'km'.
 */
/*
    This calculates the distance between two sets of latitude and longitude.
    The formula is from the following blog post:
    http://daynebatten.com/2015/09/latitude-longitude-distance-sql/
    
    The arguments should be float type.
*/



function degrees_to_radians(degrees) {
    return Math.PI * degrees / 180;
}

function haversine_distance(lat1, lon1, lat2, lon2, unit = 'mi') {
    let conversion_rate;
    if (unit === 'mi') {
        conversion_rate = 1;
    } else if (unit === 'km') {
        conversion_rate = 1.60934;
    } else {
        throw new Error("unit input must be one of 'mi' or 'km'. Got " + unit);
    }

    const radians_lat1 = degrees_to_radians(lat1);
    const radians_lat2 = degrees_to_radians(lat2);
    const radians_lon1 = degrees_to_radians(lon1);
    const radians_lon2 = degrees_to_radians(lon2);

    const distance = 2 * 3961 * Math.asin(Math.sqrt(Math.pow(Math.sin((radians_lat2 - radians_lat1) / 2), 2) +
        Math.cos(radians_lat1) * Math.cos(radians_lat2) *
        Math.pow(Math.sin((radians_lon2 - radians_lon1) / 2), 2))) * conversion_rate;

    return distance;
}
