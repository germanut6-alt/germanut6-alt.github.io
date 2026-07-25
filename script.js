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
