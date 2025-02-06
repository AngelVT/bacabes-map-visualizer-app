var map = L.map('map').setView([19.85983456737268, -98.95770080079076], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.Control.FullscreenButton = L.Control.extend({
    onAdd: function(map) {
        let button = L.DomUtil.create("button", "leaflet-bar leaflet-control leaflet-control-custom");
        button.innerHTML = "⛶";
        button.title = "Toggle Fullscreen";
        button.style.fontSize = "18px";
        button.style.width = "30px";
        button.style.height = "30px";
        button.style.cursor = "pointer";
        
        button.onclick = function() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        };

        return button;
    }
});

L.control.fullscreenButton = function(opts) {
    return new L.Control.FullscreenButton(opts);
};

map.addControl(L.control.fullscreenButton({ position: "bottomleft" }));

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