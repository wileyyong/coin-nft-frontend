/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect } from "react";
import Layout from "components/Layout";
import { Button, Image } from "react-bootstrap";
import { useAppSelector, useAppDispatch } from "store/hooks";
import { connectUserWallet } from "store/User/user.slice";
import { getNftCategories } from "store/Nft/nft.selector";
import {
  isAuthenticated,
} from "store/User/user.selector";

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

import TopUsers from "components/home/TopUsers";
import HotBids from "components/home/HotBids";
import { useHistory } from 'react-router-dom';
import OfferController from "controller/OfferController";
import UserController from "controller/UserController";
import TokenController from "controller/TokenController";
import LoadingBar from "components/common/LoadingBar";

import {
  B1NormalTextTitle,
  B2NormalTextTitle,
  B3NormalTextTitle,
  NormalTextTitle,
  BigTitle,
  FlexAlignCenterDiv,
  FlexJustifyBetweenDiv,
  MBigTitle,
  SubDescription,
  NftAvatar,
} from "components/common/common.styles";

interface HomeProps { }

const Home: React.FC<HomeProps> = () => {
  const layoutView = useRef(null);
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(isAuthenticated);
  const [showConnectWallet, setShowConnectWallet] = useState(false);
  const connectWalletClose = () => setShowConnectWallet(false);
  const connectWalletShow = () => setShowConnectWallet(true);

  const [showDepositWallet, setShowDepositWallet] = useState(false);
  const depositWalletClose = () => setShowDepositWallet(false);
  const depositWalletShow = () => setShowDepositWallet(true);

  const [exploreAuctions, setExploreAuctions] = useState<any[]>([]);
  const [nftTokens, setNftTokens] = useState<any[]>([]);
  const [sellers, setSellers] = useState<any[]>([]);
  const [searchParam, setSearchParam] = useState<any>({
    category: "all",
    sort: "recent",
    verified: false
  });
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  const nftCategories = useAppSelector(getNftCategories);

  const categorySelected = (val: string) => {
    let updatedCategories: any[] =
      JSON.parse(JSON.stringify(selectedCategories)) || [];
    if (updatedCategories.includes(val)) {
      let index = updatedCategories.findIndex((elm: any) => elm === val);
      updatedCategories.splice(index, 1);
      setSelectedCategories(updatedCategories);
    } else {
      updatedCategories.push(val);
      setSelectedCategories(updatedCategories);
    }
  };

  const getCategoryClass = (val: string) => {
    if (selectedCategories.includes(val))
      return "nft-type-btn mr-4 nft-type-selected";
    return `nft-type-btn mr-4`;
  };

  useEffect(() => {
    const loadExploreData = async () => {
      setLoading(true);
      let params = {};
      if (searchParam.category === "all") {
        params = { sort: searchParam.sort, verified: false };
      }

      let offers = await OfferController.getList("explore", params);
      //setExploreAuctions(offers.offers);
      setLoading(false);
    };

    loadExploreData();
  }, [searchParam]);

  useEffect(() => {
    const loadNftTokens = async () => {
      setLoading(true);
      let items = await TokenController.getTokens();
      setNftTokens(items);
      setLoading(false);
    }

    loadNftTokens();
  }, [])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        let items = await UserController.getTopUsers('sellers', "7");
        setSellers(items);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }
    loadData();
  }, [])

  const connectMetaMask = () => {
    dispatch(connectUserWallet());
  }

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
            {
              !isAuth ? (
                <div className="intro-btn-metamask">
                  <Button className="mr-2 mr-lg-4 btn-outline-secondary" onClick={() => connectMetaMask()}>
                    <div className="d-flex flex-row align-items-center">
                      <Image className="connect-img p-1" src={metamaskImage}></Image>
                      <span>Connect with Meta Mask</span>
                    </div>
                  </Button>
                </div>
              ) : ''
            }
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
            loading ? (
              <div className="my-5 d-flex justify-content-center">
                <LoadingBar />
              </div>
            ) : (
              sellers.length > 0 ?
                <TopUsers users={sellers}></TopUsers>
                :
                <NoItem
                  title="No Users found"
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
        <div>
          {
            loading ? (
              <div className="row px-2 my-5 justify-content-center">
                <LoadingBar />
              </div>
            ) : (
              nftTokens.length > 0 ?
                (
                  <div className="row px-2 justify-content-start">
                    {
                      nftTokens.map((token, index) => {
                        return (
                          <NftItemCard key={index} item={token}></NftItemCard>
                        )
                      })
                    }
                  </div>
                )
                :
                <NoItem
                  title="No Hot bids found"
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
        <div className="d-flex flex-row align-items-center flex-wrap">
          <h1 className="font-weight-bold section-title mr-4">Explore</h1>
          {/* <FlexAlignCenterDiv className="category-list mt-4">
            {nftCategories.map((eType, index) => {
              return (
                eType.value !== "all" && (
                  <div
                    className={getCategoryClass(eType.value)}
                    key={index}
                    onClick={() => {
                      categorySelected(eType.value);
                    }}
                  >
                    {eType.label}
                  </div>
                )
              );
            })}
          </FlexAlignCenterDiv> */}
          <div className="d-flex flex-row flex-wrap">
            <Button className="btn-type mr-3 mb-2">All</Button>
            <Button className="btn-type mr-3 mb-2">Art</Button>
            <Button className="btn-type mr-3 mb-2">Photography</Button>
            <Button className="btn-type mr-3 mb-2">Games</Button>
            <Button className="btn-type mr-3 mb-2">Music</Button>
            <Button className="btn-type mr-3 mb-2">Domains</Button>
          </div>
        </div>
        <div>
          {
            nftTokens.length > 0 ?
              (
                <div className="row px-2">
                  {
                    nftTokens.map((auction, index) => {
                      return (
                        <NftItemCard key={index} item={auction}></NftItemCard>
                      )
                    })
                  }
                </div>
              ) : (
                <div className="row justify-content-center px-2">
                  <NoItem
                    title="No items found"
                    description="Come back soon! Or try to browse something for you on our marketplace"
                    btnLink="/"
                    btnLabel="Browse marketplace"
                  />
                </div>
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
