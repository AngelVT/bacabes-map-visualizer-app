var overlays = {}

async function drawLayer(identifier, mainField, type, layerName) {
    try {
        let response = await fetch(`/public/geojsons/${identifier}_layer.geojson`);
        let layer = await response.json();
        let styles = await loadStyles(identifier, mainField);

        let geoJsonLayer;

        if (type === "polygon") {
            geoJsonLayer = L.geoJson(layer, {
                style: feature => {
                    let style = styles[feature.properties[mainField]] || {
                        color: "#000000",
                        fillColor: "url(#missing)",
                        fillOpacity: 1,
                        weight: 0.5
                    };
                    return style;
                },
                onEachFeature: (feature, layer) => {
                    layer.bindPopup(generateTable(feature.properties));
                }
            });
        }

        if (type === "point") {
            geoJsonLayer = L.geoJson(layer, {
                pointToLayer: (feature, latlng) => {
                    let style = styles[feature.properties[mainField]] || {
                        color: "#000000",
                        fillColor: "url(#missing)",
                        fillOpacity: 1,
                        radius: 8,
                        weight: 0.5,
                        iconURL: '/public/img/markers/default-marker.svg'
                    };

                    let icon = L.icon({
                        iconUrl: style.iconURL,
                        iconSize: [22, 22],
                        iconAnchor: [11, 11],
                        popupAnchor: [0, -11]
                    });

                    if (style.iconURL.includes('circle-')) {
                        return L.circleMarker(latlng, style);
                    }
                    return L.marker(latlng, { icon });
                },
                onEachFeature: (feature, layer) => {
                    layer.bindPopup(generateTable(feature.properties));
                }
            });
        }

        geoJsonLayer.addTo(map);
        overlays[loadSymbols(layerName, styles)] = geoJsonLayer;

        return geoJsonLayer;
    } catch (error) {
        console.error("Error loading GeoJSON:", error);
        alert("Ocurrió un error al cargar el archivo GeoJSON");
    }
}

async function loadStyles(identifier) {
    try {
        let response = await fetch(`/public/geojsons/${identifier}_styles.json`);
        let styleSheet = await response.json();
        let styles = {};

        for (const rule of styleSheet.rules) {
            styles[rule.name] = {
                color: rule.symbolizers[0].strokeColor || rule.symbolizers[0].outlineColor,
                fillColor: rule.symbolizers[0].color,
                fillOpacity: rule.symbolizers[0].opacity || 1,
                weight: rule.symbolizers[0].outlineWidth || rule.symbolizers[0].strokeWidth || .5,
                radius: 9,
                iconURL: rule.symbolizers[0].spriteName ? `/public/img/markers/${rule.symbolizers[0].spriteName}.svg` : `/public/img/markers/default-marker.svg`
            };
        }
        return styles;
    } catch (error) {
        console.error("Error loading styles:", error);
        alert("Ocurrió un error al cargar los símbolos y estilos");
        return {};
    }
}

function generateTable(properties) {
    let propertiesChart = document.createElement('div');
    propertiesChart.setAttribute('class', 'popup-chart');
    for (const key in properties) {
        let prop = document.createElement('p')
        prop.innerHTML = `<b>${key}:</b> ${properties[key]}`
        propertiesChart.appendChild(prop)
    }
    return propertiesChart;
}

function loadSymbols(layerName, styles) {
    let symbolContainer = document.createElement('div');
    symbolContainer.style.display = 'inline';

    let tittle = document.createElement('b');
    tittle.innerText = layerName;

    symbolContainer.appendChild(tittle);

    let symbols = document.createElement('div');
    symbols.setAttribute('class', 'symbol-list');

    for (const key in styles) {
        let symbol = document.createElement('p');
        let square = document.createElement('span');
        let legend = document.createElement('span');

        square.setAttribute('class', 'symbol-square');
        square.style.border = `1px solid ${styles[key].color}`;

        if (styles[key].iconURL && !styles[key].iconURL.includes('circle-')) {
            square.style.backgroundImage = `url(${styles[key].iconURL})`;
        } else if (styles[key].fillColor.startsWith('#')) {
            square.style.backgroundColor = styles[key].fillColor;
        } else if (styles[key].fillColor.startsWith('url')) {
            let str = styles[key].fillColor
            let matchingId = str.match(/\(#([^)]+)\)/);
            square.style.backgroundImage = `url(/public/img/patterns/${matchingId[1]}.svg)`;
        }

        legend.innerText = ` ${key}`;

        symbol.appendChild(square);
        symbol.appendChild(legend);

        symbols.appendChild(symbol)
    }

    symbolContainer.appendChild(symbols);

    return symbolContainer.outerHTML;
}

async function loadLayers() {
    const res = await fetch('/api/layer', {
        method: 'GET',
        credentials: 'include'
    });

    const response = await res.json();

    if (!res.ok) {
        alert(response.msg)
        return
    }


    for (const layer of response.layers) {
        await drawLayer(
            layer.layer_identifier,
            layer.layer_field,
            layer.layer_type,
            layer.layer_name
        );

        console.info('Loaded layer:', layer.layer_name);
    }

    const layerControls = L.control.layers(null, overlays, { collapsed: false }).addTo(map);

    layerControls.getContainer().classList.add('layer-container');

    /*const layerLabels = layerControls.getContainer().querySelector('section').firstChild.querySelectorAll('label');

    for (const [index ,label] of layerLabels.entries()) {
        let input = label.querySelector('input');
        input.setAttribute('id', response.layers[index].layer_identifier);
        input.addEventListener('focus', (event) => {
            let otherSymbolList = document.querySelectorAll('.symbol-list');
            for (const list of otherSymbolList) {
                list.classList.add('dis-none')
            }
            label.querySelector('.symbol-list').classList.remove('dis-none');
            let newUrl = new URL(window.location);
            newUrl.searchParams.set("layer", event.target.id);
            window.history.pushState({}, "", newUrl);
        });
    }

    let layerLabel = layerControls.getContainer().querySelector('section').firstChild.querySelector('label');

    layerLabel.click();*/
}

loadLayers();