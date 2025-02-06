export function validateFiles(geojson, json) {
    if (geojson.mimetype !== 'application/octet-stream') {
        return false
    }

    if (json.mimetype !== 'application/json') {
        return false
    }
    
    return true
}