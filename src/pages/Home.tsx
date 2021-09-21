/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect } from "react";
import Layout from "components/Layout";
import { Button, Image, Dropdown, Form } from "react-bootstrap";
import { useAppSelector, useAppDispatch } from "store/hooks";
import { connectUserWallet } from "store/User/user.slice";
import { getNftCategories } from "store/Nft/nft.selector";
import Storage from "service/storage";
import {
  isAuthenticated,
} from "store/User/user.selector";

import {
  SmallTextTitle,
  B1NormalTextTitle,
  FlexAlignCenterDiv,
} from "components/common/common.styles";

import pumlImage from "assets/imgs/PUML-Logo.png";
import homeintroImage from "assets/imgs/home-intro.svg";
import metamaskImage from "assets/imgs/meta-logo.png";
import ticketImage from "assets/imgs/ticket.png";

import NftItemCard from "components/common/NftItemCard";
import ConnectWallet from "components/common/modal/ConnectWalletModal";
import DepositWallet from "components/common/modal/DepositWalletModal";
import Collections from "components/collection/Collections";
import NoItem from "components/common/noItem";

// import TopUsers from "components/home/TopUsers";
import OfferController from "controller/OfferController";
import UserController from "controller/UserController";
// import TokenController from "controller/TokenController";
import LoadingBar from "components/common/LoadingBar";
import { useHistory } from 'react-router-dom';
import imageAvatar from "assets/imgs/seller1.png";
import configs from "configs";
import { FaCheck } from "react-icons/fa";

interface HomeProps { }

