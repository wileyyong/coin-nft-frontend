
export type NftReducerState = {
  serviceFee: number;
  categories: any[];
  ethUsdTCurrency: any;
}

export const initCategories = [
  {
    label: 'All',
    value: 'all'
  }
];

export const NFT_INITIAL_STATE: NftReducerState = {
  serviceFee: 0,
  categories: initCategories,
  ethUsdTCurrency: ''
};
