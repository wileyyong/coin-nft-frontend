/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect } from "react";
import Layout from "components/Layout";
import { Button, Image } from "react-bootstrap";

import pumlImage from "assets/imgs/PUML-Logo.png";
import homeintroImage from "assets/imgs/home-intro.svg";
import metamaskImage from "assets/imgs/meta-logo.png";
import ticketImage from "assets/imgs/ticket.png";

import NftItemCard from "components/common/NftItemCard";
import ConnectWallet from "components/common/modal/ConnectWalletModal";
import DepositWallet from "components/common/modal/DepositWalletModal";
import Collections from "components/collection/Collections";
import imageAvatar from "assets/imgs/seller1.png";
import NoItem from "components/common/noItem";

import configs from "configs";

import { useHistory } from 'react-router-dom';
import OfferController from "controller/OfferController";
import UserController from "controller/UserController";

interface HomeProps { }

const Home: React.FC<HomeProps> = () => {
  const layoutView = useRef(null);

  const [showConnectWallet, setShowConnectWallet] = useState(false);
  const connectWalletClose = () => setShowConnectWallet(false);
  const connectWalletShow = () => setShowConnectWallet(true);

  const [showDepositWallet, setShowDepositWallet] = useState(false);
  const depositWalletClose = () => setShowDepositWallet(false);
  const depositWalletShow = () => setShowDepositWallet(true);

  const [exploreAuctions, setExploreAuctions] = useState<any[]>([]);
  const [sellers, setSellers] = useState<any[]>([]);
  const [searchParam, setSearchParam] = useState<any>({
    category: "all",
    sort: "recent",
    verified: false
  })

  useEffect(() => {
    const loadExploreData = async () => {
      let params = {};
      if (searchParam.category === "all") {
        params = { sort: searchParam.sort, verified: false };
      }

      let offers = await OfferController.getList("explore", params);
      setExploreAuctions(offers);
    };

    loadExploreData();
  }, [searchParam]);

  useEffect(() => {
    const loadData = async () => {
      try {
        let items = await UserController.getTopUsers('sellers', "7");
        setSellers(items);
      } catch (err) {
        console.log(err);
      }
    }

    loadData();
  }, [])

  const history = useHistory();

  return (
    <Layout className="home-container" ref={layoutView}>
      <div className="section-intro">
        <div className="intro-content text-center text-md-left">
          <p className="intro-title pb-0">PUML NFT </p>
          <p className="intro-type">Market Place</p>
          <div className="intro-desc pt-4">Custom-made characters that will transition to the assets expanded ecosystem <br></br>(media, content, and games)</div>
          <div className="intro-connect-btnGroup pt-4">
            <div className="intro-btn-wallet pb-3">
              <Button className="mr-2 mr-lg-4 btn-primary" onClick={connectWalletShow}>
                <div className="d-flex flex-row align-items-center">
                  <Image className="connect-img" src={pumlImage}></Image>
                  <span>Connect PUML Wallet</span>
                </div>
              </Button>
            </div>
            <div className="intro-btn-metamask">
              <Button className="mr-2 mr-lg-4 btn-outline-secondary" onClick={depositWalletShow}>
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
        <div className="row text-center justify-content-center">
          {
            sellers.length > 0 ?
              sellers.map((seller, index) => (
                <div key={index} className="col-sm-6 col-md-4 col-lg-3 col-xl-2 seller-segment pb-4" onClick={() => history.push(`/users/${seller.wallet}`)}>
                  <Image src={seller.avatar ? `${configs.DEPLOY_URL}${seller.avatar}` : imageAvatar} alt="seller"></Image>
                  <div className="seg-name pt-2">{seller.name}</div>
                  <div className="seg-type pt-2">{seller.type}</div>
                  <div className="seg-price pt-2">{seller.amount} PUML</div>
                  <div className="seg-price-eth pt-2">{seller.amount}</div>
                </div>
              )
              ) : (
                <NoItem
                  title="No items found"
                  description="Come back soon! Or try to browse something for you on our marketplace"
                  btnLink="/"
                  btnLabel="Browse marketplace"
                />
              )
          }
        </div>
      </div>
      <div className="section">
        <h1 className="font-weight-bold section-title">Hot Bids</h1>
        <div className="row pr-2 pl-2 justify-content-center">
          {
            exploreAuctions.length > 0 ?
              exploreAuctions.map((auction, index) => (
                <NftItemCard key={index} item={auction}></NftItemCard>
              )
              ) : (
                <NoItem
                  title="No items found"
                  description="Come back soon! Or try to browse something for you on our marketplace"
                  btnLink="/"
                  btnLabel="Browse marketplace"
                />
              )

          }
        </div>
      </div>
      <div className="section">
        <h1 className="font-weight-bold section-title">Hot Collections</h1>
        <Collections type="hot" />
      </div>
      <div className="section">
        <div className="d-flex flex-row align-items-center flex-wrap pt-4">
          <h1 className="font-weight-bold section-title mr-4">Explore</h1>
          <div className="d-flex flex-row flex-wrap">
            <Button className="btn-type mr-3 mb-2">All</Button>
            <Button className="btn-type mr-3 mb-2">Art</Button>
            <Button className="btn-type mr-3 mb-2">Photography</Button>
            <Button className="btn-type mr-3 mb-2">Games</Button>
            <Button className="btn-type mr-3 mb-2">Music</Button>
            <Button className="btn-type mr-3 mb-2">Domains</Button>
          </div>
        </div>
        <div className="row pr-2 pl-2 justify-content-center">
          {
            exploreAuctions.length > 0 ?
              (
                exploreAuctions.map((auction, index) => {
                  return (
                    <NftItemCard key={index} item={auction}></NftItemCard>
                  )
                })
              ) : (
                <NoItem
                  title="No items found"
                  description="Come back soon! Or try to browse something for you on our marketplace"
                  btnLink="/"
                  btnLabel="Browse marketplace"
                />
              )
          }
        </div>
      </div>

      <ConnectWallet
        show={showConnectWallet}
        handleClose={connectWalletClose}
      >
      </ConnectWallet>
      <DepositWallet
        show={showDepositWallet}
        handleClose={depositWalletClose}
      >
      </DepositWallet>
    </Layout >
  );
};

export default Home;
