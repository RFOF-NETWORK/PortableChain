class ChainViewer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div>
        <h2>Chain Viewer</h2>
        <input id="search" placeholder="Hash, Adresse, Token" />
        <button id="search-btn">Suchen</button>
        <div id="results"></div>
      </div>
    `;
    this.querySelector('#search-btn')?.addEventListener('click', () =>
      this.search(),
    );
    this.loadBlocks();
  }

  async loadBlocks() {
    const res = await fetch('/api/chain/blocks');
    const data = await res.json();
    const results = this.querySelector('#results') as HTMLDivElement;
    results.innerHTML = `<pre>${JSON.stringify(data.blocks, null, 2)}</pre>`;
  }

  async search() {
    const input = this.querySelector('#search') as HTMLInputElement;
    const q = input.value;
    const res = await fetch(`/api/chain/search?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    const results = this.querySelector('#results') as HTMLDivElement;
    results.innerHTML = `<pre>${JSON.stringify(data.blocks, null, 2)}</pre>`;
  }
}

customElements.define('chain-viewer', ChainViewer);
