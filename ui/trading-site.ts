// ui/trading-site.ts
class TradingSite extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div>
        <h2>Trading</h2>
        <input id="pair" placeholder="PAIR z.B. PORT/USDT" />
        <button id="load">Laden</button>
        <div id="chart"></div>
      </div>
    `;
    this.querySelector('#load')?.addEventListener('click', () => this.load());
  }

  async load() {
    const pairInput = this.querySelector('#pair') as HTMLInputElement;
    const res = await fetch(
      `/api/market/ohlc?pair=${encodeURIComponent(pairInput.value)}`,
    );
    const data = await res.json();
    const div = this.querySelector('#chart') as HTMLDivElement;
    div.innerHTML = `<pre>${JSON.stringify(data.candles, null, 2)}</pre>`;
  }
}

customElements.define('trading-site', TradingSite);
