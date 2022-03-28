import React, { Fragment, useEffect, useState } from "react";
import { Navbar, Nav, Image, NavDropdown } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { onboard } from "ethereum/OnBoard";
import logoImg from "assets/imgs/logo.svg";
import configs from "configs";
import EthUtil from 'ethereum/EthUtil';

import PumlIcon from "assets/imgs/puml1.png";
import {
  disconnectUserWallet
} from "store/User/user.slice";
import { SmallTextTitleGrey } from "./common/common.styles";

import {
  getWalletAddress,
  getWalletBalance,
  isAuthenticated,
  getWalletPumlx,
} from "store/User/user.selector";

import { getWalletBalance as walletBalance, getWalletPumlx as walletPumlx } from "store/User/user.slice";
import metaMask from "assets/imgs/MetaMask_Fox.png";

interface HeaderProps { }

const Header: React.FC<HeaderProps> = () => {

  const location = useLocation();
  const walletAddress = useAppSelector(getWalletAddress);
  const balance = useAppSelector(getWalletBalance);
  const pumlx = useAppSelector(getWalletPumlx);
  const isAuth = useAppSelector(isAuthenticated);
  const dispatch = useAppDispatch();
  const network = EthUtil.getNetwork();

  const [wAddress, setAddress] = useState('');

  useEffect(() => {
    dispatch(walletPumlx());
    dispatch(walletBalance());
    const getNutAddress = () => {
      const repTxt = walletAddress.substr(5, 33);
      setAddress(walletAddress.replace(repTxt, "..."));
    }
    getNutAddress();
  });

  const getDropdownAvatar = () => {
    return (
      <div className="header-avatar d-flex flex-row align-items-center">
        <Image className="mr-2" src={metaMask}></Image>
        <SmallTextTitleGrey className="txtTitle">{parseFloat(balance).toFixed(2)} {getPriceType()}</SmallTextTitleGrey>
        <SmallTextTitleGrey className="ml-1 address txtTitle">{wAddress}</SmallTextTitleGrey>
      </div>
    );
  };

  const disConnect = () => {
    onboard.walletReset();
    dispatch(disconnectUserWallet());
    document.querySelector(".navbar-collapse")?.classList.remove("show");
    document.querySelector(".navbar-toggler")?.classList.add("collapsed");
  };

  const getPriceType = () => {
    if (network) {
      switch (network) {
        case 1:
        case 4:
          return 'ETH';
        case 137:
        case 80001:
          return 'MATIC';
        case 56:
        case 97:
          return 'BNB';
        default:
          return 'ETH'
      }
    } else {
      return 'ETH';
    }
  }

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
          <img className="logo" src={logoImg} alt="logo" />
        </Navbar.Brand>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Nav.Item>
              <Nav.Link
                eventKey="1"
                as={Link}
                to="/"
                className="mr-lg-3"
                active={
                  location.pathname === "/home" || location.pathname === "/"
                }
              >
                Home
              </Nav.Link>
            </Nav.Item>
            {isAuth && walletAddress && (
              <Fragment>
                <Nav.Item>
                  <Nav.Link
                    eventKey="2"
                    as={Link}
                    to="/items"
                    className="mr-lg-3"
                    active={location.pathname === "/items"}
                  >
                    My Items
                  </Nav.Link>
                </Nav.Item>
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
                    to="/move"
                    className="mr-lg-3"
                    active={location.pathname === "/move"}
                  >
                    Move to Earn
                  </Nav.Link>
                </Nav.Item>
              </Fragment>
            )}
          </Nav>
          <Nav className="ml-auto">
            {isAuth && walletAddress && (
              <Fragment>
                {
                  walletAddress === configs.ADMIN_ADDRESS.toLowerCase() && (
                    <Nav.Item>
                      <Nav.Link
                        eventKey="3"
                        as={Link}
                        to="/create-collectible"
                        className="mr-lg-3"
                        active={location.pathname === "/create-collectible"}
                      >
                        Create NFT
                      </Nav.Link>
                    </Nav.Item>
                  )
                }
                {getPriceType() === 'ETH' && (
                  <Nav.Item className="b-nav">
                    <Image src={PumlIcon} width="40" className='mr-2' />
                    <SmallTextTitleGrey className="txtTitle">{parseFloat(pumlx).toFixed(2)}</SmallTextTitleGrey>
                  </Nav.Item>
                )}
                <Nav.Item className="d-flex mr-4 buttons ml-2 b-nav">
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
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
