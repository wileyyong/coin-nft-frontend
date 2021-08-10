import { Button, Row, Col, Form, FormControl } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  MidTextTitle,
  NormalTextTitle,
  DivideLine,
  SocialIcon,
  FlexJustifyBetweenDiv
} from "./common/common.styles";
import { FaInstagram,FaTwitter,FaYoutube,FaDribbble  } from "react-icons/fa";

const Footer = () => {
  const languages = [
    {
      value: "eng",
      label: "English",
    },
    {
      value: "fr",
      label: "French",
    },
  ];
  return (
    <footer className="footer-container">
      <div className="px-xl-5">
        <Row className="pb-3 pb-md-5">
          <Col lg="4">
            <MidTextTitle>Get the latest updates</MidTextTitle>
            <Form className="mt-4 d-flex align-items-center mb-3">
              <FormControl type="text" placeholder="Your e-mail" />
              <Button className="default-btn-size fill-btn">
                <span>Sent</span>
              </Button>
            </Form>
          </Col>
          <Col lg="4" md="6" className="d-flex justify-content-between">
            <div className="mr-md-7 mb-3">
              <NormalTextTitle className="mb-2">EXPLORE</NormalTextTitle>
              <Link to="/">Explore</Link>
              <Link to="/">How it works</Link>
              <Link to="/">Create</Link>
              <Link to="/">Support</Link>
            </div>
            <div className="mb-3">
              <NormalTextTitle className="mb-2">ACTIVITY</NormalTextTitle>
              <Link to="/">Token</Link>
              <Link to="/">Discussion</Link>
              <Link to="/">Voting </Link>
              <Link to="/">Suggest feature</Link>
            </div>
          </Col>
          <Col lg="4" md="6">
            <MidTextTitle>Language</MidTextTitle>
            <Form.Control as="select" className="mt-4">
              {languages.map((lng, index) => {
                return <option value={lng.value} key={index}>{lng.label}</option>;
              })}
            </Form.Control>
          </Col>
        </Row>
        <DivideLine></DivideLine>
        <FlexJustifyBetweenDiv className="mt-4 flex-wrap">
          <div className="d-flex align-items-center mb-3 mx-auto mx-md-0">
            <span className="mr-4 mr-md-7">All rights reserved</span>
            <Link to="/" className="mr-4 mt-0">
              Terms
            </Link>
            <Link className="mt-0 mr-4" to="/">Privacy</Link>
          </div>
          <div className="d-flex mx-auto mx-md-0">
              <SocialIcon className="mr-3">
                <a href="https://instagram.com" target="_blank" rel="noreferrer">
                  <FaInstagram color="white" />
                </a>
              </SocialIcon>
              <SocialIcon className="mr-3">
                <a href="https://dribbble.com/" target="_blank" rel="noreferrer">
                  <FaDribbble color="white"></FaDribbble>
                </a>
              </SocialIcon>
              <SocialIcon className="mr-3">
                <a href="https://twitter.com/" target="_blank" rel="noreferrer">
                  <FaTwitter color="white"></FaTwitter>
                </a>
              </SocialIcon>
              <SocialIcon className="mr-3">
                <a href="https://youtube.com/" target="_blank" rel="noreferrer">
                  <FaYoutube color="white"></FaYoutube>
                </a>
              </SocialIcon>
          </div>
        </FlexJustifyBetweenDiv>
      </div>
    </footer>
  );
};

export default Footer;
