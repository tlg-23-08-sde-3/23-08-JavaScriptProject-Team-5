// Reference to the "Resume Game" button and initial setup
const resumeGameButton = document.getElementById("resume-game");
resumeGameButton.classList.add("btn");
resumeGameButton.style.display = "none";

// Check if there's a saved game to decide whether to display the "Resume Game" button
displayResumeButtonIfGameExists();

// Function to check if there's a saved game for the given user
async function checkForSavedGame(userId) {
    try {
        const response = await fetch(`${API_URL}/api/game/load/${userId}`);
        if (response.ok) {
            const gameState = await response.json();
            return !!gameState; // Convert gameState to boolean: true if exists, false otherwise
        }
        return false;
    } catch (error) {
        console.log("Error checking for saved game:", error);
        return false;
    }
}

// Function to display the "Resume Game" button if a saved game exists
async function displayResumeButtonIfGameExists() {
    const user = await getCurrentUser();
    if (!user) {
        console.log("No user found.");
        return;
    }

    const hasSavedGame = await checkForSavedGame(user._id);
    resumeGameButton.style.display = hasSavedGame ? "block" : "none";
}

// Event listener to resume the saved game when the "Resume Game" button is clicked
resumeGameButton.addEventListener("click", async function () {
    // Hide the main menu
    const mainMenu = document.querySelector(".game_menu");
    mainMenu.style.display = "none";

    // Load the saved game state and resume the game
    await loadGameState();

    // Display the game page
    document.getElementById("game-page").style.display = "flex";
});

// Animate the buttons on the menu
animateButtons();

// Event listener for the "New Game" button to start a new game
const newGameButton = document.getElementById("new-game");
newGameButton.addEventListener("click", function () {
    // Hide the main menu
    const mainMenu = document.querySelector(".game_menu");
    mainMenu.style.display = "none";

    // Display the difficulty options for the new game
    document.getElementById("game_menu_difficulty").style.display = "flex";
    const difficultyOptions = document.getElementById("difficulty-options");
    difficultyOptions.style.display = "block";
});

// Event listener for the "Score Board" button to view scores
const scoreButton = document.getElementById("score-board");
scoreButton.addEventListener("click", function () {
    // Hide the main menu
    const mainMenu = document.querySelector(".game_menu");
    mainMenu.style.display = "none";

    // Render the scoreboard
    renderScoreboard();
});

// Event listener for selecting the game difficulty
const difficultyButtons = document.getElementById("difficulty-buttons");
difficultyButtons.addEventListener("click", function (event) {
    if (
        event.target.id === "easy" ||
        event.target.id === "medium" ||
        event.target.id === "hard"
    ) {
        // Extract the selected difficulty
        var selectedDifficulty = event.target.id;

        // Hide the difficulty options
        difficultyButtons.style.display = "none";

        // Display the search criteria input for the game
        const searchCriteria = document.getElementById("search-criteria");
        searchCriteria.style.display = "block";

        // Define the event handler for the "Search" button
        function searchButtonClickHandler() {
            document.getElementById("game_menu_difficulty").style.display =
                "none";
            document.getElementById("game-page").style.display = "flex";

            // Extract the search criteria provided by the user
            const searchInput = document.getElementById("search-input").value;

            // Dispatch a custom event to start the game with the selected criteria
            const searchEvent = new CustomEvent("startGame", {
                detail: { searchInput, selectedDifficulty },
            });
            document.dispatchEvent(searchEvent);

            // Log the game start details
            if (searchInput) {
                console.log(
                    `Starting the game with difficulty: ${selectedDifficulty}`
                );
                console.log(`Image search criteria: ${searchInput}`);
            } else {
                console.log(
                    `Starting the game with difficulty: ${selectedDifficulty}`
                );
            }

            // Cleanup: remove the event listener after it's executed
            searchButton.removeEventListener("click", searchButtonClickHandler);
        }

        // Attach the event handler to the "Search" button
        const searchButton = document.getElementById("search-button");
        searchButton.addEventListener("click", searchButtonClickHandler);
    }
});

// Event listener for the "Credits" button to view game credits
const creditsButton = document.getElementById("credits-button");
creditsButton.addEventListener("click", function () {
    // Hide the main menu
    const mainMenu = document.querySelector(".game_menu");
    mainMenu.style.display = "none";

    // Display the credits
    showCredits();
});

// Function to animate the buttons using TweenMax
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

// Function to populate the scoreboard with scores
async function populateScoreboard() {
    try {
        const scores = await fetchScores();
        clearScoreboard();
        appendScoresToScoreboard(scores);
    } catch (error) {
        console.error("Error populating the scoreboard:", error);
    }
}

// Function to fetch all scores from the server
async function fetchScores() {
    const response = await fetch(`${API_URL}/api/scores/all`);
    if (!response.ok) {
        throw new Error("Failed to fetch scores");
    }
    return await response.json();
}

// Function to clear the scoreboard of any existing scores
function clearScoreboard() {
    const scoreboardBody = document.getElementById("scoreboardBody");
    while (scoreboardBody.firstChild) {
        scoreboardBody.removeChild(scoreboardBody.firstChild);
    }
}

// Function to append scores to the scoreboard
function appendScoresToScoreboard(scores) {
    const scoreboardBody = document.getElementById("scoreboardBody");
    scores.forEach((score, index) => {
        const row = createScoreRow(score, index);
        scoreboardBody.appendChild(row);
    });
}

// Function to create a table row for a score
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

// Function to display the credits section
function showCredits() {
    const creditsMain = createCreditsContainer();
    document.body.appendChild(creditsMain);
}

// Function to create the credits container
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

// Function to create a list of developers for the credits section
function createDevelopersList(developers) {
    const developersList = createElement("ul", ["developers-list"]);
    developers.forEach((developer) => {
        const developerItem = createElement("li", [], developer);
        developersList.appendChild(developerItem);
    });
    return developersList;
}

// Function to create the "Back to Menu" button in the credits section
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

// Utility function to toggle the display of an element
function toggleDisplay(selector, displayValue) {
    document.querySelector(selector).style.display = displayValue;
}

// Utility function to create an HTML element with optional classes and text content
function createElement(tag, classes = [], textContent = "") {
    const element = document.createElement(tag);
    element.classList.add(...classes);
    if (textContent) {
        element.textContent = textContent;
    }
    return element;
}

// Function to render the scoreboard UI
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
        displayResumeButtonIfGameExists();
        animateButtons();
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

// Function to fetch the current user's profile
async function getCurrentUser() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const response = await fetch(`${API_URL}/api/users/profile`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": token,
            },
        });

        if (response.status !== 200) return null;

        return await response.json();
    } catch (error) {
        console.log("Error fetching user profile:", error);
        return null;
    }
}
