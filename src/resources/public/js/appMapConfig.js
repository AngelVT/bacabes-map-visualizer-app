var map = L.map('map').setView([19.851412229333601, -98.958063125610352], 13);

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
    let newUrl = new URL(window.location);
    let center = map.getCenter();
    let zoom = map.getZoom();
    let layer = newUrl.searchParams.get("layer");
    
    newUrl.searchParams.set("lat", center.lat.toFixed(15));
    newUrl.searchParams.set("lng", center.lng.toFixed(15));
    newUrl.searchParams.set("zoom", zoom);
    newUrl.searchParams.set("layer", layer);

    window.history.pushState({}, "", newUrl);
});

loadMapView();