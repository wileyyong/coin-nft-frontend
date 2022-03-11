import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";
import {
  UserReducerState,
  USER_INITIAL_STATE,
  initCollectionItems,
} from "./user.state";
import Storage from "service/storage";
import UserController from "controller/UserController";
import CollectionController from "controller/CollectionController";
import EthUtil from "ethereum/EthUtil";
import configs from "configs";
import { onboard, web3 } from "ethereum/OnBoard";
import SmartContract from "ethereum/Contract";

export const userSlice = createSlice({
  name: "user",
  initialState: USER_INITIAL_STATE,
  reducers: {
    setUserWalletAddress(
      state: Draft<UserReducerState>,
      action: PayloadAction<string>
    ) {
      state.wallet.address = action.payload;
    },
    setUserWalletPumlx(
      state: Draft<UserReducerState>,
      action: PayloadAction<string>
    ) {
      state.wallet.pumlx = action.payload;
    },
    setUserWalletBalance(
      state: Draft<UserReducerState>,
      action: PayloadAction<any>
    ) {
      state.wallet.balance = action.payload;
    },
    setMyInfo(state: Draft<UserReducerState>, action: PayloadAction<any>) {
      state.info = action.payload;
    },
    setToken(state: Draft<UserReducerState>, action: PayloadAction<any>) {
      state.token = action.payload;
    },
    setMyCollection(
      state: Draft<UserReducerState>,
      action: PayloadAction<any>
    ) {
      state.myCollections = initCollectionItems.concat([...action.payload]);
    },
    setMyTokens(state: Draft<UserReducerState>, action: PayloadAction<any>) {
      state.myTokens = action.payload;
    },
  },
});

export const { reducer, actions } = userSlice;
export { reducer as userReducer };

// Actions

export const {
  setUserWalletAddress,
  setUserWalletBalance,
  setUserWalletPumlx,
  setToken,
  setMyInfo,
  setMyCollection,
  setMyTokens,
} = actions;

export const signInWithWallet = (payload: any) => async (dispatch: any) => {
  try {
    await UserController.signInWithWallet(payload).then((res) => {
      if (res.token) {
        Storage.setAuthToken(res.token);
        dispatch(setToken(res.token));
      }
    });
  } catch (e) {}
};

export const getWalletBalance = () => async (dispatch: any) => {
  try {
    let balance = await EthUtil.getBalance();
    if (balance) {
      dispatch(setUserWalletBalance(balance));
    }
  } catch (e) {}
};

export const getWalletPumlx = () => async (dispatch: any) => {
  try {
    let pumlx = await SmartContract.balanceCustomToken(configs.PUML20_ADDRESS);
    if (pumlx) {
      dispatch(setUserWalletPumlx(pumlx));
    }
  } catch (e) {}
};

export const loadMyCollections = () => async (dispatch: any) => {
  try {
    const collections = await CollectionController.getMyCollections();
    if (collections) {
      dispatch(setMyCollection(collections));
    }
  } catch (e) {}
};

export const disconnectUserWallet = () => (dispatch: any) => {
  try {
    Storage.clearAuthToken();
    dispatch(setToken(null));
    Storage.clearNetworkID();
    dispatch(setUserWalletAddress(""));
    dispatch(setUserWalletBalance("0"));
  } catch (e) {}
};

export const connectUserWallet = () => async (dispatch: any) => {
  try {
    let cachedWallet = Storage.get(configs.STORAGE.SELECTED_WALLET);
    const walletSelected = cachedWallet
      ? await onboard.walletSelect(cachedWallet)
      : await onboard.walletSelect();
    if (walletSelected) {
      const walletCheck = await onboard.walletCheck();
      if (walletCheck) {
        const currentState = onboard.getState();
        const wallet = currentState.wallet
        if (currentState.address) {
          Storage.set(configs.STORAGE.SELECTED_NETWORK, currentState.network);
          Storage.set(configs.STORAGE.SELECTED_WALLET, wallet.name);
          dispatch(setUserWalletAddress(currentState.address));
          dispatch(getWalletBalance());
        }
      }
    }
  } catch (e) {}
};

export const switchNetwork = async (net: number) => {
  try {
    await web3.currentProvider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${net.toString(16)}` }],
    });
    Storage.set(configs.STORAGE.SELECTED_NETWORK, `${net}`);
  } catch (err : any) {
    if (err && net === configs.ONBOARD_POLYGON_ID) {
      if (err.code === 4902) {
        try {
          await web3.currentProvider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${net.toString(16)}`,
                chainName: "Polygon Matic Network",
                rpcUrls: [`${configs.POLYGON_RPC_URL}`],
                nativeCurrency: {
                  name: "Matic",
                  symbol: "Matic",
                  decimals: 18,
                },
                blockExplorerUrls: [`${configs.POLYGON_BLOCK_EXPLORER}`],
              },
            ],
          });
        } catch (error : any) {
          alert(error && error.message);
        }
      }
    }
    if (err && net === configs.ONBOARD_NETWORK_ID) {
      if (err.code === 4902) {
        try {
          await web3.currentProvider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${net.toString(16)}`,
                chainName: "Rinkeby Test Network",
                rpcUrls: [`${configs.RPC_URL}`],
                nativeCurrency: {
                  name: "ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                blockExplorerUrls: [`${configs.BLOCK_EXPLORER}`],
              },
            ],
          });
        } catch (error : any) {
          alert(error && error.message);
        }
      }
    }
  }
}

export const getMyInfo = (payload: string) => async (dispatch: any) => {
  try {
    const { user } = await UserController.userStats(payload);
    dispatch(setMyInfo(user));
  } catch (e) {}
};