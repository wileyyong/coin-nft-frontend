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
import { onboard } from "ethereum/OnBoard";

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
    }
  },
});

export const { reducer, actions } = userSlice;
export { reducer as userReducer };

// Actions

export const {
  setUserWalletAddress,
  setUserWalletBalance,
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
          Storage.set(configs.STORAGE.SELECTED_WALLET, wallet.name);
          dispatch(setUserWalletAddress(currentState.address));
          dispatch(getWalletBalance());
        }
      }
    }
  } catch (e) {}
};

export const getMyInfo = (payload: string) => async (dispatch: any) => {
  try {
    const { user } = await UserController.userStats(payload);
    dispatch(setMyInfo(user));
  } catch (e) {}
};