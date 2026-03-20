// portable-component.js
// Root-Komponente für das Repository "Portable"
// - kümmert sich um: Registrierung, Login, Logout, WarmNet/ColdNet, View-Routing
// - spricht mit zwei Backends:
//   1) Portable-API (Identität: username/password/settings)
//   2) PortableChain-API (Validator/Blockchain: phrase/wallet/chain/...)

// *** KONFIGURATION DER ENDPOINTS ***
// Passe diese URLs an deine tatsächlichen Deployments an:
const PORTABLE_API_BASE = 'https://portable.example/api';        // Repo "Portable"
const PORTABLECHAIN_API_BASE = 'https://portablechain.example/api'; // Repo "PortableChain"

// *** GLOBALER CLIENT-STATE ***
const state = {
  auth: 'UNREGISTERED', // 'UNREGISTERED' | 'REGISTERED_LOGGED_OUT' | 'REGISTERED_LOGGED_IN'
  net: 'COLDNET',       // 'COLDNET' | 'WARMNET'
  vigilance: 'IDLE',    // 'IDLE' | 'AUTH' | 'FETCH' | 'CRITICAL'
  user: null,           // { userId, username, walletAddress } oder null
};

// *** HILFSFUNKTIONEN FÜR STATE ***
function setState(patch) {
  Object.assign(state, patch);
  // Optional: Debug
  // console.log('[STATE]', state);
}

// *** VIGILANTE FETCH-HÜLLE ***
// - vigilance = 'FETCH' während Request
// - nutzt PortableChain-API (Validator-Backend)
async function vigilantFetchChain(path, options = {}) {
  setState({ vigilance: 'FETCH' });

  try {
    const res = await fetch(`${PORTABLECHAIN_API_BASE}${path}`, {
      credentials: 'include',
      ...options,
    });
    setState({ vigilance: 'IDLE' });
    return res;
  } catch (e) {
    setState({ vigilance: 'CRITICAL' });
    throw e;
  }
}

