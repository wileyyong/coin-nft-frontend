
export type NftReducerState = {
  serviceFee: number;
  ethUsdTCurrency: any;
}

export const NFT_INITIAL_STATE: NftReducerState = {
  serviceFee: 0,
  ethUsdTCurrency: ''
};
