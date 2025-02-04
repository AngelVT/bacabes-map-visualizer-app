var map = L.map('map').setView([19.85983456737268, -98.95770080079076], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

function loadMapView() {
    let params = new URLSearchParams(window.location.search);
    let lat = parseFloat(params.get("lat"));
    let lng = parseFloat(params.get("lng"));
    let zoom = parseInt(params.get("zoom"));

    if (!isNaN(lat) && !isNaN(lng) && !isNaN(zoom)) {
        map.setView([lat, lng], zoom);
    }
}

map.on("moveend", function () {
    let center = map.getCenter();
    let zoom = map.getZoom();
    let newUrl = `${window.location.pathname}?lat=${center.lat.toFixed(15)}&lng=${center.lng.toFixed(15)}&zoom=${zoom}`;
    window.history.replaceState(null, "", newUrl);
});

loadMapView();