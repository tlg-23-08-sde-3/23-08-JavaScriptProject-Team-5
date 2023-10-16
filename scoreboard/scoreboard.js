document.addEventListener("DOMContentLoaded", function () {
    const scores = [
        { player: "Gen", score: 340 },
        { player: "Chris", score: 900 },
        { player: "Joe", score: 120 },
    ];

    scores.sort((a, b) => b.score - a.score);

    scores.forEach((score, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <th scope="row">${index + 1}</th>
            <td>${score.player}</td>
            <td>${score.score}</td>
        `;
        scoreboardBody.appendChild(row);
    });
});
