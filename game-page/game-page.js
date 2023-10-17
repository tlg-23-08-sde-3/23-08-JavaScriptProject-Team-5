// Define the game difficulties and their respective settings.
const difficulties = {
    easy: { rows: 4, cols: 4, totalCards: 16, duration: 2 * 60 },
    medium: { rows: 4, cols: 5, totalCards: 20, duration: 4 * 60 },
    hard: { rows: 5, cols: 6, totalCards: 30, duration: 6 * 60 },
};

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

// Event listener to run the game logic once the DOM is fully loaded.
document.addEventListener("DOMContentLoaded", function () {
    const gameBoard = document.getElementById("gameBoard");
    const timerElement = document.getElementById("timer");

    // Adjust the game grid based on the current viewport width.
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

        // Stop the timer when the remaining time reaches zero.
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            // gameEnd(); // Placeholder for game end logic.
        }
    }

    // Start the game timer.
    const timerInterval = setInterval(updateTimer, 1000);

    // Generate the game cards based on the current difficulty.
    for (let i = 0; i < currentDifficulty.totalCards; i++) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.value = i % (currentDifficulty.totalCards / 2);

        const cardFront = document.createElement("div");
        cardFront.classList.add("card-front");
        cardFront.style.backgroundImage =
            "url('https://placehold.co/150x150/green/white')"; // Set the front image

        const cardBack = document.createElement("div");
        cardBack.classList.add("card-back");
        cardBack.style.backgroundImage =
            "url('https://placehold.co/150x150/orange/white')"; // Set the back image

        card.appendChild(cardFront);
        card.appendChild(cardBack);

        // Add an event listener to handle card flipping.
        card.addEventListener("click", handleCardClick);
        gameBoard.appendChild(card);
    }
});

// Function to adjust the game grid columns based on the viewport width.
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

// Adjust the game grid columns when the window is resized.
adjustGridColumns();
window.addEventListener("resize", adjustGridColumns);

// Function to handle card flipping.
function handleCardClick(event) {
    const card = event.currentTarget;
    card.classList.toggle("flipped");
    //compareCards(); // Placeholder for card comparison logic.
}
