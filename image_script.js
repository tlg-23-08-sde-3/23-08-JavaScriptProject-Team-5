// Image Generation
document
    .getElementById("imageForm")
    .addEventListener("submit", async function (event) {
        event.preventDefault();
        const prompt = document.getElementById("prompt").value;
        const imageUrl = await generateRandomImage(prompt);
        displayImage(imageUrl);
    });

async function generateRandomImage(prompt) {
    try {
        const response = await fetch("/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt }),
        });
        return response.text();
    } catch (error) {
        console.error(error);
        return "Error: Unable to fetch an image.";
    }
}

function displayImage(imageUrl) {
    const imageContainer = document.getElementById("imageContainer");
    imageContainer.innerHTML = `<img src="${imageUrl}" width="150px" height="150px" alt="Random Image"">`;
}
