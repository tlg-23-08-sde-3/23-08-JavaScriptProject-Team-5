document.addEventListener("DOMContentLoaded", function () {
    const scores = [
        { player: "Gen", score: 100 },
        { player: "Chris", score: 90 },
        { player: "Joe", score: 80 },
    ];

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
