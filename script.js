"use strict";

const telegramApp = window.Telegram.WebApp;

telegramApp.ready();
telegramApp.expand();
function updateViewportHeight() {
    const currentHeight =
        telegramApp.viewportStableHeight || window.innerHeight;

    document.documentElement.style.setProperty(
        "--app-height",
        currentHeight + "px"
    );
}

updateViewportHeight();

telegramApp.onEvent("viewportChanged", function (event) {
    if (event.isStateStable) {
        updateViewportHeight();
    }
});

const allowedUserId = 927508173;
const currentUserId = telegramApp.initDataUnsafe.user?.id;
const isLocalDevelopment =
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "localhost" ||
    window.location.hostname.startsWith("192.168.");
if (!isLocalDevelopment && currentUserId !== allowedUserId) {
    document.body.innerHTML = `
        <main>
            <h1>Access denied</h1>
            <p>This test app is private.</p>
        </main>
    `;

    throw new Error("Access denied");
}


const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: "https://germanut6-alt.github.io/tonconnect-manifest.json"
});

const connectButton = document.querySelector(".fbutton");
const loadingScreen = document.querySelector(".loading-screen");
const connectScreen = document.querySelector(".connect-screen");
const usernameScreen = document.querySelector(".username-screen");
const mainMenuScreen = document.querySelector(".main-menu");
const sendScreen = document.querySelector(".wallet-send");
const receiveScreen = document.querySelector(".wallet-receive");
const navigationBar = document.querySelector(".buttons");
const navigationButtons = document.querySelectorAll(".buttons button");
const homeNavigationButton = document.querySelector(".home-button");
const sendNavigationButton = document.querySelector(".send-button");
const receiveNavigationButton = document.querySelector(".receive-button");

function setActiveNavigation(activeButton) {
    navigationButtons.forEach(function (button) {
        button.classList.remove("active");
    });
    activeButton.classList.add("active");
}

function showConnectScreen() {
    loadingScreen.hidden = true;
    connectScreen.hidden = false;
    usernameScreen.hidden = true;
    mainMenuScreen.hidden = true;
    sendScreen.hidden = true;
    receiveScreen.hidden = true;
    navigationBar.hidden = true;
}

function showUsernameScreen() {
    loadingScreen.hidden = true;
    connectScreen.hidden = true;
    usernameScreen.hidden = false;
    mainMenuScreen.hidden = true;
    sendScreen.hidden = true;
    receiveScreen.hidden = true;
    navigationBar.hidden = true;
}

function showMainMenuScreen() {
    loadingScreen.hidden = true;
    connectScreen.hidden = true;
    usernameScreen.hidden = true;
    mainMenuScreen.hidden = false;
    sendScreen.hidden = true;
    receiveScreen.hidden = true;
    navigationBar.hidden = false;
    setActiveNavigation(homeNavigationButton);
}

function showSendScreen() {
    loadingScreen.hidden = true;
    connectScreen.hidden = true;
    usernameScreen.hidden = true;
    mainMenuScreen.hidden = true;
    sendScreen.hidden = false;
    receiveScreen.hidden = true;
    navigationBar.hidden = false;
    setActiveNavigation(sendNavigationButton);
}

function showReceiveScreen() {
    loadingScreen.hidden = true;
    connectScreen.hidden = true;
    usernameScreen.hidden = true;
    mainMenuScreen.hidden = true;
    sendScreen.hidden = true;
    receiveScreen.hidden = false;
    navigationBar.hidden = false;
    setActiveNavigation(receiveNavigationButton);
}

connectButton.addEventListener("click", async function () {
    try {
        await tonConnectUI.openModal();
    } catch (error) {
        console.error("Could not open TON Connect:", error);
    }
});

function updateWalletScreen(wallet) {
    if (isLocalDevelopment) {
        const previewScreen = new URLSearchParams(window.location.search).get("screen");
        if (previewScreen === "loading") {
            return;
        }
        showReceiveScreen();
        return;
    }

    if (wallet) {
        connectButton.textContent = "Wallet connected";
        showUsernameScreen();
    } else {
        connectButton.textContent = "Connect TON";
        showConnectScreen();
    }
}

tonConnectUI.onStatusChange(
    updateWalletScreen,

    function (error) {
        console.error("TON Connect error:", error);
    }
);

tonConnectUI.connectionRestored
    .then(function () {
        updateWalletScreen(tonConnectUI.wallet);
    })
    .catch(function (error) {
        console.error("Could not restore TON Connect session:", error);
        updateWalletScreen(null);
    });

const usernameInput = document.querySelector("#username-input");
const usernameError = document.querySelector("#username-error");
const continueButton = document.querySelector(".cont-button");

const takenUsernames = ["admin", "support", "smp"];

usernameInput.addEventListener("input", function () {
    const enteredUsername = usernameInput.value;

    const cleanedUsername = enteredUsername
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "");
    continueButton.disabled = true;
    usernameInput.value = cleanedUsername;

    if (enteredUsername.toLowerCase() !== cleanedUsername) {
        usernameError.textContent =
            "Only English letters, numbers and _ are allowed";
        return;
    }

    if (cleanedUsername.length === 0) {
        usernameError.textContent = "";
        return;
    }

    if (cleanedUsername.length < 3) {
        usernameError.textContent =
            "Username must contain at least 3 characters";
        return;
    }

    if (takenUsernames.includes(cleanedUsername)) {
        usernameError.textContent =
            "This username is already taken";
        return;
    }
    continueButton.disabled = false;
    usernameError.textContent = "";
});

continueButton.addEventListener("click", function () {
    if (continueButton.disabled) {
        return;
    }

    showMainMenuScreen();
});
homeNavigationButton.addEventListener("click", showMainMenuScreen);
sendNavigationButton.addEventListener("click", showSendScreen);
receiveNavigationButton.addEventListener("click", showReceiveScreen);
