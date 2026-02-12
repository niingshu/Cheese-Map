document.addEventListener('DOMContentLoaded', () => { //ensures the script runs
    const filterBtn = document.getElementById('filterBtn');
    const categoryFilter = document.getElementById('categoryFilter'); //category select
    const productContainer = document.getElementById('productContainer'); //datacontainer
    let cheesesDataStore = []; //keep all the fetched data from json 

    //fetch data from json 
    async function fetchCheesesData() {
        try {
            const response = await fetch('data/cheeses.json');
            cheesesDataStore = await response.json();
            renderItems(cheesesDataStore);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    }

    //render items in the document 
    function renderItems(items) {
        productContainer.innerHTML = ''; //clear previous items 
        if (items.length === 0) {
            productContainer.innerHTML = '<p>No items found.</p>';
            return;
        }

        items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');
            itemDiv.innerHTML = `<strong>${item.name}</strong> - Category: ${item.origin}`;
            //origin is currently provice + country -> should split these into 2
            productContainer.appendChild(itemDiv);
        });
    }

    //function to handle the filtering 
    function applyFilter() {
        const selectedCategory = categoryFilter.value; //category in this case is the origin(country)
        let filteredData = cheesesDataStore; //start with all data fetched from cheeses 

        if (selectedCategory !== 'all') {
            filteredData = cheesesDataStore.filter (item => item.origin === selectedCategory);
        }

        renderItems(filteredData);
    }

    //event listener for the filter button 
    filterBtn.addEventListener('click', applyFilter);

    //initialize by fetching the data when scip loads 
    fetchCheesesData();
})