class ValidatorLive extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div>
        <h2>Live Interaktionen (WarmNet)</h2>
        <ul id="log"></ul>
      </div>
    `;
    const log = this.querySelector('#log') as HTMLUListElement;

    const ws = new WebSocket('wss://DEINE-DOMAIN/api/validator/live');
    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      const li = document.createElement('li');
      li.textContent = `[${new Date(
        data.timestamp,
      ).toLocaleTimeString()}] ${data.username} (${data.walletAddress}) -> ${
        data.type
      }`;
      log.prepend(li);
    };
  }
}

customElements.define('validator-live', ValidatorLive);
