require('dotenv').config();

// constants for the API keys
const ts = '1';
const publicAPIKey = process.env.PUBLIC_API_KEY;
const privateAPIKey = process.env.PRIVATE_API_KEY;
const hash = CryptoJS.MD5(ts + privateAPIKey + publicAPIKey).toString();
const url = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${publicAPIKey}&hash=${hash}`;

// to fetch the character list from the API it requires:
// ts: a timestamp (an arbirary string, usually a number)
// apikey: the public key
// hash: a hash of ts + privatekey + publickey

// DOM elements
const characterList = document.querySelector('#search-characterListDropdown');
const comicList = document.querySelector('#search-comicListDropdown');

const characterSearch = document.querySelector('#search-characterList');
const comicSearch = document.querySelector('#search-comicList');

let characters = [];
let comics = [];

window.onload = () => {
    getCharacters();
    getComics();
};

// adding event listeners
characterSearch.addEventListener('input', () => {
    const query = characterSearch.value.toLowerCase();
    filteredSearch(query, 'character');
});

characterList.addEventListener('change', () => {
    const characterId = characterList.value;
    const characterImg = document.createElement('img');
    characterImg.src = characters.find(character => character.id == characterId).thumbnail.path + '.' + characters.find(character => character.id == characterId).thumbnail.extension;
    characterImg.alt = characters.find(character => character.id == characterId).name;
    characterImg.style.width = '200px';
    characterImg.style.height = '200px';
});

comicSearch.addEventListener('input', () => {
    const query = comicSearch.value.toLowerCase();
    filteredSearch(query, 'comic');
})

// functions
function filteredSearch(query, type){
    let filteredData = [];
    // filtering the list based on the type
    // type can either be character, comic, creator, event, series or story
    if(type == 'character'){
        filteredData = characters.filter(character => character.name.toLowerCase().includes(query));
        updateDropdown(filteredData, 'character');
    }else if(type == 'comic'){
        filteredData = comics.filter(comic => comic.title.toLowerCase().includes(query));
        updateDropdown(filteredData, 'comic');
    }
}

function updateDropdown(filteredData, type){
    let dropDown;
    if(type == 'character'){
        dropDown = characterList;
    }else if(type == 'comic'){
        dropDown = comicList;
    }

    // clear the dropdown first
    dropDown.innerHTML = '';

    // now we populate the dropdown with the filtered data
    filteredData.forEach(data => {
        const option = document.createElement('option');
        option.value = data.id;
        option.textContent = data.name;
        dropDown.appendChild(option);
    });
}

// function to fetch and populate the lists
async function getCharacters() {
    console.log('Fetching characters...');

    // clears the dropdown before starting to fetch
    characterList.innerHTML = '';

    // in order to fetch ALL the characters we need to set an offset of 0
    let offset = 0; // starting point for the first request, it will update as we go
    let requests = [];
    const limit = 20; // number of characters per request
    const totalCharacters = 1500; // total characters in database
    const pagesToFetch = Math.ceil(totalCharacters / limit);

    for(let page = 0; page < pagesToFetch; page++){
        requests.push(fetch(url+`&offset=${offset}&limit=${limit}`).then(response => response.json()));
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

    console.log('Finished fetching characters...');
}

async function getComics(){
    console.log('Fetching comics...');
    // fetch the comic list from the API
    const response = await fetch(url);
    const data = await response.json();
    // populate the comic List with the comic names
    comics = data.data.results;

    comics.forEach(comic => {
        const option = document.createElement('option');
        option.value = comic.id;
        option.textContent = comic.title;
        comicList.appendChild(option);
    });

    console.log('Finished fetching comics...');
}

