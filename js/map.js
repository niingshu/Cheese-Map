import { openPanel } from "./panel.js";
import { closePanel } from "./panel.js";

//initializing the interactive map leaflet
var map = L.map("cheese-world-map")

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);


//making cheese marker
var cheeseSpot = L.icon({
    iconUrl: 'images/cheese.png',
    shadowUrl: null,

    iconSize:       [17, 37], //size of the icon
    shadowSize:     [30, 60], //size of the shadow
    iconAnchor:     [9, 29], //point of the icon which correspond to marker's location 
    shadowAnchor:   [4, 62], //same for shadow
    popupAnchor:    [-3, -15] // point from which popup should open relative to the iconAnchor
});

var highlightCheese = L.icon({
    iconUrl: 'images/chosenCheese.png',
    shadowUrl: null,

    iconSize:       [15*1.5, 30*1.5], 
    shadowSize:     [30, 60], 
    iconAnchor:     [13*1.5, 25*1.5], 
    shadowAnchor:   [4, 62], 
    popupAnchor:    [-3*1.5, -20*1.5]
});

var selectedCheese = null; //needs update selected cheese

var bounds = []

fetch("data/cheeses.json")
    .then(res => res.json())
    .then(data => {
        data.forEach(cheese => {
            bounds.push([cheese.lat, cheese.lng]);

            var marker = L.marker([cheese.lat, cheese.lng], {icon: cheeseSpot})
                .addTo(map)
                .bindTooltip(cheese.name + " (" + cheese.origin + ")");

            marker.on('click', () => {
                onCheeseClick(cheese, marker);
            });
        });

        map.fitBounds(bounds);

    });

function onCheeseClick(chosenCheese, marker) {
    var clickedCheese = marker;

    if (selectedCheese && selectedCheese !== clickedCheese) {
        selectedCheese.setIcon(cheeseSpot);
    }

    //set clicked marker's icon to highlight
    clickedCheese.setIcon(highlightCheese);

    //update the selected marker reference
    selectedCheese = clickedCheese;
    
    const targetUrl = chosenCheese.Url;

    document.getElementById('name').textContent = chosenCheese.name;

    //show image
    document.getElementById('cheeseImage').src = chosenCheese.img;

    document.getElementById('origin').textContent = "Origin: " + chosenCheese.origin;
    document.getElementById('rating').textContent = "Rating: " + chosenCheese.rating + "/5";
    document.getElementById('summary').textContent = "Made From: " + chosenCheese.content;
    document.getElementById('fun_fact').textContent = "Fun fact: " + chosenCheese.fun;
    document.getElementById('more').textContent = "Read more about " + chosenCheese.name;
    document.getElementById('more').setAttribute('href', targetUrl);

    openPanel();
}

//close the popup window
document.addEventListener('DOMContentLoaded', (event) => {
    //get the button element by its id 
    const closeBtn = document.getElementById('closebtn');

    //add a click event listener
    if (closeBtn) {
        closeBtn.addEventListener('click', onCheeseClose);
    }
});

function onCheeseClose() {
    if (selectedCheese) {
        selectedCheese.setIcon(cheeseSpot);
        selectedCheese = null;
    }
    closePanel();
}

map.on('click', () => {
    if (selectedCheese) {
        selectedCheese.setIcon(cheeseSpot);
        selectedCheese = null;
    }
    closePanel();
});







    