// Function to toggle between signup and signin forms

function toggleForm() {
    const signInBox = document.querySelector(".signinBox");
    const signUpBox = document.querySelector(".signupBox");

    if (signInBox.style.display === "block") {
        signInBox.style.display = "none";
        signUpBox.style.display = "block";
    } else {
        signInBox.style.display = "block";
        signUpBox.style.display = "none";
    }
}

// Attach the toggleForm function to both signup and signin links
document.querySelector(".signupLink").addEventListener("click", toggleForm);
document.querySelector(".signinLink").addEventListener("click", toggleForm);
