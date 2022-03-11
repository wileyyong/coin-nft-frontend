import React, { Fragment, useEffect } from "react";
import { Navbar, Nav, Image, NavDropdown } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { onboard } from "ethereum/OnBoard";
import logoImg from "assets/imgs/logo.svg";
import configs from "configs";
import EthUtil from 'ethereum/EthUtil';
import EthereumIcon from "assets/imgs/ethereum.svg";
import PolygonIcon from "assets/imgs/polygon-matic.svg";
import PumlIcon from "assets/imgs/puml.png";
import {
  disconnectUserWallet
} from "store/User/user.slice";
import {
  B1NormalTextTitle,
  FlexAlignCenterDiv,
  NormalTextTitle,
  SmallTextTitleGrey,
} from "./common/common.styles";

import {
  getWalletAddress,
  getWalletBalance,
  isAuthenticated,
  getMyInfo,
  getWalletPumlx,
} from "store/User/user.selector";

import { getWalletBalance as walletBalance, getWalletPumlx as walletPumlx } from "store/User/user.slice";
import imgAvatar from "assets/imgs/avatar.png";

interface HeaderProps { }

const Header: React.FC<HeaderProps> = () => {

  const location = useLocation();
  const walletAddress = useAppSelector(getWalletAddress);
  const balance = useAppSelector(getWalletBalance);
  const pumlx = useAppSelector(getWalletPumlx);
  const isAuth = useAppSelector(isAuthenticated);
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(getMyInfo);
  const network = EthUtil.getNetwork();

  useEffect(() => {
    dispatch(walletPumlx());
    dispatch(walletBalance());
  });

  const getDropdownAvatar = () => {
    return (
      <div className="header-avatar d-flex flex-row align-items-center">
        <Image
          src={
            userInfo.avatar
              ? `${configs.DEPLOY_URL}${userInfo.avatar}`
              : imgAvatar
          }
        ></Image>
        <div className="ml-2">
          <NormalTextTitle className="text-primary">Balance</NormalTextTitle>
          <SmallTextTitleGrey>{balance} {getPriceType()}</SmallTextTitleGrey>
        </div>
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

  const getBlockImage = () => {
    if (network) {
      switch (network) {
        case 1:
        case 4:
          return EthereumIcon;
        case 137:
        case 80001:
          return PolygonIcon;
        case 56:
        case 97:
        default:
          return EthereumIcon;
      }
    } else {
      return EthereumIcon;
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
          <Nav className="ml-auto">
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
                <Nav.Item className="d-flex pr-4 mr-4 buttons">
                  <NavDropdown
                    title={getDropdownAvatar()}
                    id="header-nav-dropdown"
                    alignRight={true}
                  >
                    <div className="px-4">
                      {userInfo && userInfo.name && (
                        <B1NormalTextTitle className="text-black mb-2 mt-1">
                          {userInfo.name}
                        </B1NormalTextTitle>
                      )}
                      <FlexAlignCenterDiv>
                        <Image src={getBlockImage()} width="22" />
                        <div className="ml-1">
                          <NormalTextTitle className="text-black">Balance</NormalTextTitle>
                          <SmallTextTitleGrey>{balance} {getPriceType()}</SmallTextTitleGrey>
                        </div>
                        {getPriceType() === 'ETH' && (
                          <>
                            <Image src={PumlIcon} width="22" className='ml-2' />
                            <div className="ml-1">
                              <NormalTextTitle className="text-black">Balance</NormalTextTitle>
                              <SmallTextTitleGrey>{pumlx} PUML</SmallTextTitleGrey>
                            </div>
                          </>
                        )}
                      </FlexAlignCenterDiv>
                    </div>

                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/items">
                      My Items
                    </NavDropdown.Item>
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
