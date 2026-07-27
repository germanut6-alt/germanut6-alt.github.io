const telegramApp = window.Telegram.WebApp;

telegramApp.ready();
telegramApp.expand();


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
const connectScreen = document.querySelector(".connect-screen");
const usernameScreen = document.querySelector(".username-screen");
function showConnectScreen() {
    connectScreen.hidden = false;
    usernameScreen.hidden = true;
}

function showUsernameScreen() {
    connectScreen.hidden = true;
    usernameScreen.hidden = false;
}

connectButton.addEventListener("click", function () {
    tonConnectUI.openModal();
});

function updateWalletScreen(wallet) {
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

tonConnectUI.connectionRestored.then(function () {
    updateWalletScreen(tonConnectUI.wallet);
});

const usernameInput = document.querySelector("#username-input");
const usernameError = document.querySelector("#username-error");

const takenUsernames = ["admin", "support", "smp"];

usernameInput.addEventListener("input", function () {
    const enteredUsername = usernameInput.value;

    const cleanedUsername = enteredUsername
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "");

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

    usernameError.textContent = "";
});