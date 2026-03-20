// ui/launchpad-site.ts
class LaunchpadSite extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div>
        <h2>Token LaunchPad</h2>
        <form id="create">
          <input name="name" placeholder="Name" />
          <input name="symbol" placeholder="Symbol" />
          <input name="supply" placeholder="Supply" />
          <button type="submit">Erstellen</button>
        </form>
        <div id="tokens"></div>
      </div>
    `;
    this.querySelector('#create')?.addEventListener('submit', (e) =>
      this.createToken(e),
    );
    this.loadTokens();
  }

  async createToken(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const body = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      symbol: (form.elements.namedItem('symbol') as HTMLInputElement).value,
      supply: (form.elements.namedItem('supply') as HTMLInputElement).value,
    };
    await fetch('/api/launchpad/create-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    this.loadTokens();
  }

  async loadTokens() {
    const res = await fetch('/api/launchpad/list');
    const data = await res.json();
    const div = this.querySelector('#tokens') as HTMLDivElement;
    div.innerHTML = `<pre>${JSON.stringify(data.tokens, null, 2)}</pre>`;
  }
}

customElements.define('launchpad-site', LaunchpadSite);
