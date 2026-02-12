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

    iconSize:       [25, 37], //size of the icon
    shadowSize:     [30, 60], //size of the shadow
    iconAnchor:     [9, 29], //point of the icon which correspond to marker's location 
    shadowAnchor:   [4, 62], //same for shadow
    popupAnchor:    [-3, -15] // point from which popup should open relative to the iconAnchor
});

var highlightCheese = L.icon({
    iconUrl: 'images/chosenCheese.png',
    shadowUrl: null,

    iconSize:       [25*1.5, 30*1.5], 
    shadowSize:     [30, 60], 
    iconAnchor:     [15*1.5, 25*1.5], 
    shadowAnchor:   [4, 62], 
    popupAnchor:    [-3*1.5, -20*1.5]
});

var selectedMarker = null; //the marker that is selected
var selectedCheese = null; //the cheese that is selected
var cheesesMap = new Map(); //map the cheese.id with marker

var bounds = []

fetch("data/cheeses.json")
    .then(res => res.json())
    .then(data => {
        data.forEach(cheese => {
            bounds.push([cheese.lat, cheese.lng]);

            var marker = L.marker([cheese.lat, cheese.lng], {icon: cheeseSpot})
                .addTo(map)
                .bindTooltip(cheese.name + " (" + cheese.origin + ")");
            
            cheesesMap.set(cheese.id, marker); //add it into map for every cheese

            marker.on('click', () => {
                onCheeseClick(cheese, marker);
                //smooth animated pan and zoom
                map.flyTo(marker.getLatLng(), 6);
            });
        });

        map.fitBounds(bounds);

    });

function onCheeseClick(chosenCheese, marker) {
    var clickedMarker = marker;

    if (selectedMarker && selectedMarker !== clickedMarker) {
        selectedMarker.setIcon(cheeseSpot);
    }

    //set clicked marker's icon to highlight
    clickedMarker.setIcon(highlightCheese);

    //update the selected marker reference
    selectedMarker = clickedMarker;
    selectedCheese = chosenCheese
    
    cheesePanel(selectedCheese); //passing in the selected cheese
}

function cheesePanel(chosenCheese) {
    const targetUrl = chosenCheese.Url;
    //show image
    document.getElementById('cheeseImage').src = chosenCheese.img;

    document.getElementById('name').textContent = chosenCheese.name;

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
    if (selectedMarker) {
        selectedMarker.setIcon(cheeseSpot);
        selectedMarker = null;
        selectedCheese = null;
    }
    closePanel();
}

//reset marker icon and close popup panel when clicked on map
map.on('click', () => {
    if (selectedMarker) {
        selectedMarker.setIcon(cheeseSpot);
        selectedMarker = null;
        selectedCheese = null;
    }
    closePanel();
});

//fetch information of cheese from json to search bar 
let allData = []
const searchInput = document.getElementById('searchInput');
const resultsList = document.getElementById('resultList');

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim(); //.trim() removes extra spaces
    const query1 = searchInput.value; //case insensitive

    //clear result every time use types
    resultsList.innerHTML = ''; 

    if (query.length === 0) return;
    //preventing regex error
    const escapeQuery = query1.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    //makde regex gi for global and not case sensitice
    const regex = new RegExp(`(${escapeQuery})`, 'gi');

    //only run the filter if there is actual text in input 
    const filteredData = allData.filter(item => 
        item.name.toLowerCase().includes(query)
    );

    displayData(filteredData, regex);
});

//function to fetch json data
async function fetchCheesesData() {
    try {
        const response = await fetch('data/cheeses.json');
        allData = await response.json();
        //do not display all initial data (only show when user search)
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
}

//function to display data in the list 
function displayData(dataToDisplay, regex) {
    resultsList.innerHTML = '';

    dataToDisplay.forEach(item => {
        const li = document.createElement('li');
        //customize what to display from each JSON
        li.classList.add('result-item'); //for styling
        li.innerHTML = item.name; //not sure

        //replace the matching from input with the bold tag
        li.innerHTML = item.name.replace(regex,'<b>$1</b>');

        li.dataset.itemId = item.id; //because id was never declared 
        li.addEventListener('click', handleItemClick);
        li.addEventListener('click', () => {
            //clear the result list (ie. not making it = 'none') 
            resultsList.innerHTML = '';
            //clear the search input
            searchInput.value = '';
        })

        resultsList.appendChild(li);
    });
}

function handleItemClick(event) {
    const itemId = event.currentTarget.dataset.itemId; //cheeses in json needs id

    //find the corresponding object in original data 
    const searchedCheese = allData.find(item => item.id === parseInt(itemId));
    //create a map to map the cheese(using its id) to marker then choose it from there
    const searchedMarker = cheesesMap.get(parseInt(itemId));

    //display the panel
    onCheeseClick(searchedCheese, searchedMarker); //prase the chosen marker here
    map.flyTo(searchedMarker.getLatLng(), 5);
}

//initialize by fetching the data when scip loads 
fetchCheesesData();






    