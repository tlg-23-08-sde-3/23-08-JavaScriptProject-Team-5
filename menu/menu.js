// Animation for the buttons
TweenMax.staggerFrom(".btn", 2, {
  scale: 0.5,
  opacity: 0,
  delay: 0.5,
  ease: Elastic.easeOut,
  force3D: true
}, 0.2);

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

// Add click event listeners to the difficulty options
const difficultyButtons = document.getElementById("difficulty-buttons");
difficultyButtons.addEventListener("click", function (event) {
  if (event.target.id === "easy" || event.target.id === "medium" || event.target.id === "hard") {
    // Get the selected difficulty
    var selectedDifficulty = event.target.id;

    // Hide the difficulty buttons
    difficultyButtons.style.display = "none";

    // Show the search criteria input box
    const searchCriteria = document.getElementById("search-criteria");
    searchCriteria.style.display = "block";

    // Add click event listener to the search button
    const searchButton = document.getElementById("search-button");
    searchButton.addEventListener("click", function () {
      document.getElementById("game_menu_difficulty").style.display = "none";
      document.getElementById("game-page").style.display = "flex";
      // Get the search criteria entered by the user
      const searchInput = document.getElementById("search-input").value;

      const searchEvent = new CustomEvent("startGame", { detail: { searchInput, selectedDifficulty } });
      document.dispatchEvent(searchEvent);

      if (searchInput) {
        // User provided search criteria
        console.log(`Starting the game with difficulty: ${selectedDifficulty}`);
        console.log(`Image search criteria: ${searchInput}`);
      } else {
        // User didn't enter any search criteria
        console.log(`Starting the game with difficulty: ${selectedDifficulty}`);
      }
    });
  }
});





