import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { connectUserWallet, signInWithWallet } from "store/User/user.slice";
import { getWalletAddress, isAuthenticated } from "store/User/user.selector";

import Home from "./pages/Home";
import MyItems from "./pages/MyItems";
import EditProfile from "./pages/EditProfile";
import TokenDetail from "./pages/TokenDetail";
import UserProfile from "./pages/UserProfile";
import CreateCollectible from "./pages/CreateCollectible";
import CollectionDetail from "pages/CollectionDetail";
import Stakes from "./pages/Stakes";
import configs from 'configs';

import "./styles/index.scss";

import { getNftCategories, getETHUSDTCurrency, getMATICUSDTCurrency } from "store/Nft/nft.slice";
import { getMyInfo } from 'store/User/user.slice';

interface AppProps { }
declare let window: any;

const App: React.FC<AppProps> = () => {
  const dispatch = useAppDispatch();
  const walletAddress = useAppSelector(getWalletAddress);
  const isAuth = useAppSelector(isAuthenticated);
  useEffect(() => {
    if (window && window.ethereum && window.ethereum.networkVersion) {
      localStorage.setItem(configs.STORAGE.SELECTED_NETWORK, window.ethereum.networkVersion);
    }
  }, []);
  useEffect(() => {
    if (!isAuth || !walletAddress) {
      dispatch(connectUserWallet());
    }
    dispatch(getMATICUSDTCurrency());
    dispatch(getETHUSDTCurrency());
    dispatch(getNftCategories());
  }, [dispatch, isAuth, walletAddress]);

  useEffect(() => {
    if (walletAddress) {
      dispatch(signInWithWallet({ wallet: walletAddress }));
      dispatch(getMyInfo(walletAddress));
    }
  }, [dispatch, walletAddress]);

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/items">
            <MyItems />
          </Route>
          <Route exact path="/profile">
            <EditProfile />
          </Route>
          <Route exact path="/tokens/:id">
            <TokenDetail />
          </Route>
          <Route exact path="/users/:walletAddress">
            <UserProfile />
          </Route>
          <Route path="/create-collectible">
            <CreateCollectible />
          </Route>
          <Route path="/collections/:id">
            <CollectionDetail />
          </Route>
          <Route exact path="/stake">
            <Stakes />
          </Route>
          <Redirect exact from="/move" to="/" />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
