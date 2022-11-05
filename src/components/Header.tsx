import React, { Fragment, useEffect, useState } from "react";
import { Navbar, Nav, Image, NavDropdown } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { onboard } from "ethereum/OnBoard";
import logoImg from "assets/imgs/logo.svg";
import configs from "configs";
import EthUtil from "ethereum/EthUtil";
import logodarkImg from "assets/imgs/logodark.png";
import Storage from "service/storage";

import PumlIcon from "assets/imgs/puml1.png";
import MoonIcon from "assets/imgs/moon.png";
import SunIcon from "assets/imgs/sun.png";

import { disconnectUserWallet, connectUserWallet } from "store/User/user.slice";
import { SmallTextTitleGrey } from "./common/common.styles";

import {
  getWalletAddress,
  getWalletBalance,
  isAuthenticated,
  getWalletPumlx,
  getMyInfo
} from "store/User/user.selector";

import {
  getWalletBalance as walletBalance,
  getWalletPumlx as walletPumlx
} from "store/User/user.slice";
import metaMask from "assets/imgs/MetaMask_Fox.png";
import defaultUser from "assets/imgs/avatar.png";
import ConnectWallet from "components/common/modal/ConnectWalletModal";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const location = useLocation();
  const walletAddress = useAppSelector(getWalletAddress);
  const balance = useAppSelector(getWalletBalance);
  const pumlx = useAppSelector(getWalletPumlx);
  const isAuth = useAppSelector(isAuthenticated);
  const dispatch = useAppDispatch();
  const network = EthUtil.getNetwork();
  const userInfo = useAppSelector(getMyInfo);

  const [wAddress, setAddress] = useState("");
  const [mAvatar, setAvatar] = useState(defaultUser);

  const [theme, setTheme] = useState(
    Storage.get(configs.STORAGE.THEME) || "dark"
  );

  useEffect(() => {
    dispatch(walletPumlx());
    dispatch(walletBalance());
    const getNutAddress = () => {
      const repTxt = walletAddress.substr(5, 33);
      setAddress(walletAddress.replace(repTxt, "..."));
    };
    getNutAddress();
  });

  useEffect(() => {
    if (userInfo.avatar && !userInfo.avatar.includes("default.png")) {
      setAvatar(configs.DEPLOY_URL + userInfo.avatar);
    }
  }, [userInfo]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    Storage.set(configs.STORAGE.THEME, theme);
  }, [theme]);

  const getDropdownAvatar = () => {
    return (
      <div className="header-avatar d-flex flex-row align-items-center">
        <Image className="mr-2" src={mAvatar}></Image>
        <SmallTextTitleGrey
          className="txtTitle"
          style={{ fontFamily: "ProximaNova-bold" }}
        >
          {userInfo.name}
        </SmallTextTitleGrey>
      </div>
    );
  };

  const disConnect = () => {
    onboard.walletReset();
    dispatch(disconnectUserWallet());
    document.querySelector(".navbar-collapse")?.classList.remove("show");
    document.querySelector(".navbar-toggler")?.classList.add("collapsed");
  };

  const connectMetaMask = () => {
    dispatch(connectUserWallet());
  };

  const getPriceType = () => {
    if (network) {
      switch (network) {
        case 1:
        case 4:
          return "ETH";
        case 137:
        case 80001:
          return "MATIC";
        case 56:
        case 97:
          return "BNB";
        default:
          return "ETH";
      }
    } else {
      return "ETH";
    }
  };

  return (
    <div className="header-container">
      <Navbar>
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <span />
          <span />
          <span />
          <span />
        </Navbar.Toggle>
        <Navbar.Brand as={Link} to="/">
          {theme === "" ? (
            <img className="logo" src={logoImg} alt="logo" />
          ) : (
            <img className="logo" src={logodarkImg} alt="logo" />
          )}
        </Navbar.Brand>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Nav.Item>
              <Nav.Link
                eventKey="1"
                as={Link}
                to="/"
                className="mr-lg-3"
                active={location.pathname === "/"}
              >
                Move to Earn
              </Nav.Link>
            </Nav.Item>

            <Fragment>
              <Nav.Item>
                <Nav.Link
                  eventKey="1"
                  as={Link}
                  to="/stake"
                  className="mr-lg-3"
                  active={location.pathname === "/stake"}
                >
                  Stake to Earn
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="1"
                  as={Link}
                  to="/buy"
                  className="mr-lg-3"
                  active={location.pathname === "/buy"}
                >
                  Buy Athelete NFT’s
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="2"
                  as={Link}
                  to="/items"
                  className="mr-lg-3"
                  active={location.pathname === "/items"}
                >
                  My NFTs
                </Nav.Link>
              </Nav.Item>
            </Fragment>
          </Nav>

          <Nav className="ml-auto">
            {/*<Fragment>
              <Nav.Item className="b-nav mr-2 pt-2">
                {theme === "white" ? (
                  <Image
                    className="themeicon"
                    src={MoonIcon}
                    width="30"
                    alt="moon"
                    onClick={() => {
                      setTheme("dark");
                    }}
                  />
                ) : (
                  <Image
                    className="themeicon"
                    src={SunIcon}
                    width="30"
                    alt="sun"
                    onClick={() => {
                      setTheme("white");
                    }}
                  />
                )}
              </Nav.Item>
                </Fragment>*/}
            {isAuth && walletAddress ? (
              <Fragment>
                {walletAddress === configs.ADMIN_ADDRESS.toLowerCase() && (
                  <Nav.Item>
                    <Nav.Link
                      eventKey="3"
                      as={Link}
                      to="/create-collectible"
                      className="mr-lg-3 mt-1"
                      active={location.pathname === "/create-collectible"}
                    >
                      Create NFT
                    </Nav.Link>
                  </Nav.Item>
                )}

                {getPriceType() === "ETH" && (
                  <Nav.Item className="b-nav">
                    <Image src={PumlIcon} width="40" className="mr-2" />
                    <SmallTextTitleGrey className="txtTitle">
                      {parseFloat(pumlx).toFixed(2)}
                    </SmallTextTitleGrey>
                  </Nav.Item>
                )}
                <Nav.Item className="header-avatar d-flex flex-row align-items-center b-nav ml-2">
                  <Image className="mr-2" src={metaMask}></Image>
                  <SmallTextTitleGrey className="txtTitle">
                    {parseFloat(balance).toFixed(2)} {getPriceType()}
                  </SmallTextTitleGrey>
                  <SmallTextTitleGrey className="ml-1 address txtTitle">
                    {wAddress}
                  </SmallTextTitleGrey>
                </Nav.Item>
                <Nav.Item className="d-flex mr-4 buttons ml-2">
                  <NavDropdown
                    title={getDropdownAvatar()}
                    id="header-nav-dropdown"
                    alignRight={true}
                  >
                    <NavDropdown.Item as={Link} to="/profile">
                      Edit Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={disConnect}>
                      Disconnect
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav.Item>
              </Fragment>
            ) : (
              <Fragment>
                <button
                  className="connect-wallet"
                  onClick={() => connectMetaMask()}
                >
                  Connect Wallet
                </button>
              </Fragment>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
