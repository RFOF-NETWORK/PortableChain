export type NetState = 'COLDNET' | 'WARMNET';
export type AuthState =
  | 'UNREGISTERED'
  | 'REGISTERED_LOGGED_OUT'
  | 'REGISTERED_LOGGED_IN';

export type VigilanceState = 'IDLE' | 'AUTH' | 'FETCH' | 'CRITICAL';

export interface PortableChainState {
  net: NetState;
  auth: AuthState;
  vigilance: VigilanceState;
  connectivity: 'ONLINE' | 'OFFLINE';
  user?: {
    username: string;
    walletAddress: string;
  };
}

export const initialState: PortableChainState = {
  net: 'COLDNET',
  auth: 'UNREGISTERED',
  vigilance: 'IDLE',
  connectivity: 'OFFLINE',
};
