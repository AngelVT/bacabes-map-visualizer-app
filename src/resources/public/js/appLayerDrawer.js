var overlays = {}

async function drawLayer(layerFile, styleFile, mainField, type, layerName) {
    try {
        let response = await fetch(`/public/geojsons/${layerFile}`);
        let layer = await response.json();
        let styles = await loadStyles(styleFile, mainField);

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
                        weight: 0.5
                    };
                    return L.circleMarker(latlng, style);
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

async function loadStyles(styleFile) {
    try {
        let response = await fetch(`/public/geojsons/${styleFile}`);
        let styleSheet = await response.json();
        let styles = {};

        for (const rule of styleSheet.rules) {
            styles[rule.name] = {
                color: rule.symbolizers[0].strokeColor || rule.symbolizers[0].outlineColor,
                fillColor: rule.symbolizers[0].color,
                fillOpacity: rule.symbolizers[0].opacity || 1,
                weight: rule.symbolizers[0].outlineWidth || rule.symbolizers[0].strokeWidth || .5,
                radius: rule.symbolizers[0].size
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

    for (const key in styles) {
        let symbol = document.createElement('p');
        let square = document.createElement('span');
        let legend = document.createElement('span');

        square.setAttribute('class', 'symbol-square');
        square.style.border = `1px solid ${styles[key].color}`;

        if (styles[key].fillColor.startsWith('#')) {
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
        console.info('Loaded layer:', layer.layer_name);

        await drawLayer(
            layer.layer_filename,
            layer.layer_styles_filename,
            layer.layer_field,
            layer.layer_type,
            layer.layer_name
        );
    }

    const layerControls = L.control.layers(overlays, null, { collapsed: false }).addTo(map);

    
    layerControls.getContainer().querySelector('section').classList.add('layer-container');

    let layerLabel = layerControls.getContainer().querySelector('section').firstChild.querySelector('label');

    layerLabel.click();
}

loadLayers();