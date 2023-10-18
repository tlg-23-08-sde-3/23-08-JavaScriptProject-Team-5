// Function to toggle between signup and signin forms
function toggleForm() {
    const signInBox = document.querySelector(".signinBox");
    const signUpBox = document.querySelector(".signupBox");

    if (signInBox.style.display === "block" || signInBox.style.display === "") {
        signInBox.style.display = "none";
        signUpBox.style.display = "block";
    } else {
        signInBox.style.display = "block";
        signUpBox.style.display = "none";
    }
}

// Function to handle successful login or signup
function handleSuccessfulAuth() {
    console.log("login successful");
    // Hide the sign-in/sign-up section
    document.querySelector("section").style.display = "none";

    // Show the game menu
    document.querySelector(".game_menu").style.display = "flex";
}

// Attach the toggleForm function to both signup and signin links
document
    .querySelector(".signinBox .signup a")
    .addEventListener("click", toggleForm);
document
    .querySelector(".signupBox .signup a")
    .addEventListener("click", toggleForm);

// Attach the handleSuccessfulAuth function to the login and signup buttons
document
    .querySelector("input[name='login']")
    .addEventListener("click", handleSuccessfulAuth);
document
    .querySelector("input[name='signup']")
    .addEventListener("click", handleSuccessfulAuth);
