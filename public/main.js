// main JS file - Frontend logic

// DOM elements
const characterList = document.querySelector("#search-characterListDropdown");
const characterSearch = document.querySelector("#search-characterList");
const clearButton = document.getElementById("clear-button");

const comicsEl = document.getElementById("seeComics");
const seriesEl = document.getElementById("seeSeries");
const eventsEl = document.getElementById("seeEvents");

let characters = [];
let comics = [];
let series = [];
let events = [];

// fetching the characters on the window load
window.onload = () => {
  fetchData("Character");
};

// Search functionality for characters and comics
characterSearch.addEventListener("input", () => {
  const query = characterSearch.value.toLowerCase();
  filteredSearch(query, "Character");
});

// Function to clear everything
clearButton.addEventListener("click", () => {
    characterSearch.value = "";
    comicsEl.disabled = true;
    seriesEl.disabled = true;
    eventsEl.disabled = true;
    
  clearCharacterContent();
  clearDetails();
})

let lastSelectedCharID = null;

characterList.addEventListener("change", () => {
  comicsEl.disabled = false;
  seriesEl.disabled = false;
  eventsEl.disabled = false;

  const selectedCharacterName =
    characterList.options[characterList.selectedIndex].textContent;
  console.log("Character selected: " + selectedCharacterName);

  // Check if the selected character is already displayed, if it is, do nothing
  if (lastSelectedCharID === characterList.value) {
    console.log("Character already displayed, skipping fetch");
    return;
  }

  const characterId = characterList.value;

  lastSelectedCharID = characterId;

  // Clear existing character-related content
  clearCharacterContent();

  // clear existing comics, events, series content
  clearDetails();

  // add character content
  addCharacterContent();

  comicsEl.addEventListener("click", () => {
    console.log("Comics clicked");
    // we want to disable the comics button now because we are about to fetch the comics

    comicsEl.disabled = true;
    seriesEl.disabled = false;
    eventsEl.disabled = false;

    fetchData("Comic", characterId).then(() => {
      // Check if the existing ul exists and clear it, otherwise create a new one
      let ul = document.querySelector("#comics-list");
      if (!ul) {
        ul = document.createElement("ul");
        ul.id = "comics-list"; // Set an ID to target it later
        ul.style.display = "grid";
        ul.style.gridTemplateColumns = "repeat(auto-fit, minmax(200px, 1fr))"; // Dynamic grid columns
        ul.style.gap = "20px"; // Spacing between grid items
        ul.style.padding = "20px"; // Padding inside the list
        ul.style.margin = "20px"; // Margin between the list and other content
        ul.style.listStyleType = "none";
        ul.style.width = "calc(100% - 40px)"; // Make the width 100% minus the padding
        ul.style.boxSizing = "border-box";
        document.body.appendChild(ul);
      } else {
        ul.innerHTML = ""; // Clear existing comics if ul exists
      }

      comics.forEach((comic) => {
        const li = document.createElement("li");
        li.style.display = "flex";
        li.style.flexDirection = "column";
        li.style.alignItems = "center";
        li.style.background = "#fff";
        li.style.borderRadius = "8px";
        li.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
        li.style.padding = "10px";

        const comicImg = document.createElement("img");
        comicImg.src = `${comic.thumbnail.path}/portrait_uncanny.${comic.thumbnail.extension}`;
        comicImg.alt = comic.title;
        comicImg.style.width = "100%";
        comicImg.style.height = "auto";
        comicImg.style.borderRadius = "8px";
        comicImg.style.marginBottom = "10px";

        const title = document.createElement("p");
        title.textContent = comic.title;
        title.style.fontWeight = "bold";
        title.style.textAlign = "center";
        title.style.margin = "0";
        title.style.fontSize = "14px"; // Adjust the size of the title for better readability
        title.style.color = "#333"; // Set title color to dark for visibility

        li.appendChild(comicImg);
        li.appendChild(title);
        ul.appendChild(li);
      });
      console.log(`Comics data fetched for ${selectedCharacterName}`);
    });
  });

  seriesEl.addEventListener("click", () => {
    console.log("Series clicked");

    seriesEl.disabled = true;
    comicsEl.disabled = false;
    eventsEl.disabled = false;

    fetchData("Series", characterId).then(() => {
        // check if the existing ul exists and clear it, otherwise create a new one
        let ul = document.querySelector("#series-list");
        if (!ul) {
          ul = document.createElement("ul");
          ul.id = "series-list"; // Set an ID to target it later
          ul.style.display = "grid";
          ul.style.gridTemplateColumns = "repeat(auto-fit, minmax(200px, 1fr))"; // Dynamic grid columns
          ul.style.gap = "20px"; // Spacing between grid items
          ul.style.padding = "20px"; // Padding inside the list
          ul.style.margin = "20px"; // Margin between the list and other content
          ul.style.listStyleType = "none";
          ul.style.width = "calc(100% - 40px)"; // Make the width 100% minus the padding
          ul.style.boxSizing = "border-box";
          document.body.appendChild(ul);
        } else {
          ul.innerHTML = ""; // Clear existing series if ul exists
        }

        series.forEach((series) => {
          const li = document.createElement("li");
          li.style.display = "flex";
          li.style.flexDirection = "column";
          li.style.alignItems = "center";
          li.style.background = "#fff";
          li.style.borderRadius = "8px";
          li.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
          li.style.padding = "10px";

          const seriesImg = document.createElement("img");
          seriesImg.src = `${series.thumbnail.path}/portrait_uncanny.${series.thumbnail.extension}`;
          seriesImg.alt = series.title;
          seriesImg.style.width = "100%";
          seriesImg.style.height = "auto";
          seriesImg.style.borderRadius = "8px";
          seriesImg.style.marginBottom = "10px";

          const title = document.createElement("p");
          title.textContent = series.title;
          title.style.fontWeight = "bold";
          title.style.textAlign = "center";
          title.style.margin = "0";
          title.style.fontSize = "14px"; // Adjust the size of the title for better readability
          title.style.color = "#333"; // Set title color to dark for visibility

          li.appendChild(seriesImg);
          li.appendChild(title);
          ul.appendChild(li);
        });
      console.log(`Series data fetched for ${selectedCharacterName}`);
    });
  });

  eventsEl.addEventListener("click", () => {
    console.log("Events clicked");

    eventsEl.disabled = true;
    comicsEl.disabled = false;
    seriesEl.disabled = false;

    fetchData("Event", characterId).then(() => {
        // check if the existing ul exists and clear it, otherwise create a new one
        let ul = document.querySelector("#events-list");
        if (!ul) {
          ul = document.createElement("ul");
          ul.id = "events-list"; // Set an ID to target it later
          ul.style.display = "grid";
          ul.style.gridTemplateColumns = "repeat(auto-fit, minmax(200px, 1fr))"; // Dynamic grid columns
          ul.style.gap = "20px"; // Spacing between grid items
          ul.style.padding = "20px"; // Padding inside the list
          ul.style.margin = "20px"; // Margin between the list and other content
          ul.style.listStyleType = "none";
          ul.style.width = "calc(100% - 40px)"; // Make the width 100% minus the padding
          ul.style.boxSizing = "border-box";
          document.body.appendChild(ul);
        } else {
          ul.innerHTML = ""; // Clear existing events if ul exists
        }

        events.forEach((event) => {
          const li = document.createElement("li");
          li.style.display = "flex";
          li.style.flexDirection = "column";
          li.style.alignItems = "center";
          li.style.background = "#fff";
          li.style.borderRadius = "8px";
          li.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
          li.style.padding = "10px";

          const eventImg = document.createElement("img");
          eventImg.src = `${event.thumbnail.path}/portrait_uncanny.${event.thumbnail.extension}`;
          eventImg.alt = event.title;
          eventImg.style.width = "100%";
          eventImg.style.height = "auto";
          eventImg.style.borderRadius = "8px";
          eventImg.style.marginBottom = "10px";

          const title = document.createElement("p");
          title.textContent = event.title;
          title.style.fontWeight = "bold";
          title.style.textAlign = "center";
          title.style.margin = "0";
          title.style.fontSize = "14px"; // Adjust the size of the title for better readability
          title.style.color = "#333"; // Set title color to dark for visibility

          li.appendChild(eventImg);
          li.appendChild(title);
          ul.appendChild(li);
        });
      console.log(`Events data fetched for ${selectedCharacterName}`);
    });
  });
});

