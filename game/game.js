const difficulties = {
    easy: { rows: 4, cols: 4, totalCards: 16, duration: 60 },
    medium: { rows: 4, cols: 5, totalCards: 20, duration: 75 },
    hard: { rows: 5, cols: 6, totalCards: 30, duration: 113 },
};

let currentDifficulty;
let savedDifficulty;
let remainingTime;
let timerInterval;
let isPaused = false;

document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("startGame", function (event) {
        const { searchInput, selectedDifficulty } = event.detail;
        setDifficulty(selectedDifficulty);
        savedDifficulty = selectedDifficulty;
        adjustGridColumns();
        initializeGame(searchInput);
    });
    const pauseButton = document.getElementById("pauseButton");
    pauseButton.addEventListener("click", togglePause);
});

function setDifficulty(difficulty) {
    savedDifficulty = difficulty;
    if (difficulties[difficulty]) {
        currentDifficulty = difficulties[difficulty];
        remainingTime = currentDifficulty.duration;
    } else {
        console.error("Invalid difficulty level provided.");
    }
}

function adjustGridColumns() {
    const gameBoard = document.getElementById("gameBoard");
    const viewportWidth = window.innerWidth;

    if (!currentDifficulty) return;

    let numColumns = currentDifficulty.cols;
    if (viewportWidth <= 680) numColumns = 2;
    else if (viewportWidth <= 900) numColumns = 3;

    gameBoard.style.gridTemplateColumns = `repeat(${numColumns}, 1fr)`;
}

function createGameTimer() {
    const timerContainer = document.getElementById("timer-container");
    if (!timerContainer) {
        console.error("Timer container not found.");
        return;
    }

    const timerElement = document.createElement("div");
    timerElement.id = "timer";
    timerElement.textContent = "Remaining Time: 00:00";
    timerContainer.appendChild(timerElement);

    timerInterval = setInterval(updateTimer, 1000);
}

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(timerInterval);
        document.getElementById("pauseButton").innerText = "Resume Game";
        saveGameState();
    } else {
        timerInterval = setInterval(updateTimer, 1000);
        document.getElementById("pauseButton").innerText = "Pause Game";
    }
}

async function saveGameState() {
    const user = await getCurrentUser();
    if (!user) {
        console.error("No user found. Cannot save game state.");
        return;
    }

    const cards = Array.from(document.querySelectorAll(".card"));

    const flippedOrMatchedCardsIndices = cards
        .filter(
            (card) =>
                card.classList.contains("flipped") ||
                card.classList.contains("matched")
        )
        .map((card) => parseInt(card.dataset.imageIndex));

    console.log(
        "Flipped or Matched Cards Indices:",
        flippedOrMatchedCardsIndices
    );

    const gameState = {
        userId: user._id,
        remainingTime: remainingTime,
        flippedCards: flippedOrMatchedCardsIndices,
        cardOrder: cards.map((card) => ({
            imageIndex: card.dataset.imageIndex,
            imageUrl: card.querySelector(".card-back").style.backgroundImage,
        })),
        difficulty: savedDifficulty,
    };
    console.log(gameState);

    try {
        const response = await fetch("/api/game/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(gameState),
        });

        if (!response.ok) {
            throw new Error("Failed to save game state to backend");
        }
    } catch (error) {
        console.error(error);
    }
}

async function loadGameState() {
    console.log("start");
    const user = await getCurrentUser();
    if (!user) {
        console.error("No user found. Cannot load game state.");
        return;
    }

    const userId = user._id;
    try {
        const response = await fetch(`/api/game/load/${userId}`);
        if (!response.ok) {
            throw new Error("Failed to load game state from backend");
        }

        const savedState = await response.json();
        setDifficulty(savedState.difficulty);
        remainingTime = savedState.remainingTime;
        const gameBoard = document.getElementById("gameBoard");

        // Clear the current game board
        while (gameBoard.firstChild) {
            gameBoard.removeChild(gameBoard.firstChild);
        }

        // Restore card order and flipped state
        savedState.cardOrder.forEach((cardData) => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.dataset.imageIndex = cardData.imageIndex;

            const cardFront = document.createElement("div");
            cardFront.classList.add("card-back");
            cardFront.style.backgroundImage = cardData.imageUrl;

            const cardBack = document.createElement("div");
            cardBack.classList.add("card-front");
            cardBack.style.backgroundImage =
                "url('https://cdn.pixabay.com/photo/2015/04/23/17/41/javascript-736401_960_720.png')";

            card.appendChild(cardFront);
            card.appendChild(cardBack);
            card.addEventListener("click", handleCardClick);
            gameBoard.appendChild(card);

            // Check if the card was flipped and restore its state
            if (savedState.flippedCards.includes(cardData.imageIndex)) {
                card.classList.add("flipped");
                console.log(savedState.flippedCards);
            }
        });

        adjustGridColumns();
        createGameTimer();
        document.getElementById("game-page").style.display = "flex";
        isPaused = false;
        document.querySelector("#pause").style.display = "block";
    } catch (error) {
        console.error(error);
    }
}

function updateTimer() {
    if (isPaused) return;
    remainingTime--;
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    const timerElement = document.getElementById("timer");
    timerElement.textContent = `Remaining Time: ${String(minutes).padStart(
        2,
        "0"
    )}:${String(seconds).padStart(2, "0")}`;

    if (remainingTime <= 0) {
        clearInterval(timerInterval);
        gameEnd();
    }
}

