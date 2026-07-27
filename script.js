const telegramApp = window.Telegram.WebApp;

telegramApp.ready();
telegramApp.expand();

telegramApp.showAlert(
    "927508173" + telegramApp.initDataUnsafe.user.id
);

const allowedUserId = "927508173";
const currentUserId = telegramApp.initDataUnsafe.user?.id;

if (currentUserId !== allowedUserId) {
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

connectButton.addEventListener("click", function () {
    tonConnectUI.openModal();
});

tonConnectUI.onStatusChange(function (wallet) {
    if (wallet) {
        connectButton.textContent = "Wallet connected";
    } else {
        connectButton.textContent = "TON Connect";
    }
});