// function to clear comics, series, events content
function clearDetails(){
  const existingComics = document.querySelector("#comics-list");
  if (existingComics) {
    existingComics.remove();
  }

  const existingSeries = document.querySelector("#series-list");
  if(existingSeries){
    existingSeries.remove();
  }

  const existingEvents = document.querySelector("#events-list");
  if(existingEvents){
    existingEvents.remove();
  }
}

// Function to clear only the character-related content (image, description, comics)
function clearCharacterContent() {
  // Remove existing character image (target only image element that is not related to search or dropdown)
  const existingImg = document.querySelector(
    "img:not([id='search-characterList'], [id='search-characterListDropdown'])"
  );
  if (existingImg) {
    existingImg.remove();
  }

  // Remove existing description box (target only div elements related to description)
  const existingDescriptionBox = document.querySelector(
    "div:not([id='comics-list'], .search-area, .toggle-area)"
  ); // Target div that isn't related to specific content like comics or search area
  if (existingDescriptionBox) {
    existingDescriptionBox.remove();
  }
}

function addCharacterContent() {
  const selectedCharacterName =
    characterList.options[characterList.selectedIndex].textContent;
  console.log(`Character selected: ${selectedCharacterName}`);
  const characterId = characterList.value;
  const character = characters.find(
    (character) => character.id === parseInt(characterId, 10)
  );

  if (!character) {
    console.error("Character not found");
    return;
  }

  // Create and append new image
  const characterImg = document.createElement("img");
  characterImg.src = `${character.thumbnail.path}.${character.thumbnail.extension}`;
  characterImg.alt = character.name;
  characterImg.style.width = "200px";
  characterImg.style.height = "200px";
  characterImg.style.marginTop = "20px";
  document.body.appendChild(characterImg);

  // Create a box for the description of the character
  const descriptionBox = document.createElement("div");
  descriptionBox.style.display = "flex";
  descriptionBox.style.flexDirection = "column";
  descriptionBox.style.alignItems = "center";
  descriptionBox.style.marginTop = "20px";
  descriptionBox.style.marginBottom = "20px";
  descriptionBox.style.padding = "20px";
  descriptionBox.style.background = "#fff";
  descriptionBox.style.borderRadius = "8px";
  descriptionBox.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
  document.body.appendChild(descriptionBox);

  const characterDescription = document.createElement("p");
  characterDescription.textContent =
    character.description || "Description not available";
  characterDescription.style.fontSize = "14px";
  characterDescription.style.color = "#333";
  characterDescription.style.textAlign = "center";
  descriptionBox.appendChild(characterDescription);

  console.log("Image updated:", characterImg.src);

  console.log(`Now fetching relevant comics for ${selectedCharacterName}`);
}