const Home: React.FC<HomeProps> = () => {
  const history = useHistory();
  const layoutView = useRef(null);
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(isAuthenticated);
  const [showConnectWallet, setShowConnectWallet] = useState(false);
  const connectWalletClose = () => setShowConnectWallet(false);
  const connectWalletShow = () => setShowConnectWallet(true);
  const [exploreAuctions, setExploreAuctions] = useState<any[]>([]);
  const [explorePageNum, setExplorePageNumber] = useState(1);
  const [exploreLoading, setExploreLoading] = useState(false);
  const [explorePages, setExplorePages] = useState(1);
  const [showDepositWallet, setShowDepositWallet] = useState(false);
  const depositWalletClose = () => setShowDepositWallet(false);
  // const depositWalletShow = () => setShowDepositWallet(true);
  const [nftTokens, setNftTokens] = useState<any[]>([]);
  const [sellers, setSellers] = useState<any[]>([]);
  const [searchParam, setSearchParam] = useState<any>({
    category: "all",
    sort: "recent",
    verified: false
  });
  const [loading, setLoading] = useState(false);
  const nftCategories = useAppSelector(getNftCategories);

  const sortByOptions = [
    {
      value: "recent",
      text: "Recently added",
    },
    {
      value: "cheap",
      text: "Cheapest",
    },
    {
      value: "costly",
      text: "Highest price",
    },
    {
      value: "liked",
      text: "Most liked",
    },
  ];

  const onSortOptionClicked = (e: any, value: any) => {
    e.preventDefault();
    e.stopPropagation();
    setSearchParam({ ...searchParam, sort: value });
  };

  const onCheckVerified = (val: boolean) => {
    setSearchParam({ ...searchParam, verified: val });
  }

  useEffect(() => {
    const loadExploreData = async () => {
      let params = {};
      if (searchParam.category === "all") {
        params = { sort: searchParam.sort, verfied: searchParam.verified };
      } else {
        params = { ...searchParam };
      }
      if (explorePageNum > 1) {
        params = { page: explorePageNum, ...params };
      }
      setExploreLoading(true);
      let { offers, pages } = await OfferController.getList("explore", params);
      setExplorePages(pages);
      setExploreAuctions(
        explorePageNum === 1 ? offers : exploreAuctions.concat(offers)
      );
      setExploreLoading(false);
    };

    loadExploreData();
  }, [searchParam, explorePageNum]);

  useEffect(() => {
    const loadNftTokens = async () => {
      setLoading(true);
      let { offers } = await OfferController.getList("live");
      setNftTokens(offers);
      setLoading(false);
    }
    loadNftTokens();
  }, [])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const params = {
          name: "",
          bio: "",
          verified: false
        };
        let { users } = await UserController.userSearch(params, 1);
        users.reverse();
        setSellers(users);
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

  useEffect(() => {
    if (Storage.get('home_filter')) {
      setSearchParam(JSON.parse(Storage.get('home_filter')));
    }
  }, []);

  return (
    <Layout className="home-container" ref={layoutView}>
      <div className="section-intro">
        <div className="intro-content text-left">
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
        <div className="row text-center">
          {
            loading ? (
              <div className="my-5 d-flex justify-content-center w-100">
                <LoadingBar />
              </div>
            ) : (
              sellers.length > 0 ?
                sellers.map((seller, index) => (
                  index < 6 &&
                  <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 seller-segment mb-4" onClick={() => history.push(`/users/${seller.wallet}`)}>
                    <Image src={seller.avatar ? `${configs.DEPLOY_URL}${seller.avatar}` : imageAvatar} className="seg-img" alt="seller" />
                    <div className="seg-name pt-2 mt-3">{seller.name}</div>
                    <div className="seg-type pt-2">{seller.type || 'Seller'}</div>
                    <div className="seg-price pt-2">{seller.amount || '$30.00'} PUML</div>
                    <div className="seg-price-eth pt-2">{seller.price || '0.15'} ETH</div>
                  </div>
                ))
                // <TopUsers users={sellers}></TopUsers>
                :
                <div className="d-flex w-100 justify-content-center">
                  <NoItem
                    title="No Users found"
                    description="Come back soon! Or try to browse something for you on our marketplace"
                    btnLink="/"
                    btnLabel="Browse marketplace"
                  />
                </div>
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
          <div className="category-list d-flex flex-wrap">
            {nftCategories.map((eType, index) => {
              return (
                <div
                  className={`nft-type-btn mr-2 my-2 ${searchParam.category === eType.value
                      ? "nft-type-selected"
                      : ""
                    }`}
                  key={index}
                  onClick={() => {
                    setSearchParam({
                      ...searchParam,
                      category: eType.value,
                    });
                    setExplorePageNumber(1);
                    Storage.set('home_filter', JSON.stringify({ ...searchParam, category: eType.value }));
                  }
                  }
                >
                  {eType.label}
                </div>
              );
            })}
            <Dropdown className="filter-sort my-2">
              <Dropdown.Toggle className="filter-sort-btn">
                Filter and sort
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <SmallTextTitle className="grey-color px-4">
                  SORT BY
                </SmallTextTitle>
                {sortByOptions.map((sortOption, index) => {
                  return (
                    <Dropdown.Item
                      key={index}
                      onClick={(e) =>
                        onSortOptionClicked(e, sortOption.value)
                      }
                    >
                      <FlexAlignCenterDiv>
                        <B1NormalTextTitle>
                          {sortOption.text}
                        </B1NormalTextTitle>
                        {sortOption.value === searchParam.sort && (
                          <FaCheck className="fa-check ml-5"></FaCheck>
                        )}
                      </FlexAlignCenterDiv>
                    </Dropdown.Item>
                  );
                })}

                <SmallTextTitle className="grey-color px-4">
                  OPTIONS
                </SmallTextTitle>
                <FlexAlignCenterDiv className="px-4 text-nowrap">
                  Verified only
                  <Form.Check
                    type="switch"
                    id="is-verified"
                    className="ml-3 pointer-cursor"
                    onChange={(e) => onCheckVerified(e.target.checked)}
                    checked={searchParam.verified}
                  />
                </FlexAlignCenterDiv>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <div>
          {exploreLoading && explorePageNum === 1 ? (
            <div className="d-flex my-3 justify-content-center loading-bar">
              <LoadingBar />
            </div>
          ) : (
            <>
              {
                exploreAuctions.length > 0 ?
                  (
                    <div className="row px-2">
                      {
                        exploreAuctions.map((auction, index) => {
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
            </>
          )
          }
        </div>
        {
          exploreLoading && explorePageNum > 1 ? (
            <div className="d-flex my-3 justify-content-center loading-bar">
              <LoadingBar />
            </div>
          ) : (
            exploreAuctions.length > 0 && explorePages > explorePageNum && (
              <div className="mt-3 mb-5 d-flex justify-content-center">
                <Button
                  variant="primary"
                  className="btn-round w-50 outline-btn"
                  onClick={() => setExplorePageNumber(explorePageNum + 1)}
                >
                  <span>Load More</span>
                </Button>
              </div>
            )
          )
        }
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