async function fetchRandomImage(userPrompt) {
    try {
        const response = await fetch("/api/pixabay/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: userPrompt }),
        });

        if (!response.ok) throw new Error("Failed to fetch image");

        const data = await response.json();
        return data.imageUrl;
    } catch (error) {
        console.error("Error fetching image:", error);
        return "";
    }
}

async function fetchUniqueImages(userPrompt, count) {
    const uniqueImages = [];
    while (uniqueImages.length < count) {
        const imageUrl = await fetchRandomImage(userPrompt);
        if (!uniqueImages.includes(imageUrl)) uniqueImages.push(imageUrl);
    }
    return uniqueImages;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function handleCardClick(event) {
    if (isPaused) return;
    const card = event.currentTarget;
    if (
        !card.classList.contains("flipped") &&
        document.querySelectorAll(".card.flipped").length < 2
    ) {
        card.classList.add("flipped");
    }

    if (document.querySelectorAll(".card.flipped").length === 2) {
        setTimeout(compareCards, 1000);
    }
}

function compareCards() {
    const flippedCards = Array.from(document.querySelectorAll(".card.flipped"));
    if (flippedCards.length !== 2) return;

    const [card1, card2] = flippedCards;
    const image1 = card1.querySelector(".card-back").style.backgroundImage;
    const image2 = card2.querySelector(".card-back").style.backgroundImage;

    if (image1 === image2) {
        card1.classList.replace("flipped", "matched");
        card2.classList.replace("flipped", "matched");
    } else {
        setTimeout(() => {
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
        }, 500);
    }

    checkGameEnd();
}

function checkGameEnd() {
    if (
        document.querySelectorAll(".card.matched").length ===
        currentDifficulty.totalCards
    ) {
        gameEnd();
    }
}

async function saveScoreToBackend(username, points, difficulty, time) {
    try {
        const response = await fetch("/api/scores/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, score: points, difficulty, time }),
        });

        if (!response.ok) throw new Error("Failed to save score");

        console.log("Score saved successfully");
    } catch (error) {
        console.error("Error saving the score:", error);
    }
}

async function getCurrentUser() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const response = await fetch("/api/users/profile", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": token,
            },
        });

        if (response.status !== 200) return null;

        return await response.json();
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
}

async function gameEnd() {
    const gameBoard = document.getElementById("gameBoard");
    while (gameBoard.firstChild) gameBoard.removeChild(gameBoard.firstChild);

    const points = remainingTime * 100;
    const user = await getCurrentUser();
    const username = user ? user.username : "ErrorUsername";
    const difficultyString = Object.keys(difficulties).find(
        (key) => difficulties[key] === currentDifficulty
    );
    const timeString = `${Math.floor(remainingTime / 60)}m ${
        remainingTime % 60
    }s`;
    isPaused = false;

    await saveScoreToBackend(username, points, difficultyString, timeString);

    const timerElement = document.getElementById("timer");
    if (timerElement) {
        timerElement.remove();
        clearInterval(timerInterval);
    }

    const gameContainer = document.getElementById("game-container");
    const endMessage = document.createElement("div");
    endMessage.classList.add("end-message");
    endMessage.textContent = `Game Over! You scored ${points} points.`;

    document.getElementById("game-page").style.display = "none";
    document.getElementById("game_menu_difficulty").style.display = "none";
    document.getElementById("difficulty-options").style.display = "";
    document.getElementById("difficulty-buttons").style.display = "";
    document.getElementById("search-criteria").style.display = "none";
    document.getElementById("search-input").value = "";
    document.querySelector("#pause").style.display = "none";

    gameContainer.appendChild(endMessage);
    renderScoreboard();
    deleteSavedGame();
}

async function initializeGame(userPrompt) {
    const cardCount = currentDifficulty.totalCards;
    const uniqueImageCount = cardCount / 2;

    const uniqueImages = await fetchUniqueImages(userPrompt, uniqueImageCount);
    if (!uniqueImages || uniqueImages.length < uniqueImageCount) {
        console.error("Not enough unique images fetched.");
        return;
    }

    const shuffledImages = shuffleArray([...uniqueImages, ...uniqueImages]);
    const gameBoard = document.getElementById("gameBoard");

    shuffledImages.forEach((image, i) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.imageIndex = i;

        const cardFront = document.createElement("div");
        cardFront.classList.add("card-back");
        cardFront.style.backgroundImage = `url('${image}')`;

        const cardBack = document.createElement("div");
        cardBack.classList.add("card-front");
        cardBack.style.backgroundImage =
            "url('https://cdn.pixabay.com/photo/2015/04/23/17/41/javascript-736401_960_720.png')";

        card.appendChild(cardFront);
        card.appendChild(cardBack);
        card.addEventListener("click", handleCardClick);
        gameBoard.appendChild(card);
    });
    // Display the "Pause" button
    document.querySelector("#pause").style.display = "block";

    createGameTimer();
}
async function deleteSavedGame() {
    const user = await getCurrentUser();
    if (!user) {
        console.error("No user found. Cannot delete game state.");
        return;
    }

    try {
        const response = await fetch(`/api/game/delete/${user._id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Failed to delete game state from backend");
        }
    } catch (error) {
        console.error(error);
    }
}
