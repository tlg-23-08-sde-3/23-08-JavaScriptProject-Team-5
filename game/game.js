// Define the game difficulties and their respective settings.
const difficulties = {
  easy: { rows: 2, cols: 2, totalCards: 4, duration: 2 * 60 },
  medium: { rows: 4, cols: 5, totalCards: 20, duration: 4 * 60 },
  hard: { rows: 5, cols: 6, totalCards: 30, duration: 6 * 60 },
};

let currentDifficulty;
let remainingTime;
let images = [];

// Set the game difficulty to "easy" by default.
// setDifficulty("hard");

// Function to set the game difficulty.
function setDifficulty(difficulty) {
  if (difficulties[difficulty]) {
    currentDifficulty = difficulties[difficulty];
    remainingTime = currentDifficulty.duration;
  } else {
    console.error("Invalid difficulty level provided.");
  }
}

// Function to adjust the game grid columns based on the viewport width.
function adjustGridColumns() {
  const gameBoard = document.getElementById("gameBoard");
  const viewportWidth = window.innerWidth;

  if (currentDifficulty) {
    if (viewportWidth <= 680) {
      gameBoard.style.gridTemplateColumns = `repeat(2, 1fr)`;
    } else if (viewportWidth <= 900) {
      gameBoard.style.gridTemplateColumns = `repeat(3, 1fr)`;
    } else {
      // Calculate the number of columns based on the current difficulty
      const numColumns = currentDifficulty.cols;
      gameBoard.style.gridTemplateColumns = `repeat(${numColumns}, 1fr)`;
    }
  }
}

// Event listener to run the game logic once the DOM is fully loaded.
document.addEventListener("DOMContentLoaded", function () {
  const gameBoard = document.getElementById("gameBoard");
  const timerElement = document.getElementById("timer");

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
      gameEnd();
    }
  }

  // Event listener to run the game logic when the form is submitted.
  document.addEventListener("startGame", function (event) {
    const { searchInput, selectedDifficulty } = event.detail;
    console.log("Received search input in game-page.js:", searchInput);
    console.log(
      "Received difficulty level in game-page.js:",
      selectedDifficulty
    );

    // You can now use the search input to initialize the game
    setDifficulty(selectedDifficulty);
    adjustGridColumns();
    initializeGame(searchInput);
  });

  // Start the game timer.
  const timerInterval = setInterval(updateTimer, 1000);
});

// Function to fetch a random image from the server based on user prompt
async function fetchRandomImage(userPrompt) {
  try {
    const response = await fetch("/api/pixabay/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: userPrompt }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }

    const data = await response.json();

    return data.imageUrl;
  } catch (error) {
    console.error("Error fetching image:", error);
    return "";
  }
}

async function initializeGame(userPrompt) {
  const cardCount = currentDifficulty.totalCards;
  const uniqueImageCount = cardCount / 2;

  try {
    // Fetch unique images for the game
    const uniqueImages = await fetchUniqueImages(userPrompt, uniqueImageCount);

    if (!uniqueImages || uniqueImages.length < uniqueImageCount) {
      console.error("Not enough unique images fetched.");
      return;
    }

    // Duplicate and shuffle the unique image URLs
    const shuffledImages = shuffleArray([...uniqueImages, ...uniqueImages]);

    // Generate the game cards with shuffled images
    for (let i = 0; i < cardCount; i++) {
      const card = document.createElement("div");
      card.classList.add("card");
      card.dataset.imageIndex = i;

      const cardFront = document.createElement("div");
      cardFront.classList.add("card-back");
      cardFront.style.backgroundImage = `url('${shuffledImages[i]}')`;

      const cardBack = document.createElement("div");
      cardBack.classList.add("card-front");
      cardBack.style.backgroundImage =
        "url('https://cdn.pixabay.com/photo/2015/04/23/17/41/javascript-736401_960_720.png')"; // Add a placeholder image URL here

      card.appendChild(cardFront);
      card.appendChild(cardBack);

      card.addEventListener("click", handleCardClick);
      gameBoard.appendChild(card);
    }
  } catch (error) {
    console.error("Error initializing the game:", error);
  }
}

async function fetchUniqueImages(userPrompt, count) {
  const uniqueImages = [];
  while (uniqueImages.length < count) {
    const imageUrl = await fetchRandomImage(userPrompt);
    if (!uniqueImages.includes(imageUrl)) {
      uniqueImages.push(imageUrl);
    }
  }
  return uniqueImages;
}

// Shuffle the array randomly
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function handleCardClick(event) {
  const card = event.currentTarget;

  if (
    !card.classList.contains("flipped") &&
    document.querySelectorAll(".card.flipped").length < 2
  ) {
    card.classList.add("flipped");
    console.log("Card flipped:", card);
  }

  if (document.querySelectorAll(".card.flipped").length === 2) {
    setTimeout(compareCards, 1000);
  }
}

// Compare two flipped cards to check if they match
function compareCards() {
  const flippedCards = document.querySelectorAll(".card.flipped");
  if (flippedCards.length === 2) {
    const [card1, card2] = flippedCards;
    const image1 = card1.querySelector(".card-back").style.backgroundImage;
    const image2 = card2.querySelector(".card-back").style.backgroundImage;
    console.log("Card images:", image1, image2);

    if (image1 === image2) {
      // Cards match, they stay flipped
      card1.classList.remove("flipped");
      card1.classList.add("matched");
      console.log(card1.classList);
      card2.classList.remove("flipped");
      card2.classList.add("matched");
      console.log(card2.classList);
    } else {
      // Cards don't match, flip them back.
      setTimeout(() => {
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
      }, 500); // Adjust the time (in milliseconds) to show unmatched cards.
    }

    checkGameEnd();
  }
}

// Implement game ending logic when all card pairs are matched
function checkGameEnd() {
  const matchedCards = document.querySelectorAll(".card.matched");
  if (matchedCards.length === currentDifficulty.totalCards) {
    // Game end logic
    console.log("Game end");
    gameEnd();
  }
}

function gameEnd() {
  // Calculate the points scored based on the remaining time
  const points = remainingTime * 100;

  // Display the points earned to the player
  const gameContainer = document.getElementById("game-container");

  // Create a message to inform the player about the game end
  const endMessage = document.createElement("div");
  endMessage.classList.add("end-message");
  endMessage.textContent = `Game Over! You scored ${points} points.`;

  // Hide the game page, game board, and timer element
  document.getElementById("game-page").style.display = "none";
  document.getElementById("gameBoard").style.display = "none";
  document.getElementById("timer").style.display = "none";

  // Append the end message and then render the scoreboard
  gameContainer.appendChild(endMessage);
  renderScoreboard();
}
