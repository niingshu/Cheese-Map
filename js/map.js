//initializing the interactive map leaflet
var map = L.map("cheese-world-map")

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

var bounds = []

fetch("data/cheeses.json")
    .then(res => res.json())
    .then(data => {
        data.forEach(cheese => {
            bounds.push([cheese.lat, cheese.lng]);

            L.marker([cheese.lat, cheese.lng])
                .addTo(map)
                .bindTooltip(cheese.name + " (" + cheese.origin + ")")
                .bindPopup(`
                    <b>${cheese.name}</b><br>
                    Origin: ${cheese.origin}<br>
                    Milk: ${cheese.milk} <br> 
                    More Information: <a href=${cheese.Url}> ${cheese.name}! </a>
                `);
        });

        map.fitBounds(bounds);

    });

    