# Diplomova-praca-extension

Projekt predstavuje druhú časť diplomovej práce zameranej na vývoj softvéru určeného na analýzu bezpečnosti webových aplikácií univerzitných systémov UKF.

Práca demonštruje, ako môže škodlivé rozšírenie prehliadača (browser extension) získať autentifikačné cookies z vybraných webových aplikácií a následne umožniť prevzatie aktívnej používateľskej relácie (session hijacking), čím sa môže správať ako spyware.

Projekt pozostáva z troch hlavných častí:
- `Browser extension` 
- `Node.js server` 
- `Inštalačný skript pre spustenie prehliadača s extension` 

Extension sleduje prístup používateľa k vybraným webovým aplikáciám, získava autentifikačné cookies a odosiela ich na server, kde sú uložené na ďalšiu analýzu.

## Browser Extension
Rozšírenie prehliadača je implementované pomocou Chrome Extension Manifest V3.

Hlavné vlastnosti:
- `monitorovanie otvorených tabov`
- `detekcia prístupu na cieľové domény`
- `získanie autentifikačných cookies`
- `odoslanie cookies na vzdialený server`

Sledované domény:
- `UKF Webmail`
- `UKF AiS`
  
Extension využíva Chrome API:
- `chrome.cookies`
- `chrome.tabs`

## Manifest
Extension využíva Manifest Version 3.

Požaduje:
- `cookies`
- `tabs`

## service-worker.js
Service worker predstavuje hlavnú logiku extension.

Jeho úlohy:

- `sledovanie zmeny aktívneho tabu`
- `kontrola URL adresy`
- `získanie relevantných cookies`
- `odoslanie cookies na Node.js server`

Cookies sú získavané pomocou Chrome Extensions API `chrome.cookies.get()` pre webmail a `chrome.cookies.getAll()` pre AiS. Následne sú odoslané pomocou HTTP requestu.

## Node.js server (server.js)
Server je implementovaný pomocou Express.js.

Jeho úlohou je:
- `prijímať cookies odoslané extension`
- `ukladať ich do pamäte servera`
- `umožniť ich zobrazenie cez API endpoint`

## Inštalačný skript (import_extension.sh)
Bash skript automatizuje spustenie prehliadača s načítaným rozšírením. Hlavným cieľom je zabezpečiť, aby sa pri každom spustení prehliadača automaticky načítalo rozšírenie bez potreby manuálnej konfigurácie a aby skript fungoval bez práv roota, čo vedie k potenciálne škodlivému správaniu.

Funkcie skriptu:
- `vytvorenie launcher skriptov pre prehliadače`
- `načítanie extension pomocou parametra --load-extension`
- `vytvorenie nových .desktop launcherov`
- `skrytie pôvodných ikoniek prehliadača`

Podporované prehliadače:
- `Chromium`
- `Google Chrome`
- `Microsoft Edge`

# Dôležitá poznámka k projektu
Tento projekt bol vytvorený výhradne na výskumné a vzdelávacie účely v rámci diplomovej práce zameranej na vývoj softvéru pre penetračné testovanie.
  
## Autor: Marián Hlavačka
