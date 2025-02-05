export function validateFiles(geojson, json) {
    if (geojson.mimetype !== 'application/geo+json') {
        return false
    }

    if (json.mimetype !== 'application/json') {
        return false
    }
    
    return true
}