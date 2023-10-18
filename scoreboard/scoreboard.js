// This event listener ensures that the JavaScript code only runs after the entire HTML document (DOM) has been fully loaded.
document.addEventListener("DOMContentLoaded", function () {
    // Array of score objects. Each object represents a player's score, the difficulty level they played at, and the time they took.
    const scores = [
        { player: "Gen", score: 340, difficulty: "medium", time: "2m 30s" },
        { player: "Chris", score: 900, difficulty: "hard", time: "3m 15s" },
        { player: "Joe", score: 120, difficulty: "easy", time: "1m 45s" },
        { player: "Gen", score: 340, difficulty: "medium", time: "2m 30s" },
        { player: "Chris", score: 900, difficulty: "hard", time: "3m 15s" },
        { player: "Joe", score: 120, difficulty: "easy", time: "1m 45s" },
        { player: "Gen", score: 340, difficulty: "medium", time: "2m 30s" },
        { player: "Chris", score: 900, difficulty: "hard", time: "3m 15s" },
        { player: "Joe", score: 120, difficulty: "easy", time: "1m 45s" },
        { player: "Gen", score: 340, difficulty: "medium", time: "2m 30s" },
        { player: "Chris", score: 900, difficulty: "hard", time: "3m 15s" },
        { player: "Joe", score: 120, difficulty: "easy", time: "1m 45s" },
    ];

    // Sort the scores array in descending order based on the score value.
    // This ensures that the highest scores are displayed at the top of the scoreboard.
    scores.sort((a, b) => b.score - a.score);

    // Get a reference to the table body element in the HTML where the scores will be appended.
    const scoreboardBody = document.getElementById("scoreboardBody");

    // Loop through each score object in the sorted scores array.
    scores.forEach((score, index) => {
        // Create a new table row (tr) element for each score.
        const row = document.createElement("tr");

        // Populate the row with the data from the current score object.
        // This includes the rank (index + 1), player name, score value, difficulty level, and time.
        row.innerHTML = `
            <th scope="row">${index + 1}</th>
            <td>${score.player}</td>
            <td>${score.score}</td>
            <td>${score.difficulty}</td>
            <td>${score.time}</td>
        `;

        // Append the populated row to the table body in the HTML.
        scoreboardBody.appendChild(row);
    });

    // Add click event listener to the "Scoreboard" button to show the scoreboard section
    const scoreboardButton = document.querySelector(".game-btn:nth-child(2)"); // Updated selector
    scoreboardButton.addEventListener("click", function () {
        // Hide the game menu
        document.querySelector(".game_menu").style.display = "none";

        // Show the scoreboard section
        document.getElementById("scoreboard-section").style.display = "block"; // Updated selector
    });

    // Add click event listener to the "Back to Game Menu" button to navigate back to the game menu
    const backButton = document.querySelector(".score-btn"); // Updated selector
    backButton.addEventListener("click", function () {
        // Hide the scoreboard section
        document.getElementById("scoreboard-section").style.display = "none"; // Updated selector

        // Show the game menu
        document.querySelector(".game_menu").style.display = "flex";
    });
});