// *** VIGILANTE AUTH-HÜLLE ***
// - vigilance = 'AUTH' während Auth-Operationen
// - nutzt Portable-API (Identitäts-Backend)
async function vigilantAuthPortable(path, body) {
  setState({ vigilance: 'AUTH' });

  try {
    const res = await fetch(`${PORTABLE_API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      setState({ vigilance: 'CRITICAL' });
      throw new Error('AUTH_FAILED');
    }

    const data = await res.json();
    setState({ vigilance: 'IDLE' });
    return data;
  } catch (e) {
    setState({ vigilance: 'CRITICAL' });
    throw e;
  }
}

// *** NETZ-ZUSTAND (COLDNET/WARMNET) ***
function updateNetStateFromNavigator() {
  if (navigator.onLine) {
    setState({ net: 'WARMNET' });
  } else {
    setState({ net: 'COLDNET' });
  }
}

window.addEventListener('online', () => updateNetStateFromNavigator());
window.addEventListener('offline', () => updateNetStateFromNavigator());
updateNetStateFromNavigator();

// *** ROOT-KOMPONENTE ***
class PortableApp extends HTMLElement {
  connectedCallback() {
    this.render('auth'); // Start mit Auth-View (Login/Registrierung)
  }

  render(view) {
    this.innerHTML = `
      <nav>
        <button data-view="auth">Auth</button>
        <button data-view="wallet">Wallet</button>
        <button data-view="validator">Validator</button>
        <button data-view="chain">Chain</button>
        <button data-view="launchpad">LaunchPad</button>
        <button data-view="staking">Staking</button>
        <button data-view="trading">Trading</button>
        <span style="margin-left:auto;font-size:12px;">
          NET: ${state.net} | AUTH: ${state.auth} | VIGILANZ: ${state.vigilance}
        </span>
      </nav>
      <main id="view"></main>
    `;

    this.querySelectorAll('nav button').forEach((btn) =>
      btn.addEventListener('click', (e) =>
        this.render(e.target.getAttribute('data-view')),
      ),
    );

    const main = this.querySelector('#view');

    if (view === 'auth') {
      main.innerHTML = this.renderAuthView();
      this.attachAuthHandlers(main);
      return;
    }

    // Ab hier: Blockchain-Views, die mit PortableChain-API sprechen
    if (state.auth !== 'REGISTERED_LOGGED_IN') {
      main.innerHTML = `<p>Bitte zuerst einloggen (Auth-Tab).</p>`;
      return;
    }

    if (view === 'wallet') main.innerHTML = '<wallet-site></wallet-site>';
    if (view === 'validator') main.innerHTML = '<validator-live></validator-live>';
    if (view === 'chain') main.innerHTML = '<chain-viewer></chain-viewer>';
    if (view === 'launchpad') main.innerHTML = '<launchpad-site></launchpad-site>';
    if (view === 'staking')
      main.innerHTML = '<pooling-staking-site></pooling-staking-site>';
    if (view === 'trading') main.innerHTML = '<trading-site></trading-site>';
  }

  // *** AUTH-VIEW (Portable-Repo-API) ***
  renderAuthView() {
    const loggedIn = state.auth === 'REGISTERED_LOGGED_IN';
    const username = state.user?.username || '';

    return `
      <section>
        <h2>Portable Auth (Username / Passwort / Phrase)</h2>

        ${
          !loggedIn
            ? `
        <h3>Registrierung</h3>
        <form id="register-form">
          <input name="username" placeholder="Nutzername" required />
          <input name="password" type="password" placeholder="Passwort" required />
          <button type="submit">Registrieren</button>
        </form>

        <h3>Login</h3>
        <form id="login-form">
          <input name="username" placeholder="Nutzername" required />
          <input name="password" type="password" placeholder="Passwort" required />
          <input name="phrase" placeholder="Phrase (Seed)" required />
          <button type="submit">Login</button>
        </form>
        `
            : `
        <p>Eingeloggt als <strong>${username}</strong></p>
        <button id="logout-btn">Logout</button>
        `
        }

        <h3>WarmNet / ColdNet</h3>
        <p>Aktueller Zustand: <strong>${state.net}</strong></p>
        <button id="set-warmnet">WarmNet</button>
        <button id="set-coldnet">ColdNet</button>
      </section>
    `;
  }

  attachAuthHandlers(root) {
    const registerForm = root.querySelector('#register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const username = form.elements.username.value;
        const password = form.elements.password.value;

        try {
          // 1) Portable-Repo: username/password registrieren
          const identity = await vigilantAuthPortable('/auth/register', {
            username,
            password,
          });

          // 2) PortableChain-Repo: Wallet/Phrase/Validator anlegen
          const chainRes = await vigilantFetchChain('/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username,
              password,
            }),
          });
          const chainData = await chainRes.json();

          // Hier: chainData enthält z.B. { userId, walletAddress, phrase }
          // Phrase wird dem Nutzer angezeigt (z.B. in einem Popup oder separaten View)
          alert(
            'Registrierung erfolgreich.\nDeine Wallet-Adresse: ' +
              chainData.walletAddress +
              '\nDeine Phrase (unbedingt sichern!):\n' +
              chainData.phrase,
          );

          setState({
            auth: 'REGISTERED_LOGGED_OUT',
          });

          this.render('auth');
        } catch (err) {
          alert('Registrierung fehlgeschlagen.');
        }
      });
    }

    const loginForm = root.querySelector('#login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const username = form.elements.username.value;
        const password = form.elements.password.value;
        const phrase = form.elements.phrase.value;

        try:
          // 1) Portable-Repo: Login (username/password)
          const identity = await vigilantAuthPortable('/auth/login', {
            username,
            password,
          });

          // 2) PortableChain-Repo: Login (username/password/phrase) -> Validator prüft Double-SHA-256
          const chainRes = await vigilantFetchChain('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username,
              password,
              phrase,
            }),
          });
          const chainData = await chainRes.json();

          setState({
            auth: 'REGISTERED_LOGGED_IN',
            user: {
              userId: chainData.userId,
              username: chainData.username,
              walletAddress: chainData.walletAddress,
            },
          });

          this.render('wallet');
        } catch (err) {
          alert('Login fehlgeschlagen.');
        }
      });
    }

    const logoutBtn = root.querySelector('#logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        // Optional: Portable-API Logout
        await fetch(`${PORTABLE_API_BASE}/auth/logout`, {
          method: 'POST',
          credentials: 'include',
        }).catch(() => {});
        setState({
          auth: 'REGISTERED_LOGGED_OUT',
          user: null,
        });
        this.render('auth');
      });
    }

    const warmBtn = root.querySelector('#set-warmnet');
    if (warmBtn) {
      warmBtn.addEventListener('click', async () => {
        setState({ net: 'WARMNET' });
        // Optional: Demo-Event an Portable-API oder PortableChain-API senden
        await fetch(`${PORTABLE_API_BASE}/demo/warmnet`, {
          method: 'POST',
          credentials: 'include',
        }).catch(() => {});
        this.render('auth');
      });
    }

    const coldBtn = root.querySelector('#set-coldnet');
    if (coldBtn) {
      coldBtn.addEventListener('click', async () => {
        setState({ net: 'COLDNET' });
        await fetch(`${PORTABLE_API_BASE}/demo/coldnet`, {
          method: 'POST',
          credentials: 'include',
        }).catch(() => {});
        this.render('auth');
      });
    }
  }
}

customElements.define('portable-app', PortableApp);
