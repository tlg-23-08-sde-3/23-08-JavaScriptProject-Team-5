// Animation for the buttons
animateButtons();

// Add a click event listener to the "New Game" button
const newGameButton = document.getElementById("new-game");
newGameButton.addEventListener("click", function () {
    // Hide the main menu
    const mainMenu = document.querySelector(".game_menu");
    mainMenu.style.display = "none";

    // Show the difficulty options
    document.getElementById("game_menu_difficulty").style.display = "flex";
    const difficultyOptions = document.getElementById("difficulty-options");
    difficultyOptions.style.display = "block";
});

const scoreButton = document.getElementById("score-board");
scoreButton.addEventListener("click", function () {
    // Hide the main menu
    const mainMenu = document.querySelector(".game_menu");
    mainMenu.style.display = "none";

    renderScoreboard();
});

// Add click event listeners to the difficulty options
const difficultyButtons = document.getElementById("difficulty-buttons");
difficultyButtons.addEventListener("click", function (event) {
    if (
        event.target.id === "easy" ||
        event.target.id === "medium" ||
        event.target.id === "hard"
    ) {
        // Get the selected difficulty
        var selectedDifficulty = event.target.id;

        // Hide the difficulty buttons
        difficultyButtons.style.display = "none";

        // Show the search criteria input box
        const searchCriteria = document.getElementById("search-criteria");
        searchCriteria.style.display = "block";

        // Define the event handler function for the Search button
        function searchButtonClickHandler() {
            document.getElementById("game_menu_difficulty").style.display =
                "none";
            document.getElementById("game-page").style.display = "flex";
            // Get the search criteria entered by the user
            const searchInput = document.getElementById("search-input").value;

            const searchEvent = new CustomEvent("startGame", {
                detail: { searchInput, selectedDifficulty },
            });
            document.dispatchEvent(searchEvent);

            if (searchInput) {
                // User provided search criteria
                console.log(
                    `Starting the game with difficulty: ${selectedDifficulty}`
                );
                console.log(`Image search criteria: ${searchInput}`);
            } else {
                // User didn't enter any search criteria
                console.log(
                    `Starting the game with difficulty: ${selectedDifficulty}`
                );
            }

            // Remove the event listener after it has been executed
            searchButton.removeEventListener("click", searchButtonClickHandler);
        }

        // Add the event listener to the "Search" button
        const searchButton = document.getElementById("search-button");
        searchButton.addEventListener("click", searchButtonClickHandler);
    }
});

// Add a click event listener to the "Credits" button
const creditsButton = document.getElementById("credits-button");
creditsButton.addEventListener("click", function () {
    // Hide the main menu
    const mainMenu = document.querySelector(".game_menu");
    mainMenu.style.display = "none";

    // Show the credits
    showCredits();
});

function animateButtons() {
    TweenMax.staggerFrom(
        ".btn",
        2,
        {
            scale: 0.5,
            opacity: 0,
            delay: 0.5,
            ease: Elastic.easeOut,
            force3D: true,
        },
        0.2
    );
}

async function populateScoreboard() {
    try {
        const scores = await fetchScores();
        clearScoreboard();
        appendScoresToScoreboard(scores);
    } catch (error) {
        console.error("Error populating the scoreboard:", error);
    }
}

async function fetchScores() {
    const response = await fetch("/api/scores/all");
    if (!response.ok) {
        throw new Error("Failed to fetch scores");
    }
    return await response.json();
}

function clearScoreboard() {
    const scoreboardBody = document.getElementById("scoreboardBody");
    while (scoreboardBody.firstChild) {
        scoreboardBody.removeChild(scoreboardBody.firstChild);
    }
}

function appendScoresToScoreboard(scores) {
    const scoreboardBody = document.getElementById("scoreboardBody");
    scores.forEach((score, index) => {
        const row = createScoreRow(score, index);
        scoreboardBody.appendChild(row);
    });
}

