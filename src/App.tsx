import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { connectUserWallet } from "store/User/user.slice";
import { getWalletAddress, isAuthenticated } from "store/User/user.selector";

import Home from "./pages/Home/Home";
import MyItems from "./pages/MyItems";
import EditProfile from "./pages/EditProfile";

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
          <Route path="/">
            <Home />
          </Route>
          <Route path="/items">
            <MyItems />
          </Route>
          <Route path="/profile">
            <EditProfile />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
