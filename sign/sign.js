// Set the API URL for the application
window.API_URL = "https://memory-card-gamenode.onrender.com";

// Function to toggle between signup and signin forms
function toggleForm(event) {
    event.preventDefault();

    // Get references to the sign-in and sign-up boxes
    const signInBox = document.querySelector(".signinBox");
    const signUpBox = document.querySelector(".signupBox");

    // Toggle the display of the sign-in and sign-up boxes
    if (signInBox.style.display === "block" || signInBox.style.display === "") {
        signInBox.style.display = "none";
        signUpBox.style.display = "block";
    } else {
        signInBox.style.display = "block";
        signUpBox.style.display = "none";
    }

    // Clear the form fields for both sign-in and sign-up forms
    document.querySelector(".signinBox form").reset();
    document.querySelector(".signupBox form").reset();

    // Clear any existing messages displayed to the user
    document.getElementById("signinMessage").textContent = "";
    document.getElementById("signupMessage").textContent = "";
}

// Function to handle actions after successful login or signup
function handleSuccessfulAuth(username) {
    // Hide the sign-in/sign-up section
    document.querySelector(".sign-section").style.display = "none";

    // Additional functions to enhance user experience (not provided in the code)
    displayResumeButtonIfGameExists();
    animateButtons();

    // Show the game menu to the user
    document.querySelector(".game_menu").style.display = "flex";

    // Display a welcome message with the user's username
    document.getElementById("welcome-message").textContent =
        "Welcome, " + username + "!";

    // Display the "Logout" button for the user
    document.querySelector(".user-info").style.display = "block";
}

// Function to handle user registration
async function handleUserRegistration(event) {
    event.preventDefault();

    // Extract user details from the registration form
    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
        // Send a POST request to the server to register the user
        const response = await fetch(`${API_URL}/api/users/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();

        // Handle the server's response
        if (response.status === 201) {
            // Display a success message to the user
            document.getElementById("signupMessage").textContent = data.message;
            document.getElementById("signupMessage").classList.add("success");
            // Switch to the sign-in form after a short delay
            setTimeout(() => {
                toggleForm(event);
            }, 1000);
        } else {
            // Display any error messages from the server
            document.getElementById("signupMessage").textContent = data.message;
        }
    } catch (error) {
        // Handle any errors that occur during the registration process
        document.getElementById("signupMessage").textContent =
            "An error occurred during registration.";
    }
    // Reset the registration form fields
    event.target.reset();
}

// Function to handle user login
async function handleUserLogin(event) {
    event.preventDefault();

    // Extract user details from the login form
    const username = event.target.username.value;
    const password = event.target.password.value;

    try {
        // Send a POST request to the server to log the user in
        const response = await fetch(`${API_URL}/api/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        // Handle the server's response
        if (response.status === 200) {
            // Store user details and token in local storage
            localStorage.setItem("username", username);
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.userId);

            // Display a success message to the user
            document.getElementById("signinMessage").textContent =
                "Logged in successfully.";
            document.getElementById("signinMessage").classList.add("success");

            // Proceed to the game menu after a short delay
            setTimeout(() => {
                handleSuccessfulAuth(username);
            }, 1000);
        } else {
            // Display any error messages from the server
            document.getElementById("signinMessage").textContent = data.message;
        }
    } catch (error) {
        // Handle any errors that occur during the login process
        document.getElementById("signinMessage").textContent =
            "An error occurred during login.";
    }
    // Reset the login form fields
    event.target.reset();
}

// Attach event listeners to toggle between sign-in and sign-up forms
document
    .querySelector(".signinBox .signup a")
    .addEventListener("click", toggleForm);
document
    .querySelector(".signupBox .signup a")
    .addEventListener("click", toggleForm);

// Attach event listeners to handle user registration and login
document
    .querySelector(".signupBox form")
    .addEventListener("submit", handleUserRegistration);
document
    .querySelector(".signinBox form")
    .addEventListener("submit", handleUserLogin);

// Function to handle user logout
function logout() {
    // Remove user details and token from local storage
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    // Reload the page
    location.reload();
}

// Attach an event listener to the logout button
document.getElementById("logout-button").addEventListener("click", logout);

// Function to check if the user is already logged in
async function checkLoggedIn() {
    try {
        // Initially hide the sign-in/sign-up section, game menu, and user info
        document.querySelector(".sign-section").style.display = "none";
        document.querySelector(".game_menu").style.display = "none";
        document.querySelector(".user-info").style.display = "none";

        // Send a GET request to the server to check the user's session
        const response = await fetch(`${API_URL}/api/users/checkSession`, {
            method: "GET",
            headers: {
                "x-auth-token": localStorage.getItem("token"),
            },
        });

        // Handle the server's response
        if (response.status === 200) {
            const data = await response.json();
            const { username } = data;

            // Display the game menu and user info if the user is logged in
            document.querySelector(".game_menu").style.display = "flex";
            displayResumeButtonIfGameExists();
            document.querySelector(".user-info").style.display = "block";
            document.getElementById("welcome-message").textContent =
                "Welcome, " + username + "!";
        } else {
            // Display the sign-in/sign-up section if the user is not logged in
            document.querySelector(".sign-section").style.display = "flex";
        }
    } catch (error) {
        console.error(error);
    }
}

// Check if the user is logged in when the page loads
document.addEventListener("DOMContentLoaded", function () {
    checkLoggedIn();
});
