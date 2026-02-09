import { openPanel } from "./panel.js";

//initializing the interactive map leaflet
var map = L.map("cheese-world-map")

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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
                .bindTooltip(cheese.name + " (" + cheese.origin + ")");

            marker.on('click', () => {
                onCheeseClick(cheese);
                showImg(cheese.imgUrl);
            });
        });

        map.fitBounds(bounds);

    });

function onCheeseClick(chosenCheese) {
    console.log("clicked:", chosenCheese);
    const targetUrl = chosenCheese.Url;

    document.getElementById('name').textContent = "Name: " + chosenCheese.name;
    document.getElementById('origin').textContent = "Origin: " + chosenCheese.origin;
    document.getElementById('summary').textContent = "Made of: " + chosenCheese.milk;
    document.getElementById('rating').textContent = "Rating: " + chosenCheese.rating;
    document.getElementById('fun_fact').textContent = "Maybe you haven't known: " + chosenCheese.fun;
    document.getElementById('more').textContent = "Read more about " + chosenCheese.name;
    document.getElementById('more').setAttribute('href', targetUrl);

    openPanel();
}

//get the modal window
var panel = document.getElementById("cheeseSidePanel");

var img = document.getElementById("showimg");
var panelImg = document.getElementById("img");

img.onclick = function showImg(imgUrl) {
    panel.style.display = "block";
    panelImg.src = this.src.replace("/images/cheese.png", imgUrl); //imgUrl should be in json object
}

//get the <span> element that closes the modal 
var closePanel = document.getElementsByClassName("close")[0];

//when user clicks on <span> x or modal background -> close modal 
closePanel.onlick = function closeImg() {
    panel.style.display = "none";
}

modal.onclick = function clickModal(event) {
    if (event.target === modal) {
        panel.style.display = "none";
    }
}




    