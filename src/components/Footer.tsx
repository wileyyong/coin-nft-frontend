import { Image } from "react-bootstrap";

// import logo from "assets/imgs/logo.svg";
import image1 from "assets/imgs/path.png";
import image2 from "assets/imgs/twitter.png";
import image3 from "assets/imgs/youtube.png";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div>
        <div className="d-flex align-items-center justify-content-center footer-top">
          <div className="logo-image"></div>
        </div>
        <div className="d-flex flex-wrap justify-content-center">
          <div className="item-content font-weight-bold">Top Sellers</div>
          <div className="item-content font-weight-bold">Hot Collections</div>
          <div className="item-content font-weight-bold">Explore</div>
          <div className="item-content font-weight-bold">Privacy Policy</div>
          <div className="item-content font-weight-bold">Terms and Condtions</div>
        </div>
        <hr className="divider" />

        <div className="d-flex footer-bottom justify-content-between align-items-center">
          <div className="pb-2">© 2021 PUML All rights reserved</div>
          <div>
            <Image className="link-img mr-4" src={image1} alt="alt"></Image>
            <Image className="link-img mr-4" src={image2} alt="alt"></Image>
            <Image className="link-img mr-4" src={image3} alt="alt"></Image>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
