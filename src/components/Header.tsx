import React from "react";
import { Navbar, Nav, Image } from "react-bootstrap";

import { Link, useLocation } from "react-router-dom";

import logoImg from "assets/imgs/logo.png";
import avatarImg from "assets/imgs/avatar.png";

interface HeaderProps { }

const Header: React.FC<HeaderProps> = () => {

  const location = useLocation();

  return (
    <div className="header-container">
      <Navbar>
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <span />
          <span />
          <span />
          <span />
        </Navbar.Toggle>
        <Navbar.Brand as={Link} to="/" className="navbar-brand">
          <Image className="logo" src={logoImg} alt="logo" />
        </Navbar.Brand>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Item >
              <Nav.Link
                eventKey="1"
                as={Link}
                to="/home"
                className="mr-lg-4"
                active={
                  location.pathname === "/home" || location.pathname === "/"
                }
              >
                Home
              </Nav.Link>
            </Nav.Item>

            <Nav.Item >
              <Nav.Link
                eventKey="2"
                as={Link}
                to="/how-it-works"
                className="mr-lg-4"
                active={
                  location.pathname === "/how-it-works"
                }
              >
                How it works
              </Nav.Link>
            </Nav.Item>

            <Nav.Item className="d-none d-md-block">
              <Image className="user-avatar" src={avatarImg}></Image>
            </Nav.Item>

            <Nav.Item className="d-none d-md-block">
              <div className="user-info">
                <span>Damien King</span>
                <span className="user-balance">30.000PUML</span>
              </div>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
