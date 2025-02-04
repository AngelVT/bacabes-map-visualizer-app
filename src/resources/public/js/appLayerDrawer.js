async function drawLayer(layerFile, styleFile, mainField, type) {
    try {
        let response = await fetch(`/public/geojsons/${layerFile}`);
        let layer = await response.json();

        let styles = await loadStyles(styleFile, mainField);

        if (type === "polygon") {
            L.geoJson(layer, {
                style: feature => {
                    let style = styles[feature.properties.Densidad] || {
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
            }).addTo(map);
        }

        if (type === "point") {
            L.geoJson(layer, {
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
            }).addTo(map);
        }
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
    return propertiesChart
}

drawLayer("densidad.geojson", "densidad_styles.json", "Densidad", "polygon");