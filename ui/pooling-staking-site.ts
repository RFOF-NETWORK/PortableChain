// ui/pooling-staking-site.ts
class PoolingStakingSite extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div>
        <h2>Pooling & Staking</h2>
        <div id="pools"></div>
      </div>
    `;
    this.loadPools();
  }

  async loadPools() {
    const res = await fetch('/api/staking/pools');
    const data = await res.json();
    const div = this.querySelector('#pools') as HTMLDivElement;
    div.innerHTML = `<pre>${JSON.stringify(data.pools, null, 2)}</pre>`;
  }
}

customElements.define('pooling-staking-site', PoolingStakingSite);
