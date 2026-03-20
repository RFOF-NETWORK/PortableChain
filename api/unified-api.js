(() => {
  const API_TAGS = {
    auth: "portablechain-auth",
    wallet: "portablechain-wallet",
    chain: "portablechain-chain",
    validator: "portablechain-validator",
    launchpad: "portablechain-launchpad",
    staking: "portablechain-staking",
    market: "portablechain-market"
  };

  class PortableChainUnified extends HTMLElement {
    static get observedAttributes() {
      return ["use"];
    }

    constructor() {
      super();
      this._apis = [];
    }

    connectedCallback() {
      this._parseUseAttribute();
      this._initializeApis();
    }

    attributeChangedCallback() {
      this._parseUseAttribute();
      this._initializeApis();
    }

    _parseUseAttribute() {
      const raw = (this.getAttribute("use") || "").trim();

      this._apis = raw
        .split(",")
        .map(x => x.trim().toLowerCase())
        .filter(x => x in API_TAGS);
    }

    _initializeApis() {
      this._apis.forEach(key => {
        const tag = API_TAGS[key];

        if (customElements.get(tag)) {
          new (customElements.get(tag))();
        }
      });
    }
  }

  customElements.define("portablechain-unified", PortableChainUnified);
})();
