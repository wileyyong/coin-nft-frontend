import Storage from 'service/storage';

export type UserWallet = {
  address: string;
  balance: any;
}

export type UserReducerState = {
  loading: boolean;
  searchKey: string;
  info: any;
  token: any;
  wallet: UserWallet;
  collections: any[];
  myCollections: any[];
  myTokens: any[];
}

export const initCollectionItems = [
  {
    _id: null,
    name: 'PUML',
    protocol: 'PUML'
  }
]

export const USER_INITIAL_STATE: UserReducerState = {
  loading: false,
  searchKey: '',
  info: {},
  token: Storage.getAuthToken(),
  wallet: { address: '', balance: 0 } as UserWallet,
  collections: initCollectionItems,
  myCollections: initCollectionItems,
  myTokens: []
};
