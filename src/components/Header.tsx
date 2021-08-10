import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  Image,
  Nav,
  Navbar,
  NavDropdown,
} from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { onboard } from "ethereum/OnBoard";
import { Link, useLocation, useHistory } from "react-router-dom";
import { FaEthereum } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "store/hooks";
import ConnectWalletBtn from "./common/button/ConnectWalletBtn";
import {
  B1NormalTextTitle,
  FlexAlignCenterDiv,
  NormalTextTitle,
  SmallTextTitleGrey,
} from "./common/common.styles";
import {
  disconnectUserWallet,
  setSearchKeyValue,
} from "store/User/user.slice";
import imgAvatar from "assets/imgs/avatar.svg";
// import logoImg from "assets/imgs/logo.png";

import {
  getSearchKey,
  getWalletAddress,
  getWalletBalance,
  isAuthenticated
} from "store/User/user.selector";
import { AiOutlineClose } from "react-icons/ai";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const history = useHistory();
  const searchKeyValue = useAppSelector(getSearchKey);
  const walletAddress = useAppSelector(getWalletAddress);
  const balance = useAppSelector(getWalletBalance);
  const isAuth = useAppSelector(isAuthenticated);
  const dispatch = useAppDispatch();
  const [searchKey, setSearchKeyword] = useState("");
  const location = useLocation();

  const handleChange = (e: any) => {
    setSearchKeyword(e.target.value);
  };
  const onKeyDown = (e: any) => {
    if (e.charCode === 13) {
      onSearch();
    }
  };

  const onSearch = () => {
    dispatch(setSearchKeyValue(searchKey));
    history.push("/search");
  };

  const getDropdownAvatar = () => {
    return (
      <div className="header-avatar">
        <Image
          src={imgAvatar}
        ></Image>
      </div>
    );
  };

  const disConnect = () => {
    onboard.walletReset();
    dispatch(disconnectUserWallet());
    document.querySelector(".navbar-collapse")?.classList.remove("show");
    document.querySelector(".navbar-toggler")?.classList.add("collapsed");
  };

  useEffect(() => {
    if (location.pathname === '/search') {
      setSearchKeyword(searchKeyValue);
    } else {
      setSearchKeyword('');
    }
  }, [searchKeyValue, location.pathname]);

  const onDisplaySearch = () => {
    let element = document.querySelector('.layout.search');
    if (element) {
      document.getElementById('layout')?.classList.remove('search');
    } else {
      document.getElementById('layout')?.classList.add('search');
      document.querySelector(".navbar-collapse")?.classList.remove("show");
      document.querySelector(".navbar-toggler")?.classList.add("collapsed");
      onSearch();
    }
  }

  const onClearSearchKey = () => {
    setSearchKeyword('');
    dispatch(setSearchKeyValue(''));
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
          {/* <img className="logo" src={logoImg} alt="logo" /> */}
          LOGO
        </Navbar.Brand>
        <FlexAlignCenterDiv className="header-search-form ml-0 ml-xl-3">
          <FaSearch className="search-icon" style={{ cursor: "pointer" }} onClick={() => onDisplaySearch()} />
          <FormControl
            type="text"
            placeholder="Search by creator..."
            className="ml-sm-2"
            value={searchKey}
            onChange={(e) => handleChange(e)}
            onKeyPress={(e?: any) => onKeyDown(e)}
          />
          {
            searchKey && (
              <AiOutlineClose className="clear-icon pointer-cursor" onClick={() => onClearSearchKey()} />
            )
          }
        </FlexAlignCenterDiv>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Item>
              <Nav.Link
                eventKey="1"
                as={Link}
                to="/explore"
                className="mr-lg-3"
                active={
                  location.pathname === "/explore" || location.pathname === "/"
                }
              >
                Explore
              </Nav.Link>
            </Nav.Item>
            {walletAddress && isAuth && (
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
            )}

            {walletAddress && isAuth && (
              <Nav.Item>
                <Nav.Link
                  eventKey="3"
                  as={Link}
                  to="/activity"
                  className="mr-lg-4"
                  active={location.pathname === "/activity"}
                >
                  Activity
                </Nav.Link>
              </Nav.Item>
            )}
            <Nav.Item className="d-flex buttons">
              <Link to="/collectible">
                <Button className="mr-2 mr-lg-4 fill-btn">
                  <span>Create NFT</span>
                </Button>
              </Link>
              {walletAddress && isAuth ? (
                <NavDropdown
                  title={getDropdownAvatar()}
                  id="header-nav-dropdown"
                  alignRight={true}
                >
                  <div className="px-4">
                    <B1NormalTextTitle className="mb-2 mt-1">
                      Username
                    </B1NormalTextTitle>
                    <FlexAlignCenterDiv>
                      <FaEthereum size={22}></FaEthereum>
                      <div className="ml-2">
                        <NormalTextTitle>Balance</NormalTextTitle>
                        <SmallTextTitleGrey>{balance} ETH</SmallTextTitleGrey>
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
                  <NavDropdown.Item onClick={disConnect}>
                    Disconnect
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <ConnectWalletBtn />
              )}
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
