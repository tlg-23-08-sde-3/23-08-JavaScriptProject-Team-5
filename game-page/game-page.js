// Define the game difficulties and their properties.
const difficulties = {
    easy: { rows: 4, cols: 4, totalCards: 16, duration: 2 * 60 },
    medium: { rows: 4, cols: 5, totalCards: 20, duration: 4 * 60 },
    hard: { rows: 5, cols: 6, totalCards: 30, duration: 6 * 60 },
};

// Variables to store the current game difficulty and remaining time.
let currentDifficulty;
let remainingTime;

// Set the game difficulty to "hard" by default.
setDifficulty("hard");

// Function to set the game difficulty.
function setDifficulty(difficulty) {
    if (difficulties[difficulty]) {
        currentDifficulty = difficulties[difficulty];
        remainingTime = currentDifficulty.duration;
    } else {
        console.error("Invalid difficulty level provided.");
    }
}

// Event listener to execute code once the DOM is fully loaded.
document.addEventListener("DOMContentLoaded", function () {
    const gameBoard = document.getElementById("gameBoard");
    const timerElement = document.getElementById("timer");

    // Adjust the grid columns based on the viewport width.
    adjustGridColumns();

    // Function to update the game timer.
    function updateTimer() {
        remainingTime--;
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;

        timerElement.textContent =
            "Remaining Time: " +
            (minutes < 10 ? "0" + minutes : minutes) +
            ":" +
            (seconds < 10 ? "0" + seconds : seconds);

        // Stop the timer when the time runs out.
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            // gameEnd(); // Placeholder for a function to end the game.
        }
    }

    // Start the timer to update every second.
    const timerInterval = setInterval(updateTimer, 1000);

    // Generate the game cards dynamically based on the current difficulty.
    for (let i = 0; i < currentDifficulty.totalCards; i++) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.value = i % (currentDifficulty.totalCards / 2);
        card.addEventListener("click", handleCardClick);
        gameBoard.appendChild(card);
    }
});

// Function to adjust the grid columns of the game board based on the viewport width.
function adjustGridColumns() {
    const gameBoard = document.getElementById("gameBoard");
    const viewportWidth = window.innerWidth;

    if (viewportWidth <= 680) {
        gameBoard.style.gridTemplateColumns = `repeat(2, 1fr)`;
    } else if (viewportWidth <= 900) {
        gameBoard.style.gridTemplateColumns = `repeat(3, 1fr)`;
    } else {
        gameBoard.style.gridTemplateColumns = `repeat(${currentDifficulty.cols}, 1fr)`;
    }
}

// Call the adjustGridColumns function immediately.
adjustGridColumns();

// Add an event listener to adjust the grid columns when the window is resized.
window.addEventListener("resize", adjustGridColumns);

// Placeholder function for handling card clicks.
function handleCardClick(event) {
    const card = event.currentTarget;
    // flipCard(); // Placeholder for a function to flip the card.
}
