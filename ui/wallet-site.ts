import { store } from './state-store';

class WalletSite extends HTMLElement {
  connectedCallback() {
    this.render();
    store.subscribe(() => this.render());
  }

  render() {
    this.innerHTML = `
      <div>
        <h2>Wallet</h2>
        <button id="show-phrase">Phrase anzeigen / downloaden</button>
        <div id="phrase-box" style="display:none;"></div>
      </div>
    `;

    this.querySelector('#show-phrase')?.addEventListener('click', () =>
      this.loadPhrase(),
    );
  }

  async loadPhrase() {
    const res = await fetch('/api/wallet/phrase', {
      method: 'GET',
      credentials: 'include',
    }).catch(() => null);
    if (!res || !res.ok) return;
    const data = await res.json();
    const box = this.querySelector('#phrase-box') as HTMLDivElement;
    box.style.display = 'block';
    box.textContent = data.phrase;
  }
}

customElements.define('wallet-site', WalletSite);
