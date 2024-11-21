// main JS file - Frontend logic

// DOM elements
const characterList = document.querySelector('#search-characterListDropdown');
const comicList = document.querySelector('#search-comicListDropdown');

const characterSearch = document.querySelector('#search-characterList');
const comicSearch = document.querySelector('#search-comicList');

const categorySelect = document.querySelector('#categorySelect');

let characters = [];
let comics = [];

// Fetching data based on category selection
categorySelect.addEventListener('change', () => {
    const currentCategory = categorySelect.value;
    console.log(`Fetching data for category: ${currentCategory}`);
    fetchData(currentCategory); // Fetch data based on selected category
    console.log("HERE");
});

// Search functionality for characters and comics
characterSearch.addEventListener('input', () => {
    const query = characterSearch.value.toLowerCase();
    filteredSearch(query, 'character');
});

comicSearch.addEventListener('input', () => {
    const query = comicSearch.value.toLowerCase();
    filteredSearch(query, 'comic');
});

characterList.addEventListener('change', () => {
    console.log("Character selected: " + characterList.name);

    const exisitngImg = document.querySelector('img');
    if (exisitngImg) {
        exisitngImg.remove();
    }

    const characterId = characterList.value;
    const characterImg = document.createElement('img');
    const character = characters.find(character => character.id == characterId);
    if (character) {
        characterImg.src = `${character.thumbnail.path}.${character.thumbnail.extension}`;
        characterImg.alt = character.name;
        characterImg.style.width = '200px';
        characterImg.style.height = '200px';
        document.body.appendChild(characterImg); // Append the image to the page
    }
});

// Function to filter and update dropdown based on search input
function filteredSearch(query, type) {
    let filteredData = [];
    if (type === 'character') {
        filteredData = characters.filter(character => character.name.toLowerCase().includes(query));
        updateDropdown(filteredData, 'character');
    } else if (type === 'comic') {
        filteredData = comics.filter(comic => comic.title.toLowerCase().includes(query));
        updateDropdown(filteredData, 'comic');
    }
}

// Function to update dropdown with filtered data
function updateDropdown(filteredData, type) {
    let dropDown;
    if (type === 'character') {
        dropDown = characterList;
    } else if (type === 'comic') {
        dropDown = comicList;
    }

    // Clear the dropdown first
    dropDown.innerHTML = '';

    // Populate the dropdown with filtered data
    filteredData.forEach(data => {
        const option = document.createElement('option');
        option.value = data.id;
        option.textContent = data.name || data.title;
        dropDown.appendChild(option);
    });
}

// Fetch data based on category
async function fetchData(category) {
    try {
        console.log("MAKE IT HERE?");
        const response = await fetch(`http://localhost:3000/api/getMarvelData?category=${category}`);
        console.log('Response: ', response);
        if(!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (category === 'character') {
            characters = data.data.results;
            getCharacters();
            updateDropdown(characters, 'character');
        } else if (category === 'comic') {
            comics = data.data.results;
            updateDropdown(comics, 'comic');
            console.log('Finished fetching comics...');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function getCharacters() {
    console.log('Entering get Characters...');

    // clears the dropdown before starting to fetch
    characterList.innerHTML = '';

    // in order to fetch ALL the characters we need to set an offset of 0
    let offset = 0; // starting point for the first request, it will update as we go
    let requests = [];
    const limit = 20; // number of characters per request
    const totalCharacters = 1500; // total characters in database
    const pagesToFetch = Math.ceil(totalCharacters / limit);

    for(let page = 0; page < pagesToFetch; page++){
        requests.push(fetch("http://localhost:3000/api/getMarvelData?category=character"+`&offset=${offset}&limit=${limit}`).then(response => response.json()));
        offset += limit;
    }

    // waiting for all the requests to finish
    const results = await Promise.all(requests);

    // collect all character data
    results.forEach(result => {
        characters = characters.concat(result.data.results);
    });

    // this is an attempt to make the API more efficient
    // by only fetching the data we need
    const fragment = document.createDocumentFragment(); // create a fragment to hold the data
    characters.forEach(character => {
        const option = document.createElement('option');
        option.value = character.id;
        option.textContent = character.name;
        fragment.appendChild(option);
    });

    characterList.appendChild(fragment);

    console.log('Leaving getCharacters...');
}

function toggleSelectors(category){
    if (category === 'character') {
        characterList.style.display = 'block';
        characterSearch.style.display = 'block';
        comicList.style.display = 'none';
        comicSearch.style.display = 'none';
    } else if (category === 'comic') {
        characterList.style.display = 'none';
        characterSearch.style.display = 'none';
        comicList.style.display = 'block';
        comicSearch.style.display = 'block';
    }
}

toggleSelectors(categorySelect.value);