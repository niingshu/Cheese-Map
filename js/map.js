//initializing the interactive map leaflet
var map = L.map("cheese-world-map").setView ([51.505, -0.09], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//making cheese marker
var cheeseSpot = L.icon({
    iconUrl: 'images/pin.png',
    shadowUrl: 'images/pin.png',

    iconSize:       [45, 95], //size of the icon
    shadowSize:     [30, 60], //size of the shadow
    iconAnchor:     [22, 94], //point of the icon which correspond to marker's location 
    shadowAnchor:   [4, 62], //same for shadow
    popupAnchor:    [-3, -76] // point from which popup should open relative to the iconAnchor
});

//making marker
L.marker([51.5, -0.09])
    .addTo(map)
    .bindPopup("Cheese")
    .openPopup();