import crypto from 'crypto';

export interface Wallet {
  address: string;
  publicKey: string;
}

export function generateMnemonic(): string {
  // Minimaler Platzhalter – hier kannst du BIP39 o.ä. einbauen
  return crypto.randomBytes(16).toString('hex');
}

export function walletFromMnemonic(mnemonic: string): Wallet {
  const hash = crypto.createHash('sha256').update(mnemonic).digest('hex');
  const publicKey = hash;
  const address = '0x' + hash.slice(0, 40);
  return { address, publicKey };
}

export function signPayload(mnemonic: string, payload: string): string {
  // Platzhalter: HMAC über Payload mit Mnemonic
  return crypto.createHmac('sha256', mnemonic).update(payload).digest('hex');
}
