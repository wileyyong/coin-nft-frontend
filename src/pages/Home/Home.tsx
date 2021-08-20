/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef } from "react";
import Layout from "components/Layout";
import { Button, Image } from "react-bootstrap";

import pumlImage from "assets/imgs/PUML-Logo.png";
import homeintroImage from "assets/imgs/home-intro.svg";
import metamaskImage from "assets/imgs/meta-logo.png";
import lightImage from "assets/imgs/light.png";

import NftCard from "components/common/NftCard";

import sellerdata from "assets/sellerdata";
import nftlist from "assets/nftlist";
import hotlist from "assets/hotlist";
import HotCard from "components/common/HotCard";

interface HomeProps { }

const Home: React.FC<HomeProps> = () => {
  const layoutView = useRef(null);

  return (
    <Layout className="home-container" ref={layoutView}>
      <div className="section-intro">
        <div className="intro-content text-center text-md-left">
          <div className="intro-title">PUML NFT</div>
          <div className="intro-type">Market Place</div>
          <div className="intro-desc pt-2">Custom-made characters that will transition to the assets expanded ecosystem (media, content, and games)</div>
          <div className="intro-connect-btnGroup pt-4">
            <div className="intro-btn-wallet pb-3">
              <Button className="mr-2 mr-lg-4 btn-primary">
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
      </div>
      <div className="section">
        <h1 className="font-weight-bold section-title">Top Sellers</h1>
        <div className="row text-center">
          {
            sellerdata.map((seller, index) => (
              <div key={index} className="col-sm-6 col-md-4 col-lg-3 col-xl-2 seller-segment p-0">
                <Image src={seller.img} alt="seller"></Image>
                <div className="seg-name">{seller.name}</div>
                <div className="seg-type">{seller.type}</div>
                <div className="seg-price">{seller.price} PUML</div>
              </div>
            ))
          }
        </div>
      </div>
      <div className="section">
        <h1 className="font-weight-bold section-title">Hot Bids</h1>
        <div className="d-flex flex-row hot-bids">
          {
            nftlist.map((nft, index) => (
              <NftCard key={index} url={nft.url} title={nft.title} price={nft.price} content={nft.content} style={nft.style}></NftCard>
            ))
          }
          <Image className="hot-light" src={lightImage} alt="light"></Image>
        </div>
      </div>
      <div className="section">
        <h1 className="font-weight-bold section-title">Hot Collections</h1>
        <div className="d-flex flex-row">
          {
            hotlist.map((hot, index) => (
              <HotCard key={index} backurl={hot.backurl} imgurl={hot.imgurl} title={hot.title} type={hot.type}></HotCard>
            ))
          }
        </div>
      </div>
      <div className="section">
        <div className="d-flex flex-row align-items-center">
          <h1 className="font-weight-bold section-title pr-4">Explorer</h1>
          <Button className="btn-type mr-3">All</Button>
          <Button className="btn-type mr-3">Art</Button>
          <Button className="btn-type mr-3">Photography</Button>
          <Button className="btn-type mr-3">Games</Button>
          <Button className="btn-type mr-3">Music</Button>
          <Button className="btn-type mr-3">Domains</Button>
        </div>
        <div className="d-flex flex-row hot-bids">
          {
            nftlist.map((nft, index) => (
              <NftCard key={index} url={nft.url} title={nft.title} price={nft.price} content={nft.content} style={nft.style}></NftCard>
            ))
          }
        </div>
      </div>
    </Layout>
  );
};

export default Home;
