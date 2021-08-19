import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";
import { NftReducerState, NFT_INITIAL_STATE } from "./nft.state";
import CurrencyController from "controller/CurrencyController";

export const nftSlice = createSlice({
  name: 'nft',
  initialState: NFT_INITIAL_STATE,
  reducers: {
    setNftServiceFee(state: Draft<NftReducerState>, action: PayloadAction<number>) {
      state.serviceFee = action.payload;
    },
    setETHUSDTCurrency(state: Draft<NftReducerState>, action: PayloadAction<String>) {
      state.ethUsdTCurrency = action.payload;
    },
  }
});

export const { reducer, actions } = nftSlice;
export { reducer as nftReducer };

// Actions
export const { setNftServiceFee, setETHUSDTCurrency } = actions;

export const getETHUSDTCurrency = () => async (dispatch: any) => {
  try {
    const data = await CurrencyController.getETHUSDTCurrency();
    if (data && data.price) {
      dispatch(setETHUSDTCurrency(data.price))
    }
  }catch(e){}
}