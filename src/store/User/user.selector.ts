import { RootState } from '../index';
import { toFixed } from 'service/number';

export function getWalletAddress(state: RootState): string {
  return state?.user?.wallet?.address;
}

export function getWalletBalance(state: RootState): any {
  let balance = state?.user?.wallet?.balance;
  if(balance) return toFixed(balance,4);
  return 0;
}

export function getCollections(state: RootState): any {
  return state?.user?.collections || [];
}

export function isAuthenticated(state: RootState): boolean {
  let isAuthenticated = state.user.token ? true: false;
  return isAuthenticated;
}

export function getMyInfo(state: RootState): any {
  return state?.user?.info;
}