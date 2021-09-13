import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";
import CategoriesController from "controller/CategoriesController";
import { NftReducerState, NFT_INITIAL_STATE, initCategories } from "./nft.state";
import CurrencyController from "controller/CurrencyController";

export const nftSlice = createSlice({
  name: 'nft',
  initialState: NFT_INITIAL_STATE,
  reducers: {
    setNftServiceFee(state: Draft<NftReducerState>, action: PayloadAction<number>) {
      state.serviceFee = action.payload;
    },
    setCategories(state: Draft<NftReducerState>, action: PayloadAction<any>) {
      const categories: any[] = action.payload;
      state.categories = initCategories.concat([...categories.map((category:any) =>({label: category.name, value: category._id}))])
    },
    setETHUSDTCurrency(state: Draft<NftReducerState>, action: PayloadAction<String>) {
      state.ethUsdTCurrency = action.payload;
    },
  }
});

export const { reducer, actions } = nftSlice;
export { reducer as nftReducer };

// Actions
export const { setNftServiceFee, setCategories, setETHUSDTCurrency } = actions;

export const getNftCategories = () => async (dispatch: any) => {
  try {
    const result = await CategoriesController.getList();
    dispatch(setCategories(result));
  }catch(e) {

  }
}

export const getETHUSDTCurrency = () => async (dispatch: any) => {
  try {
    const data = await CurrencyController.getETHUSDTCurrency();
    if (data && data.price) {
      dispatch(setETHUSDTCurrency(data.price))
    }
  }catch(e){}
}