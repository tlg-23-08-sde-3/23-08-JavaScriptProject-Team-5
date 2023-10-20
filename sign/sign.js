// Function to toggle between signup and signin forms
function toggleForm(event) {
    event.preventDefault();

    const signInBox = document.querySelector(".signinBox");
    const signUpBox = document.querySelector(".signupBox");

    if (signInBox.style.display === "block" || signInBox.style.display === "") {
        signInBox.style.display = "none";
        signUpBox.style.display = "block";
    } else {
        signInBox.style.display = "block";
        signUpBox.style.display = "none";
    }

    // Clear the form fields
    document.querySelector(".signinBox form").reset();
    document.querySelector(".signupBox form").reset();

    // Clear any existing messages
    document.getElementById("signinMessage").textContent = "";
    document.getElementById("signupMessage").textContent = "";
}

// Function to handle successful login or signup
function handleSuccessfulAuth(username) {
    // Hide the sign-in/sign-up section
    document.querySelector(".sign-section").style.display = "none";

    displayResumeButtonIfGameExists();
    animateButtons();
    // Show the game menu
    document.querySelector(".game_menu").style.display = "flex";

    // Display the username in the welcome message
    document.getElementById("welcome-message").textContent =
        "Welcome, " + username + "!";

    // Display the "Logout" button
    document.querySelector(".user-info").style.display = "block";
}

// Function to handle user registration
async function handleUserRegistration(event) {
    event.preventDefault();

    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
        const response = await fetch("/api/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();

        if (response.status === 201) {
            document.getElementById("signupMessage").textContent = data.message;
            document.getElementById("signupMessage").classList.add("success");
            setTimeout(() => {
                toggleForm(event);
            }, 1000);
        } else {
            document.getElementById("signupMessage").textContent = data.message;
        }
    } catch (error) {
        document.getElementById("signupMessage").textContent =
            "An error occurred during registration.";
    }
    event.target.reset();
}

// Function to handle user login
async function handleUserLogin(event) {
    event.preventDefault();

    const username = event.target.username.value;
    const password = event.target.password.value;

    try {
        const response = await fetch("/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.status === 200) {
            localStorage.setItem("username", username);
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.userId);
            document.getElementById("signinMessage").textContent =
                "Logged in successfully.";
            document.getElementById("signinMessage").classList.add("success");
            setTimeout(() => {
                handleSuccessfulAuth(username);
            }, 1000);
        } else {
            document.getElementById("signinMessage").textContent = data.message;
        }
    } catch (error) {
        document.getElementById("signinMessage").textContent =
            "An error occurred during login.";
    }
    event.target.reset();
}

// Attach the toggleForm function to both signup and signin links
document
    .querySelector(".signinBox .signup a")
    .addEventListener("click", toggleForm);
document
    .querySelector(".signupBox .signup a")
    .addEventListener("click", toggleForm);

// Attach the handleUserRegistration and handleUserLogin functions to the signup and login forms
document
    .querySelector(".signupBox form")
    .addEventListener("submit", handleUserRegistration);
document
    .querySelector(".signinBox form")
    .addEventListener("submit", handleUserLogin);

// Function to handle the logout action
function logout() {
    // clear the userid and token from local storage
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    location.reload();
}

// Add an event listener to the logout button
document.getElementById("logout-button").addEventListener("click", logout);

// Check loggedIn

async function checkLoggedIn() {
    try {
        document.querySelector(".sign-section").style.display = "none";
        document.querySelector(".game_menu").style.display = "none";
        document.querySelector(".user-info").style.display = "none";

        const response = await fetch("/api/users/checkSession", {
            method: "GET",
            headers: {
                "x-auth-token": localStorage.getItem("token"),
            },
        });

        if (response.status === 200) {
            const data = await response.json();
            const { username } = data;
            document.querySelector(".game_menu").style.display = "flex";
            document.querySelector(".user-info").style.display = "block";
            document.getElementById("welcome-message").textContent =
                "Welcome, " + username + "!";
        } else {
            document.querySelector(".sign-section").style.display = "flex";
        }
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    checkLoggedIn();
});
