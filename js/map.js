import { openPanel } from "./panel.js";

//initializing the interactive map leaflet
var map = L.map("cheese-world-map")

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//making cheese marker
var cheeseSpot = L.icon({
    iconUrl: 'images/cheese.png',
    shadowUrl: null,

    iconSize:       [17, 40], //size of the icon
    shadowSize:     [30, 60], //size of the shadow
    iconAnchor:     [9, 31], //point of the icon which correspond to marker's location 
    shadowAnchor:   [4, 62], //same for shadow
    popupAnchor:    [-3, -20] // point from which popup should open relative to the iconAnchor
});

var bounds = []

fetch("data/cheeses.json")
    .then(res => res.json())
    .then(data => {
        data.forEach(cheese => {
            bounds.push([cheese.lat, cheese.lng]);

            var marker = L.marker([cheese.lat, cheese.lng], {icon: cheeseSpot})
                .addTo(map)
                .bindTooltip(cheese.name + " (" + cheese.origin + ")")
                .bindPopup(`
                    <b>${cheese.name}</b><br>
                    Origin: ${cheese.origin}<br>
                    Rating: ${cheese.rating} <br>
                    Made From: ${cheese.milk} <br> 
                    More Information: <a href=${cheese.Url}> ${cheese.name}! </a>
                `);

            marker.on('click', () => {
                onCheeseClick(cheese);
            });
        });

        map.fitBounds(bounds);

    });

function onCheeseClick(chosenCheese) {
    console.log("clicked:", chosenCheese);
    const targetUrl = chosenCheese.Url;

    document.getElementById('name').textContent = chosenCheese.name;
    document.getElementById('origin').textContent = chosenCheese.origin;
    document.getElementById('summary').textContent = chosenCheese.milk;
    document.getElementById('more').textContent = "Read more about " + chosenCheese.name;
    document.getElementById('more').setAttribute('href', targetUrl);

    openPanel();
}




    