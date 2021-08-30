import React from "react";
import { Navbar, Nav, Image, NavDropdown, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store/hooks";

import logoImg from "assets/imgs/logo.svg";
import avatarImg from "assets/imgs/avatar.png";
import configs from "configs";

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
} from "store/User/user.selector";

interface HeaderProps { }

const Header: React.FC<HeaderProps> = () => {

  const location = useLocation();
  const userInfo = useAppSelector(getMyInfo);

  const getDropdownAvatar = () => {
    return (
      <div className="header-avatar d-flex flex-row align-items-center">
        <Image
          src={
            userInfo.avatar
              ? `${configs.DEPLOY_URL}${userInfo.avatar}`
              : avatarImg
          }
        ></Image>
        <div className="ml-2">
          <NormalTextTitle className="text-primary">Balance</NormalTextTitle>
          <SmallTextTitleGrey>30.000PUML</SmallTextTitleGrey>
        </div>
      </div>
    );
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
            <Nav.Item className="d-flex pr-4 buttons">
                <NavDropdown
                  title={getDropdownAvatar()}
                  id="header-nav-dropdown"
                  alignRight={true}
                >
                  <div className="px-4">
                    {userInfo && userInfo.name && (
                      <B1NormalTextTitle className="mb-2 mt-1">
                        {userInfo.name}
                      </B1NormalTextTitle>
                    )}
                    <FlexAlignCenterDiv>
                      <div className="ml-2">
                        <NormalTextTitle>Balance</NormalTextTitle>
                        <SmallTextTitleGrey>10000 ETH</SmallTextTitleGrey>
                      </div>
                    </FlexAlignCenterDiv>
                  </div>

                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/items">
                    My Items
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/profile">
                    Edit Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    Disconnect
                  </NavDropdown.Item>
                </NavDropdown>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
