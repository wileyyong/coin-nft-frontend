import { combineReducers } from 'redux';
import { userReducer as user } from './User/user.slice';
import { nftReducer as nft } from './Nft/nft.slice';

export const rootReducer = combineReducers({
  user,
  nft
});
