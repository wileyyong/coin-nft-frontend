import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { connectUserWallet } from "store/User/user.slice";
import { getWalletAddress, isAuthenticated } from "store/User/user.selector";

import Home from "./pages/Home/Home";
import MyItems from "./pages/MyItems";
import EditProfile from "./pages/EditProfile";
import BuyItem from "./pages/BuyItem";
import UserProfile from "./pages/UserProfile";
import CreateCollectible from "./pages/CreateCollectible";

import "./styles/index.scss";
import { getETHUSDTCurrency } from "store/Nft/nft.slice";

interface AppProps { }

const App: React.FC<AppProps> = () => {
  const dispatch = useAppDispatch();
  const walletAddress = useAppSelector(getWalletAddress);
  const isAuth = useAppSelector(isAuthenticated);
  useEffect(() => {
    if (!isAuth || !walletAddress) {
      dispatch(connectUserWallet());
    }
    dispatch(getETHUSDTCurrency());
  }, [dispatch, isAuth, walletAddress]);

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
          <Route exact path="/buy">
            <BuyItem />
          </Route>
          <Route exact path="/users/:walletAddress">
            <UserProfile />
          </Route>
          <Route path="/create-collectible">
            <CreateCollectible />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
