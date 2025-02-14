let isInteractingWithControl = false;
let markers = [];

// * Add opacity control
L.Control.opacityControl = L.Control.extend({
    onAdd: function (map) {
        let controlContainer = L.DomUtil.create("label", "bi-eye-fill opacity-control leaflet-bar leaflet-control leaflet-control-custom");

        let inputSlider = L.DomUtil.create("input", "", controlContainer);
        inputSlider.title = "Opacity Slider";
        inputSlider.type = 'range';
        inputSlider.step = 0.1;
        inputSlider.min = 0;
        inputSlider.max = 1.0;
        inputSlider.value = 0.7;
        
        const renderedPolygons = document.querySelector('.leaflet-overlay-pane');

        renderedPolygons.style.opacity = inputSlider.value;

        L.DomEvent.on(inputSlider, "input", function () {

            renderedPolygons.style.opacity = inputSlider.value;

            if (inputSlider.value == 0) {
                controlContainer.classList.remove('bi-eye-fill');
                controlContainer.classList.add('bi-eye-slash-fill');
                return;
            }

            controlContainer.classList.add('bi-eye-fill');
            controlContainer.classList.remove('bi-eye-slash-fill');
        });

        L.DomEvent.on(controlContainer, "mouseenter", function () {
            map.dragging.disable();
            setControlInteraction(true);
        });

        L.DomEvent.on(controlContainer, "mouseleave", function () {
            map.dragging.enable();
            setControlInteraction(false)
        });


        return controlContainer;
    }
});

L.control.opacityControl = function (opts) {
    return new L.Control.opacityControl(opts);
};

map.addControl(L.control.opacityControl({ position: "bottomright" }));

// * add full screen button
L.Control.FullscreenButton = L.Control.extend({
    onAdd: function (map) {
        let button = L.DomUtil.create("button", "bi-fullscreen control-square leaflet-bar leaflet-control leaflet-control-custom");
        button.title = "Toggle Fullscreen";

        button.onclick = function () {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        };

        L.DomEvent.on(button, "mouseenter", function () {
            setControlInteraction(true);
        });

        L.DomEvent.on(button, "mouseleave", function () {
            setControlInteraction(false)
        });

        return button;
    }
});

L.control.fullscreenButton = function (opts) {
    return new L.Control.FullscreenButton(opts);
};

map.addControl(L.control.fullscreenButton({ position: "bottomright" }));

// * add capture button
L.Control.mapCapture = L.Control.extend({
    onAdd: function (map) {
        let button = L.DomUtil.create("button", "bi-camera control-square leaflet-bar leaflet-control leaflet-control-custom");
        button.title = "Capture Screen";

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
            setTimeout(triggerClick, 50);

            setTimeout(capture, 100);
        };

        L.DomEvent.on(button, "mouseenter", function () {
            setControlInteraction(true);
        });

        L.DomEvent.on(button, "mouseleave", function () {
            setControlInteraction(false)
        });

        return button;
    }
});

L.control.mapCapture = function (opts) {
    return new L.Control.mapCapture(opts);
};

map.addControl(L.control.mapCapture({ position: "topleft" }));

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

// * add square button
L.Control.squareWindow = L.Control.extend({
    onAdd: function (map) {
        let button = L.DomUtil.create("button", "bi-window control-square leaflet-bar leaflet-control leaflet-control-custom");
        button.title = "Capture Screen";

        button.onclick = async function () {
            window.open(window.location, 'myWindow', 'width=1000,height=1000,menubar=no,toolbar=no,location=no,scrollbars=no,status=no,resizable=no');
        };

        L.DomEvent.on(button, "mouseenter", function () {
            setControlInteraction(true);
        });

        L.DomEvent.on(button, "mouseleave", function () {
            setControlInteraction(false);
        });

        return button;
    }
});

L.control.squareWindow = function (opts) {
    return new L.Control.squareWindow(opts);
};

map.addControl(L.control.squareWindow({ position: "bottomright" }));

// * Add table display panel
L.Control.chartPanel = L.Control.extend({
    onAdd: function (map) {
        let chartContainer = L.DomUtil.create("div", "chart-panel dis-none");
        chartContainer.id = "information-panel";

        let closeButton = L.DomUtil.create("button", "close-button", chartContainer);
        closeButton.innerHTML = "✖";
        closeButton.title = "Close Panel";

        closeButton.onclick = function () {
            chartContainer.classList.add('dis-none');
        };

        L.DomEvent.on(closeButton, "mouseenter", function () {
            setControlInteraction(true);
        });

        L.DomEvent.on(closeButton, "mouseleave", function () {
            setControlInteraction(false)
        });

        let chart = L.DomUtil.create("div", "leaflet-control-layers-scrollbar chart-info");
        chart.id = "information-chart";

        chartContainer.appendChild(chart);

        let colorPickerContainer = L.DomUtil.create("div", "color-picker-container");
        colorPickerContainer.innerHTML = "<label>Color:</label> <div id='color-picker'></div>";
        chartContainer.appendChild(colorPickerContainer);


        L.DomEvent.on(chartContainer, "mouseenter", function () {
            map.scrollWheelZoom.disable();
            setControlInteraction(true);
        });

        L.DomEvent.on(chartContainer, "mouseleave", function () {
            map.scrollWheelZoom.enable();
            setControlInteraction(false);
        });

        return chartContainer;
    }
});

L.control.chartPanel = function (opts) {
    return new L.Control.chartPanel(opts);
};

map.addControl(L.control.chartPanel({ position: "topleft" }));

// * color change
const pickr = Pickr.create({
    el: "#color-picker",
    theme: "nano",
    default: "#ff0000",
    components: {
        preview: true,
        opacity: true,
        hue: true,
        interaction: {
            save: true
        }
    }
});

let selectedFeature = null;

pickr.on("change", (color) => {
    if (selectedFeature) {
        let selectedColor = color.toHEXA().toString();
        selectedFeature.setStyle({
            fillColor: selectedColor
        });
        document.querySelector('.pcr-save').click()
    }
});

// * markers on user clicks

function setControlInteraction(value) {
    isInteractingWithControl = value;
}

map.on('click', function (e) {
    if (!isInteractingWithControl) {
        const marker = L.marker(e.latlng).addTo(map);
        markers.push(marker);

        marker.on('click', function () {
            map.removeLayer(marker);
            markers = markers.filter(m => m !== marker);
        });
    }
});