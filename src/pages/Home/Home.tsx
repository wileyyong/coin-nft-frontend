/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState } from "react";
import Layout from "components/Layout";
import { Button, Image, Container, Row, Col } from "react-bootstrap";

import pumlImage from "assets/imgs/PUML-Logo.png";
import homeintroImage from "assets/imgs/home-intro.svg";
import metamaskImage from "assets/imgs/meta-logo.png";
import lightImage from "assets/imgs/light.png";
import ticketImage from "assets/imgs/ticket.png";

import NftItemCard from "components/common/NftItemCard";
import HotCard from "components/common/HotCard";

import sellerdata from "assets/sellerdata";
import nftlist from "assets/nftlist";
import hotlist from "assets/hotlist";
import Modal from 'react-bootstrap/Modal'

interface HomeProps { }

const Home: React.FC<HomeProps> = () => {
  const layoutView = useRef(null);

  const [showDialog, setShowDialog] = useState(false);

  const handleClose = () => setShowDialog(false);
  const handleShow = () => setShowDialog(true);

  return (
    <Layout className="home-container" ref={layoutView}>
      <div className="section-intro">
        <div className="intro-content text-center text-md-left">
          <p className="intro-title pb-0">PUML NFT </p>
          <p className="intro-type">Market Place</p>
          <div className="intro-desc pt-4">Custom-made characters that will transition to the assets expanded ecosystem <br></br>(media, content, and games)</div>
          <div className="intro-connect-btnGroup pt-4">
            <div className="intro-btn-wallet pb-3">
              <Button className="mr-2 mr-lg-4 btn-primary" onClick={handleShow}>
                <div className="d-flex flex-row align-items-center">
                  <Image className="connect-img" src={pumlImage}></Image>
                  <span>Connect PUML Wallet</span>
                </div>
              </Button>
            </div>
            <div className="intro-btn-metamask">
              <Button className="mr-2 mr-lg-4 btn-outline-secondary">
                <div className="d-flex flex-row align-items-center">
                  <Image className="connect-img p-1" src={metamaskImage}></Image>
                  <span>Connect with Meta Mask</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
        <Image className="intro-image" src={homeintroImage}></Image>
        <div className="intro-ticket">
          <Image className="ticket-img" src={ticketImage} alt="ticket"></Image>
          <div className="d-flex flex-column align-items-center ticket-content">
            <div className="title">Christian Trist</div>
            <div className="price">$30.000.00PUML</div>
          </div>
        </div>
      </div>
      <div className="section">
        <h1 className="font-weight-bold section-title">Top Sellers</h1>
        <div className="row text-center">
          {
            sellerdata.map((seller, index) => (
              <div key={index} className="col-sm-6 col-md-4 col-lg-3 col-xl-2 seller-segment pb-4">
                <Image src={seller.img} alt="seller"></Image>
                <div className="seg-name pt-2">{seller.name}</div>
                <div className="seg-type pt-2">{seller.type}</div>
                <div className="seg-price pt-2">{seller.price} PUML</div>
                <div className="seg-price-eth pt-2">{seller.price_eth}</div>
              </div>
            ))
          }
        </div>
      </div>
      <div className="section">
        <h1 className="font-weight-bold section-title">Hot Bids</h1>
        <div className="row pr-2 pl-2">
          {
            nftlist.map((nft, index) => (
              <NftItemCard key={index} url={nft.url} title={nft.title} price={nft.price} price_eth={nft.price_eth} content={nft.content}></NftItemCard>
            ))
          }
        </div>
      </div>
      <div className="section">
        <h1 className="font-weight-bold section-title">Hot Collections</h1>
        <div className="row pr-2 pl-2">
          {
            hotlist.map((hot, index) => (
              <HotCard key={index} backurl={hot.backurl} imgurl={hot.imgurl} title={hot.title} type={hot.type}></HotCard>
            ))
          }
        </div>
      </div>
      <div className="section">
        <div className="d-flex flex-row align-items-center flex-wrap justify-center">
          <h1 className="font-weight-bold section-title mr-4">Explore</h1>
          <div className="d-flex flex-row flex-wrap justify-center">
            <Button className="btn-type mr-3 mb-2">All</Button>
            <Button className="btn-type mr-3 mb-2">Art</Button>
            <Button className="btn-type mr-3 mb-2">Photography</Button>
            <Button className="btn-type mr-3 mb-2">Games</Button>
            <Button className="btn-type mr-3 mb-2">Music</Button>
            <Button className="btn-type mr-3 mb-2">Domains</Button>
          </div>
        </div>
        <div className="row pr-2 pl-2">
          {
            nftlist.map((nft, index) => (
              <NftItemCard key={index} url={nft.url} title={nft.title} price={nft.price} price_eth={nft.price_eth} content={nft.content}></NftItemCard>
            ))
          }
        </div>
        <div className="row pr-2 pl-2">
          {
            nftlist.map((nft, index) => (
              <NftItemCard key={index} url={nft.url} title={nft.title} price={nft.price} price_eth={nft.price_eth} content={nft.content}></NftItemCard>
            ))
          }
        </div>
      </div>

      {/* <Modal
        show={showDialog}
        onHide={handleClose}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Using Grid in Modal
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="show-grid">
          <Container>
            <Row>
              <Col xs={12}>
                <div className="modal-title">Your Wallet</div>
              </Col>
            </Row>

            <Row>
              <Col xs={6} md={4}>
                .col-xs-6 .col-md-4
              </Col>
              <Col xs={6} md={4}>
                .col-xs-6 .col-md-4
              </Col>
              <Col xs={6} md={4}>
                .col-xs-6 .col-md-4
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal > */}
    </Layout >
  );
};

export default Home;