function createScoreRow(score, index) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <th scope="row">${index + 1}</th>
        <td>${score.username}</td>
        <td>${score.score}</td>
        <td>${score.difficulty}</td>
        <td>${score.time}</td>
    `;
    return row;
}

function showCredits() {
    const creditsMain = createCreditsContainer();
    document.body.appendChild(creditsMain);
}

function createCreditsContainer() {
    const creditsMain = createElement("div", ["credits-container"]);
    const creditsContainer = createElement("section", ["credits-section"]);
    const creditsTitle = createElement("h1", ["credits-title"], "CREDITS");
    const developersList = createDevelopersList([
        "Alberto Leon",
        "Jojo George Mattam",
    ]);
    const backButton = createCreditsBackButton(creditsMain);

    creditsContainer.appendChild(creditsTitle);
    creditsContainer.appendChild(developersList);
    creditsContainer.appendChild(backButton);
    creditsMain.appendChild(creditsContainer);

    return creditsMain;
}

function createDevelopersList(developers) {
    const developersList = createElement("ul", ["developers-list"]);
    developers.forEach((developer) => {
        const developerItem = createElement("li", [], developer);
        developersList.appendChild(developerItem);
    });
    return developersList;
}

function createCreditsBackButton(creditsMain) {
    const backButton = createElement(
        "button",
        ["credits-button"],
        "Back to Menu"
    );
    backButton.addEventListener("click", function () {
        creditsMain.remove();
        toggleDisplay(".game_menu", "flex");
    });
    return backButton;
}

function toggleDisplay(selector, displayValue) {
    document.querySelector(selector).style.display = displayValue;
}

function createElement(tag, classes = [], textContent = "") {
    const element = document.createElement(tag);
    element.classList.add(...classes);
    if (textContent) {
        element.textContent = textContent;
    }
    return element;
}

// Create a function to render the scoreboard
function renderScoreboard() {
    // Create a container element for the scoreboard
    const scoreboardMain = document.createElement("div");
    scoreboardMain.classList.add("scoreboard-body");

    const scoreboardContainer = document.createElement("section");
    scoreboardContainer.classList.add("scoreboard-container");

    // Create the scoreboard title
    const scoreboardTitle = document.createElement("h1");
    scoreboardTitle.classList.add("scoreboard-title");
    scoreboardTitle.textContent = "SCOREBOARD";

    // Create the "Back" button
    const backButton = document.createElement("button");
    backButton.classList.add("scoreboard-button");
    backButton.textContent = "Back to Menu";
    backButton.addEventListener("click", function () {
        const gameOverMessage = document.querySelector(".end-message");
        // Remove the scoreboard and show the main menu
        scoreboardMain.remove();
        if (gameOverMessage) {
            gameOverMessage.remove();
        }
        document.querySelector(".game_menu").style.display = "flex";
    });

    // Create the scrollable table container
    const scrollableTable = document.createElement("div");
    scrollableTable.classList.add("scoreboard-scrollable-table");

    // Create the scoreboard table
    const scoreboardTable = document.createElement("table");
    scoreboardTable.classList.add("scoreboard-table");

    // Add the table header row
    const tableHeader = document.createElement("thead");
    tableHeader.innerHTML = `
    <tr>
        <th style="color: #977331;">#</th>
        <th style="color: #977331;">Player</th>
        <th style="color: #977331;">Score</th>
        <th style="color: #977331;">Difficulty</th>
        <th style="color: #977331;">Time</th>
    </tr>
`;

    // Create the table body where scores will be populated
    const tableBody = document.createElement("tbody");
    tableBody.setAttribute("id", "scoreboardBody");

    // Append everything together
    scoreboardTable.appendChild(tableHeader);
    scoreboardTable.appendChild(tableBody);
    scrollableTable.appendChild(scoreboardTable);
    scoreboardContainer.appendChild(scoreboardTitle);
    scoreboardContainer.appendChild(scrollableTable);
    scoreboardContainer.appendChild(backButton);
    scoreboardMain.appendChild(scoreboardContainer);

    // Append the scoreboard container to the body of the document
    document.body.appendChild(scoreboardMain);
    populateScoreboard();
}
