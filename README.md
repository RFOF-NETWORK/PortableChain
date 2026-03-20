# PortableChain
#42E0

📘 PortableChain/README.md

`markdown

PortableChain

PortableChain ist ein vollständig monolithisches, serverless-fähiges Blockchain-System, das auf einem Validator-basierten Backend und einer global deterministischen Architektur aufbaut. Es kombiniert Identität, Wallet, Validator-Logik, Chain-Verwaltung, Token-Launchpad, Staking, Market-Daten und Live-Interaktionen in einem einzigen, auditierbaren System.

PortableChain ist so konzipiert, dass es vollständig ohne klassische Server funktioniert. Stattdessen übernimmt ein Validator-Kern alle Aufgaben, die in traditionellen Systemen ein Server erledigen würde. Dadurch entsteht ein global portables, deterministisches und audit-proof Blockchain-Ökosystem.

---

🔥 Kernprinzipien

• Validator statt Server
PortableChain ersetzt klassische Server durch einen Validator-Kern, der:
- Identität validiert  
- Wallets ableitet  
- Phrasen verschlüsselt speichert  
- Transaktionen prüft  
- Blöcke erzeugt  
- Live-Interaktionen streamt  
- WarmNet/ColdNet-Zustände erkennt  

• Double‑SHA‑256
Alle sicherheitsrelevanten Operationen basieren auf Double‑SHA‑256:
- Passwort-Hashing  
- Verschlüsselungs-Key für Phrasen  
- Wallet-Ableitung  
- Signaturen  
- Validator-Authentifizierung  

• Modell B – Verschlüsselte Phrase
PortableChain speichert die Phrase niemals im Klartext.  
Stattdessen wird sie mit einem Schlüssel verschlüsselt, der aus Double‑SHA‑256(password) abgeleitet wird.

• 3‑Faktor‑Login
PortableChain nutzt ein einzigartiges Login-Modell:
1. Nutzername  
2. Passwort  
3. Phrase  

Nur wenn alle drei Faktoren kryptografisch zusammenpassen, wird der Nutzer authentifiziert.

• WarmNet / ColdNet
- WarmNet = Online, Live-Interaktionen, Validator-Stream  
- ColdNet = Offline, lokale Aktionen, keine Broadcasts  

• Extended Validator
Jeder registrierte Nutzer wird automatisch zu einem Extended Validator.  
Alle Interaktionen werden live im Validator-Stream sichtbar.

---

📁 Projektstruktur

```
portablechain/
├─ core/                 
│  ├─ block.ts           # Blockstruktur, Hashing, Double-SHA-256
│  ├─ chain.ts           # Blockchain-Verwaltung
│  ├─ tx.ts              # Transaktionen
│  ├─ wallet.ts          # Phrase, Wallet, Signaturen
│  ├─ validator.ts       # Validator-Kern, Live-Events
│  └─ state.ts           # WarmNet/ColdNet, Vigilanz, Auth-Zustände
│
├─ api/                  
│  ├─ auth.ts            # Registrierung, Login (3-Faktor)
│  ├─ wallet.ts          # Balance, Send, Receive
│  ├─ chain.ts           # Blocks, Suche, Viewer
│  ├─ validator.ts       # Live-Interaktionen (WarmNet)
│  ├─ launchpad.ts       # Token-Erstellung
│  ├─ staking.ts         # Pools, Stake/Unstake
│  └─ market.ts          # Orderbook, Trades, OHLC
│
├─ ui/                   
│  ├─ wallet-site.ts
│  ├─ validator-live.ts
│  ├─ chain-viewer.ts
│  ├─ launchpad-site.ts
│  ├─ pooling-staking-site.ts
│  └─ trading-site.ts
│
├─ portable-component.js # App-Shell, Router, State-Machine
└─ index.html            # Einstiegspunkt
```

---

🧩 API-Übersicht

PortableChain stellt 7 eigenständige APIs bereit:

1. Auth API  
2. Wallet API  
3. Chain API  
4. Validator API  
5. LaunchPad API  
6. Staking API  
7. Market API

Optional:  
Unified API – kombiniert alle 7 APIs in beliebiger Konfiguration.

Diese APIs können einzeln oder kombiniert in externen Systemen (z. B. Webador) eingebunden werden.

---

🚀 Ziel

PortableChain ermöglicht ein global portables, auditierbares Blockchain-System, das vollständig ohne klassische Server funktioniert und dennoch alle Funktionen einer modernen Blockchain bietet – inklusive Wallet, Validator, Chain Viewer, Token Launchpad, Staking und Trading.
