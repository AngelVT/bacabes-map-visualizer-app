var map = L.map('map').setView([19.851412229333601, -98.958063125610352], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// * add full screen button
L.Control.FullscreenButton = L.Control.extend({
    onAdd: function (map) {
        let button = L.DomUtil.create("button", "leaflet-bar leaflet-control leaflet-control-custom");
        button.innerHTML = "⛶";
        button.title = "Toggle Fullscreen";
        button.style.fontSize = "18px";
        button.style.width = "30px";
        button.style.height = "30px";
        button.style.cursor = "pointer";

        button.onclick = function () {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        };

        return button;
    }
});

L.control.fullscreenButton = function (opts) {
    return new L.Control.FullscreenButton(opts);
};

map.addControl(L.control.fullscreenButton({ position: "bottomleft" }));

// * add capture button
async function capture() {
    // (A) GET MEDIA STREAM
    const stream = await navigator.mediaDevices.getDisplayMedia({
        preferCurrentTab: true
    });

    // (B) STREAM TO VIDEO
    const vid = document.createElement("video");

    // (C) VIDEO TO CANVAS
    vid.addEventListener("loadedmetadata", function () {
        // (C1) CAPTURE VIDEO FRAME ON CANVAS
        const canvas = document.createElement("canvas"),
            ctx = canvas.getContext("2d");
        ctx.canvas.width = vid.videoWidth;
        ctx.canvas.height = vid.videoHeight;
        ctx.drawImage(vid, 0, 0, vid.videoWidth, vid.videoHeight);

        // (C2) STOP MEDIA STREAM
        stream.getVideoTracks()[0].stop();
        // (C3) "FORCE DOWNLOAD"
        let a = document.createElement("a");
        a.download = "bacabes-capture.png";
        a.href = canvas.toDataURL("image/png");
        a.click(); // MAY NOT ALWAYS WORK!
    });

    // (D) GO!
    vid.srcObject = stream;
    vid.play();
}

L.Control.mapCapture = L.Control.extend({
    onAdd: function (map) {
        let button = L.DomUtil.create("button", "leaflet-bar leaflet-control leaflet-control-custom");
        button.innerHTML = "📷";
        button.title = "Capture Screen";
        button.style.fontSize = "15px";
        button.style.width = "35px";
        button.style.height = "35px";
        button.style.cursor = "pointer";

        button.onclick = async function () {
            // Obtener el centro de la ventana
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            // Crear un nuevo evento de clic
            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: centerX,
                clientY: centerY
            });

            // Función para disparar el evento de clic en el elemento
            const triggerClick = () => {
                // Obtener el elemento en las coordenadas del centro de la página
                const element = document.elementFromPoint(centerX, centerY);

                // Disparar el evento de clic en el elemento
                if (element) {
                    element.dispatchEvent(clickEvent);
                }
            };

            // Hacer una pausa de 2 segundos antes de simular el clic
            setTimeout(triggerClick, 0);

            setTimeout(capture, 100);
        };

        return button;
    }
});

L.control.mapCapture = function (opts) {
    return new L.Control.mapCapture(opts);
};

map.addControl(L.control.mapCapture({ position: "topleft" }));

L.Control.squareWindow = L.Control.extend({
    onAdd: function (map) {
        let button = L.DomUtil.create("button", "leaflet-bar leaflet-control leaflet-control-custom");
        button.innerHTML = "🗔";
        button.title = "Capture Screen";
        button.style.fontSize = "18px";
        button.style.width = "35px";
        button.style.height = "35px";
        button.style.cursor = "pointer";

        button.onclick = async function () {
            window.open(window.location, 'myWindow', 'width=1000,height=1000,menubar=no,toolbar=no,location=no,scrollbars=no,status=no,resizable=no');
        };

        return button;
    }
});

L.control.squareWindow = function (opts) {
    return new L.Control.squareWindow(opts);
};

map.addControl(L.control.squareWindow({ position: "topleft" }));

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