// Unterschleißheim - Bus Stations Map
// Mapper: Rahimeh Gharibpour

//----------------------------------------
// Part 1: Create the Map
//----------------------------------------
var map = L.map('map', {
    center: [48.2728, 11.5682], // initial center
    zoom: 13
});

//----------------------------------------
// Part 2: Base Maps
//----------------------------------------

// OpenStreetMap DE
var osmDE = L.tileLayer('https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png', {
    minZoom: 12,
    maxZoom: 17,
    attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);

// Thunderforest Cycle (requires API key if online)
var cycleMap = L.tileLayer('https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png', {
    minZoom: 12,
    maxZoom: 17,
    attribution: 'Tiles from Thunderforest'
});

// Group base maps
var baseMaps = {
    "OpenStreetMap DE": osmDE,
    "Thunderforest Cycle": cycleMap
};

//----------------------------------------
// Part 3: Bus Stops Layer
//----------------------------------------

// Bus stop icon
var busStopIcon = L.icon({
    iconUrl: 'images/bus-stop.png', // must exist locally
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

// GeoJSON style (optional)
var busStopGeoJSONStyle = {
    color: "#ff0000",
    weight: 2,
    opacity: 1
};

// Create GeoJSON layer using bus_stops variable (from bus_stops.js)
var busStopsLayer = L.geoJson(bus_stops, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: busStopIcon });
    },
    style: busStopGeoJSONStyle,
    onEachFeature: function (feature, layer) {
        layer.bindPopup('<strong>' + feature.properties.NAME + '</strong>');
    }
}).addTo(map);

// Overlay maps
var overlayMaps = {
    "Bus Stops": busStopsLayer
};

// Layers control
L.control.layers(baseMaps, overlayMaps).addTo(map);

//----------------------------------------
// Part 4: Map Elements
//----------------------------------------

// Scale bar
L.control.scale({ imperial: false, metric: true, position: 'bottomright' }).addTo(map);

// Legend
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML += '<h4>Legend</h4>';
    div.innerHTML += '<img src="images/bus-stop.png" style="width:25px; vertical-align:middle;"> Bus Stop<br>';
    return div;
};
legend.addTo(map);

//----------------------------------------
// Part 5: Map Interactions
//----------------------------------------

// Click popup
map.on('click', function (e) {
    L.popup()
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
});

// Fit map to bus stops
var bounds = busStopsLayer.getBounds();
map.fitBounds(bounds);

// Fly to a specific bus stop
function flyToBusStop(busStopName) {
    var selectedBusStop = bus_stops.features.find(function (stop) {
        return stop.properties.NAME === busStopName;
    });

    if (selectedBusStop) {
        var coords = selectedBusStop.geometry.coordinates; // [lng, lat]
        map.flyTo([coords[1], coords[0]], 17); // [lat, lng] for Leaflet
    }
}

// Fly to "Unterschleißheim Ost" on load
flyToBusStop("Unterschleißheim Ost");
