import Storage from "service/storage";

export type UserWallet = {
  address: string;
  balance: any;
  pumlx: any;
};

export type UserReducerState = {
  loading: boolean;
  info: any;
  token: any;
  wallet: UserWallet;
  collections: any[];
  myCollections: any[];
  myTokens: any[];
};

export const initCollectionItems = [
  {
    _id: null,
    name: "PUML",
    symbol: "PUML"
  }
];

export const USER_INITIAL_STATE: UserReducerState = {
  loading: false,
  info: {},
  token: Storage.getAuthToken(),
  wallet: { address: "", balance: 0, pumlx: 0 } as UserWallet,
  collections: initCollectionItems,
  myCollections: initCollectionItems,
  myTokens: []
};