// Function to filter and update dropdown based on search input
function filteredSearch(query, type) {
  let filteredData = [];
  if (type === "Character") {
    filteredData = characters.filter((character) =>
      character.name.toLowerCase().includes(query)
    );
    updateDropdown(filteredData, "Character");
  } else if (type === "Comic") {
    filteredData = comics.filter((comic) =>
      comic.title.toLowerCase().includes(query)
    );
    updateDropdown(filteredData, "Comic");
  }
}

// Function to update dropdown with filtered data
function updateDropdown(filteredData, type) {
  let dropDown;
  console.log(`Type: ${type}`);
  if (type === "Character") {
    dropDown = characterList;
  }

  // Clear the dropdown first
  dropDown.innerHTML = "";

  // Populate the dropdown with filtered data
  filteredData.forEach((data) => {
    const option = document.createElement("option");
    option.value = data.id;
    option.textContent = data.name || data.title;
    dropDown.appendChild(option);
  });
}

// Fetch data based on category
async function fetchData(category, characterID = null) {
  try {
    let response;
    // = await fetch(`http://localhost:3000/get${category}s`);
    // console.log('Response: ', response);
    // if(!response.ok) {
    //     throw new Error('Network response was not ok');
    // }

    let data;

    if (category === "Character") {
      response = await fetch(`http://localhost:3000/get${category}s`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      data = await response.json();
      characters = data.data.results;
      getCharacters();
      updateDropdown(characters, "Character");
    } else if (category == "Comic") {
      response = await fetch(
        `http://localhost:3000/getComics/get${category}sbyCharacter?characterId=${characterList.value}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      data = await response.json();
      comics = data.data.results;
    }else if (category == "Series") {
      response = await fetch(
        `http://localhost:3000/getSeries/get${category}byCharacter?characterId=${characterList.value}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      data = await response.json();
      series = data.data.results;
    }else if (category == "Event") {
      response = await fetch(
        `http://localhost:3000/getEvents/get${category}sbyCharacter?characterId=${characterList.value}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      data = await response.json();
      events = data.data.results;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function getCharacters() {
  characters = [];

  console.log("Entering getCharacters...");
  characterList.innerHTML = ""; // Clear dropdown

  let offset = 0;
  let requests = [];
  let limit = 100;
  const totalCharacters = 1540;
  const pagesToFetch = Math.ceil(totalCharacters / limit);

  for (let page = 0; page < pagesToFetch; page++) {
    requests.push(
      fetch(
        `http://localhost:3000/getCharacters?offset=${offset}&limit=${limit}`
      ).then((response) => response.json())
    );
    offset += limit;
  }

  const results = await Promise.all(requests);

  results.forEach((result) => {
    characters = characters.concat(result.data.results);
  });

  console.log(`Characters: ${characters}`);

  const fragment = document.createDocumentFragment();
  characters.forEach((character) => {
    const option = document.createElement("option");
    option.value = character.id;
    option.textContent = character.name;
    fragment.appendChild(option);
  });

  characterList.appendChild(fragment);
  console.log("Leaving getCharacters...");
}