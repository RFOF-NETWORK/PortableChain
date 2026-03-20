import { initialState, PortableChainState } from '../core/state';

type Listener = (state: PortableChainState) => void;

class Store {
  value: PortableChainState = initialState;
  private listeners: Listener[] = [];

  subscribe(fn: Listener) {
    this.listeners.push(fn);
    fn(this.value);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  set(next: PortableChainState) {
    this.value = next;
    this.listeners.forEach((l) => l(this.value));
  }
}

export const store = new Store();

export function setState(next: PortableChainState) {
  store.set(next);
}
