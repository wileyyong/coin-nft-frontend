import { RootState } from '../index';

export function getNftServiceFee(state: RootState): number {
  return state?.nft?.serviceFee;
}

export function getETHUSDTCurrency(state: RootState): any {
  return state?.nft?.ethUsdTCurrency || '';
}