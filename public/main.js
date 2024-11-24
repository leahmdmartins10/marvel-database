// main JS file - Frontend logic

// DOM elements
const characterList = document.querySelector('#search-characterListDropdown');
const characterSearch = document.querySelector('#search-characterList');

let characters = [];
let comics = [];

// fetching the characters on the window load
window.onload = () => {
    fetchData('Character');
}

// Search functionality for characters and comics
characterSearch.addEventListener('input', () => {
    const query = characterSearch.value.toLowerCase();
    filteredSearch(query, 'Character');
});

characterList.addEventListener('selected', () => {
    const selectedCharacterName = characterList.options[characterList.selectedIndex].textContent;
    console.log("Character selected: " + selectedCharacterName);

    const existingImg = document.querySelector('img');
    if (existingImg) {
        existingImg.remove();
    }

    const characterId = characterList.value;
    const character = characters.find(character => character.id === characterId);
    if (character) {
        const characterImg = document.createElement('img');
        characterImg.src = `${character.thumbnail.path}.${character.thumbnail.extension}`;
        characterImg.alt = character.name;
        characterImg.style.width = '200px';
        characterImg.style.height = '200px';
        characterImg.style.marginTop = '20px';
        document.body.appendChild(characterImg);
    }

    console.log(`Now fetching relevant comics for ${selectedCharacterName}`);

    // Clear existing comics list
    const existingUl = document.querySelector('ul');
    if (existingUl) {
        existingUl.remove();
    }

    fetchData('Comic');
    console.log(`Comics data fetched for ${selectedCharacterName}`);

    const ul = document.createElement('ul');
    document.body.appendChild(ul);
    comics.forEach(comic => {
        const li = document.createElement('li');
        li.textContent = comic.title;
        ul.appendChild(li);
    });
});

// Function to filter and update dropdown based on search input
function filteredSearch(query, type) {
    let filteredData = [];
    if (type === 'Character') {
        filteredData = characters.filter(character => character.name.toLowerCase().includes(query));
        updateDropdown(filteredData, 'Character');
    } else if (type === 'Comic') {
        filteredData = comics.filter(comic => comic.title.toLowerCase().includes(query));
        updateDropdown(filteredData, 'Comic');
    }
}

// Function to update dropdown with filtered data
function updateDropdown(filteredData, type) {
    let dropDown;
    console.log(`Type: ${type}`);
    if (type === 'Character') {
        dropDown = characterList;
    } else if (type === 'Comic') {
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
        let response; 
        // = await fetch(`http://localhost:3000/get${category}s`);
        // console.log('Response: ', response);
        // if(!response.ok) {
        //     throw new Error('Network response was not ok');
        // }

        let data; 

        if (category === 'Character') {
            response = await fetch(`http://localhost:3000/get${category}s`);
            if(!response.ok) {
                throw new Error('Network response was not ok');
            }
            data = await response.json();
            characters = data.data.results;
            getCharacters();
            updateDropdown(characters, 'Character');
        } else if(category == 'Comic'){
            response = await fetch(`http://localhost:3000/getComics/get${category}sbyCharacter?characterId=${characterList.value}`);
            if(!response.ok) {
                throw new Error('Network response was not ok');
            }
            data = await response.json();
            comics = data.data.results;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function getCharacters() {
    if (characters.length > 100) return; // If already populated, skip

    console.log('Entering getCharacters...');
    characterList.innerHTML = ''; // Clear dropdown

    let offset = 0;
    let requests = [];
    let limit = 100;
    const totalCharacters = 1540;
    const pagesToFetch = Math.ceil(totalCharacters / limit);

    for (let page = 0; page < pagesToFetch; page++) {
        requests.push(fetch(`http://localhost:3000/getCharacters?offset=${offset}&limit=${limit}`).then(response => response.json()));
        offset += limit;
    }

    const results = await Promise.all(requests);

    results.forEach(result => {
        characters = characters.concat(result.data.results);
    });

    console.log(`Characters: ${characters}`);

    const fragment = document.createDocumentFragment();
    characters.forEach(character => {
        const option = document.createElement('option');
        option.value = character.id;
        option.textContent = character.name;
        fragment.appendChild(option);
    });

    characterList.appendChild(fragment);
    console.log('Leaving getCharacters...');
}
