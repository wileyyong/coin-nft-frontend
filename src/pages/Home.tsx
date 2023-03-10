/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect } from "react";
import Layout from "components/Layout";
import { NotificationManager } from "react-notifications";
import { Button, Image, Dropdown, Form, FormControl } from "react-bootstrap";
import { useAppSelector, useAppDispatch } from "store/hooks";
import { connectUserWallet } from "store/User/user.slice";
import { getNftCategories } from "store/Nft/nft.selector";
import Storage from "service/storage";
import { toast } from "react-toastify";
import { isAuthenticated } from "store/User/user.selector";

import {
  SmallTextTitle,
  B1NormalTextTitle,
  FlexAlignCenterDiv
} from "components/common/common.styles";

// import pumlImage from "assets/imgs/PUML-Logo.png";
import metamaskImage from "assets/imgs/meta-logo.png";
import ticketImage from "assets/imgs/ticket.png";

import NftItemCard from "components/common/NftItemCard";
import ConnectWallet from "components/common/modal/ConnectWalletModal";
import DepositWallet from "components/common/modal/DepositWalletModal";
import Collections from "components/collection/Collections";
import NoItem from "components/common/noItem";
import Utility from "service/utility";
// import TopUsers from "components/home/TopUsers";
import OfferController from "controller/OfferController";
import UserController from "controller/UserController";
// import TokenController from "controller/TokenController";
import LoadingBar from "components/common/LoadingBar";
import { useHistory } from "react-router-dom";
import imageAvatar from "assets/imgs/seller1.png";
import configs from "configs";
import { FaCamera, FaCheck, FaPen, FaSave, FaSearch } from "react-icons/fa";
import { getMyInfo, getWalletAddress } from "store/User/user.selector";
import { BigNumberMul } from "service/number";
import { getETHUSDTCurrency } from "store/Nft/nft.selector";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const history = useHistory();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const ethDollarPrice = useAppSelector(getETHUSDTCurrency);
  const walletAddress = useAppSelector(getWalletAddress);
  const layoutView = useRef(null);
  const myInfo = useAppSelector(getMyInfo);
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(isAuthenticated);
  const [showConnectWallet, setShowConnectWallet] = useState(false);
  const connectWalletClose = () => setShowConnectWallet(false);
  // const connectWalletShow = () => setShowConnectWallet(true);
  const [exploreAuctions, setExploreAuctions] = useState<any[]>([]);
  const [explorePageNum, setExplorePageNumber] = useState(1);
  const [exploreLoading, setExploreLoading] = useState(false);
  const [explorePages, setExplorePages] = useState(1);
  const [showDepositWallet, setShowDepositWallet] = useState(false);
  const depositWalletClose = () => setShowDepositWallet(false);
  // const depositWalletShow = () => setShowDepositWallet(true);
  const [nftTokens, setNftTokens] = useState<any[]>([]);
  const [sellers, setSellers] = useState<any[]>([]);
  const [featuredStored, setFeaturedStored] = useState<any>(
    Storage.get("featured") || ""
  );
  const [uploadFeaturedImage, setUploadFeaturedImage] = useState(null);
  const [featuredImage, setFeaturedImage] = useState<any>(null);
  const [editFeatured, setEditFeatured] = useState(false);
  const [featured_name, setFeaturedName] = useState("");
  const [featured_price, setFeaturedPrice] = useState(0);
  const [sellersGroup, setSellersGroup] = useState<any[]>([]);
  const [searchKey, setSearchKey] = useState("");
  const [searchParam, setSearchParam] = useState<any>({
    category: "all",
    sort: "recent",
    verified: false,
    name: ""
  });
  const [loading, setLoading] = useState(false);
  const nftCategories = useAppSelector(getNftCategories);

  const sortByOptions = [
    {
      value: "recent",
      text: "Recently added"
    },
    {
      value: "cheap",
      text: "Cheapest"
    },
    {
      value: "costly",
      text: "Highest price"
    },
    {
      value: "liked",
      text: "Most liked"
    }
  ];

  useEffect(() => {
    setFeaturedStored(Storage.get("featured"));
    const loadData = async () => {
      setLoading(true);
      let { offers } = await OfferController.getList("live");
      setNftTokens(offers);

      const featuredNFT = await UserController.getFeatured();

      let image: string;
      const name: string =
        featuredNFT && featuredNFT.featured_name
          ? featuredNFT.featured_name
          : "";
      const price: number =
        featuredNFT && featuredNFT.featured_price
          ? featuredNFT.featured_price
          : 0;
      if (featuredNFT && featuredNFT.featured) {
        if (featuredNFT.featured.includes("https://")) {
          image = featuredNFT.featured;
        } else {
          image = `${configs.DEPLOY_URL}${featuredNFT.featured}`;
        }
      } else {
        image = "";
      }
      if (
        featuredStored !== JSON.stringify(getFeaturedObj(name, price, image))
      ) {
        setFeaturedStored(JSON.stringify(getFeaturedObj(name, price, image)));
      }
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
    };
    loadData();
  }, []);

  const onSortOptionClicked = (e: any, value: any) => {
    e.preventDefault();
    e.stopPropagation();
    setSearchParam({ ...searchParam, sort: value });
  };

  // const onCheckVerified = (val: boolean) => {
  //   setSearchParam({ ...searchParam, verified: val });
  // }

  useEffect(() => {
    const loadExploreData = async () => {
      let params = {};
      if (searchParam.name === "") {
        if (searchParam.category === "all") {
          params = { sort: searchParam.sort, verfied: searchParam.verified };
        } else {
          params = { ...searchParam };
        }
      } else if (searchParam.category === "all") {
        params = {
          sort: searchParam.sort,
          verfied: searchParam.verified,
          name: searchParam.name
        };
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
  }, [searchParam, explorePageNum, myInfo]);

  useEffect(() => {
    let group = [];
    for (let index = 0; index < sellers.length; index += 3) {
      let subgroup = [];
      if (sellers[index]) subgroup.push(sellers[index]);
      if (sellers[index + 1]) subgroup.push(sellers[index + 1]);
      if (sellers[index + 2]) subgroup.push(sellers[index + 2]);

      group.push(subgroup);
    }
    setSellersGroup(group);
  }, [sellers]);

  useEffect(() => {
    const setFeature = () => {
      setFeaturedImage(
        featuredStored ? JSON.parse(featuredStored).featuredImage : ticketImage
      );
      setFeaturedPrice(
        featuredStored ? JSON.parse(featuredStored).featured_price : 0.01
      );
      setFeaturedName(
        featuredStored
          ? JSON.parse(featuredStored).featured_name
          : "Christian Trist"
      );
      Storage.set("featured", featuredStored);
    };
    setFeature();
  }, [featuredStored]);

  const fileChanged = (e: any) => {
    const file = e.target.files[0];
    // if (file) {
    //   setUploadFeaturedImage(file);
    //   var reader = new FileReader();
    //   reader.addEventListener(
    //       "load",
    //       () => {
    //         setFeaturedImage(reader.result || "");
    //       },
    //       false
    //   );
    //   reader.readAsDataURL(file);
    // }
    if (file) {
      setUploadFeaturedImage(file);
      let data = new FormData();
      data.append("file", file);
      axios
        .post("https://api.pinata.cloud/pinning/pinFileToIPFS", data, {
          headers: {
            "Content-Type": `multipart/form-data`,
            pinata_api_key: configs.PINATA_API_KEY,
            pinata_secret_api_key: configs.PINATA_SECRET_API_KEY
          }
        })
        .then(function (response) {
          if (response && response.data && response.data.IpfsHash) {
            const imgURL =
              configs.PINATA_GATEWAY + "/ipfs/" + response.data.IpfsHash;
            setFeaturedImage(imgURL);
          }
        })
        .catch(function (error) {
          console.log("err", error);
        });
    }
  };

  const onUploadImage = () => {
    fileInputRef?.current?.click();
  };

  const getFeaturedObj = (name: string, price: number, featured: string) => {
    return {
      featured_name: name,
      featured_price: price,
      featuredImage: featured
    };
  };

  const saveFeaturedImage = async () => {
    let data = {
      featuredImage: uploadFeaturedImage
    };
    let formdata = Utility.getFormDataFromObject(data);
    await UserController.uploadFeaturedImage(formdata)
      .then((res: any) => {
        if (res && res.status === 200) {
          toast.success(
            uploadFeaturedImage
              ? "Successfully uploaded!"
              : "Successfully removed!"
          );
          NotificationManager.success(
            uploadFeaturedImage
              ? "Successfully uploaded!"
              : "Successfully removed!",
            "Success"
          );
          setUploadFeaturedImage(null);
          if (res.data.featuredImage) {
            setFeaturedStored(
              JSON.stringify(
                getFeaturedObj(
                  featured_name,
                  featured_price,
                  res.data.featuredImage
                )
              )
            );
          }
        }
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.error) {
          toast.warning(err.response.data.error);
          NotificationManager.error(err.response.data.error, "Error");
        }
      });
  };

  const getDollarPrice = (ethValue: any) => {
    if (ethValue) {
      let dollarPrice = BigNumberMul(ethValue, ethDollarPrice).toFixed(2);
      return dollarPrice;
    }
    return 0;
  };

  const handleChange = (e: any) => {
    let fieldName = e.target.name;
    if (fieldName === "featured_price") {
      const regex = /^[0-9]\d*(?:[.]\d*)?$/;
      if (e.target.value !== "" && !regex.test(e.target.value)) {
        e.preventDefault();
        return;
      }
      setFeaturedPrice(e.target.value);
    } else {
      setFeaturedName(e.target.value);
    }
  };

  const handleSaveFeatured = async () => {
    const data = {
      featured_name,
      featured_price
    };
    if (!featured_name || !featured_price) {
      toast.warning("Please input featured Name and Price.");
      NotificationManager.error(
        "Please input featured Name and Price.",
        "Error"
      );
      return;
    }
    let formdata = Utility.getFormDataFromObject(data);
    await UserController.updateFeatured(formdata)
      .then((res: any) => {
        if (res && res.status === 200) {
          toast.success("Successfully updated!");
          NotificationManager.success("Successfully updated!", "Success");
          setEditFeatured(false);
          if (res.data.featured_name && res.data.featured_price) {
            setFeaturedStored(
              JSON.stringify(
                getFeaturedObj(
                  res.data.featured_name,
                  res.data.featured_price,
                  featuredImage
                )
              )
            );
          }
        }
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.error) {
          toast.warning(err.response.data.error);
          NotificationManager.error(err.response.data.error, "Error");
        }
      });
  };

  const onKeyDown = (e: any) => {
    if (e.charCode === 13) {
      onSearch();
    }
  };

  const onSearch = () => {
    setSearchParam({ ...searchParam, name: searchKey });
  };

  return (
    <Layout className="home-container" ref={layoutView}>
      <div className="section-intro">
        <div className="intro-content text-left">
          <div className="intro-border">
            <p className="intro-title pb-0">PUML NFT </p>
            <p className="intro-type">Market Place</p>
            <div className="intro-desc pt-4">
              Custom-made characters that will transition to the assets expanded
              ecosystem (media, content, and games)
            </div>
          </div>
          <div className="intro-connect-btnGroup pt-4">
            {/*
            <div className="intro-btn-wallet pb-3">
              <Button className="mr-2 mr-lg-4 btn-primary" onClick={connectWalletShow}>
                <div className="d-flex flex-row align-items-center">
                  <Image className="connect-img" src={pumlImage}></Image>
                  <span>Connect PUML Wallet</span>
                </div>
              </Button>
            </div>
            
            {!isAuth ? (
              <div className="intro-btn-metamask">
                <Button
                  className="mr-2 mr-lg-4 btn-outline-secondary"
                  onClick={() => connectMetaMask()}
                >
                  <div className="d-flex flex-row align-items-center">
                    <Image
                      className="connect-img p-1"
                      src={metamaskImage}
                    ></Image>
                    <span>Connect with Meta Mask</span>
                  </div>
                </Button>
              </div>
            ) : (
              ""
            )}
            */}
          </div>
        </div>
        <div className="intro-ticket">
          {uploadFeaturedImage ? (
            <div
              className="upload-image pointer-cursor text-dark ml-5"
              onClick={() => saveFeaturedImage()}
            >
              <FaSave />
            </div>
          ) : (
            ""
          )}
          {walletAddress === configs.ADMIN_ADDRESS.toLowerCase() && (
            <div
              className="upload-image pointer-cursor"
              onClick={() => onUploadImage()}
            >
              <FaCamera />
            </div>
          )}
          <Image
            className="ticket-img"
            src={featuredImage}
            alt="ticket"
          ></Image>
          <div className="d-flex flex-column align-items-center ticket-content">
            {editFeatured ? (
              <>
                <Form.Control
                  required
                  type="text"
                  placeholder="NFT Name"
                  name="featured_name"
                  value={featured_name}
                  onChange={(e) => handleChange(e)}
                />
                <Form.Control
                  required
                  type="text"
                  placeholder="Featured Price"
                  name="featured_price"
                  value={featured_price}
                  onChange={(e) => handleChange(e)}
                />
              </>
            ) : (
              <>
                <div className="title">{featured_name}</div>
                <div className="price">
                  ${getDollarPrice(featured_price)}{" "}
                  <span className="pl-3"> {featured_price} ETH</span>
                </div>
              </>
            )}
            {walletAddress === configs.ADMIN_ADDRESS.toLowerCase() && (
              <>
                {editFeatured ? (
                  <div
                    className="edit-content"
                    onClick={() => handleSaveFeatured()}
                  >
                    <FaSave />
                  </div>
                ) : (
                  <div
                    className="edit-content"
                    onClick={() => setEditFeatured(true)}
                  >
                    <FaPen />
                  </div>
                )}
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept={configs.IMG_FILE_ACCEPT}
            onChange={fileChanged}
          />
        </div>
      </div>
      <div className="section top-sellers">
        <h1 className="font-weight-bold section-title">Top Sellers</h1>
        <div className="text-center">
          {loading ? (
            <div className="my-5 d-flex justify-content-center w-100">
              <LoadingBar />
            </div>
          ) : sellers.length > 0 ? (
            <div className="d-flex flex-row flex-wrap">
              {sellersGroup.map((sellerGroup, gIndex) => (
                <div key={gIndex} className="flex-fill d-flex flex-column">
                  {sellerGroup.map((seller: any, sIndex: number) => (
                    <div
                      key={sIndex}
                      className="seller-segment mb-4"
                      onClick={() => history.push(`/users/${seller.wallet}`)}
                    >
                      <div className="seg-name mr-2">
                        {gIndex * 3 + sIndex + 1}
                      </div>
                      <Image
                        src={
                          seller.avatar
                            ? `${configs.DEPLOY_URL}${seller.avatar}`
                            : imageAvatar
                        }
                        className="seg-img"
                        alt="seller"
                      />
                      <div className="d-flex flex-column">
                        <div className="seg-name">{seller.name}</div>
                        <div>
                          <span className="seg-price">
                            {seller.amount || "$30"}
                          </span>
                          <span className="seg-price-eth">
                            {" "}
                            ??? {seller.price || "0.15"} ETH
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="d-flex w-100 justify-content-center">
              <NoItem
                title="No Users found"
                description="Come back soon! Or try to browse something for you on our marketplace"
                btnLink="/"
                btnLabel="Browse marketplace"
              />
            </div>
          )}
        </div>
      </div>
      <div className="section">
        <h1 className="font-weight-bold section-title">Hot Bids</h1>
        <div>
          {loading ? (
            <div className="row px-2 my-5 justify-content-center">
              <LoadingBar />
            </div>
          ) : nftTokens.length > 0 ? (
            <div className="row px-2 justify-content-start">
              {nftTokens.map((token, index) => {
                return <NftItemCard key={index} item={token}></NftItemCard>;
              })}
            </div>
          ) : (
            <NoItem
              title="No Hot bids found"
              description="Come back soon! Or try to browse something for you on our marketplace"
              btnLink="/"
              btnLabel="Browse marketplace"
            />
          )}
        </div>
      </div>
      <div className="section">
        <h1 className="font-weight-bold section-title">Hot Collections</h1>
        <Collections type="hot" />
      </div>
      <div className="section">
        <div className="d-flex flex-row align-items-center flex-wrap">
          <h1 className="font-weight-bold section-title mr-4">Explore</h1>
          <FlexAlignCenterDiv className="header-search-form ml-0 ml-xl-3">
            <FaSearch
              className="search-icon"
              style={{ cursor: "pointer" }}
              onClick={() => onSearch()}
            />
            <FormControl
              type="text"
              placeholder="Search athletes"
              className="ml-sm-2"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              onKeyPress={(e?: any) => onKeyDown(e)}
            />
            {searchKey && (
              <AiOutlineClose
                className="clear-icon pointer-cursor"
                onClick={() => setSearchKey("")}
              />
            )}
          </FlexAlignCenterDiv>
          <div className="category-list d-flex flex-wrap">
            {nftCategories.map((eType, index) => {
              return (
                <div
                  className={`nft-type-btn mr-2 my-2 ${
                    searchParam.category === eType.value
                      ? "nft-type-selected"
                      : ""
                  }`}
                  key={index}
                  onClick={() => {
                    setSearchParam({
                      ...searchParam,
                      category: eType.value
                    });
                    setExplorePageNumber(1);
                    Storage.set(
                      "home_filter",
                      JSON.stringify({ ...searchParam, category: eType.value })
                    );
                  }}
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
                      onClick={(e) => onSortOptionClicked(e, sortOption.value)}
                    >
                      <FlexAlignCenterDiv>
                        <B1NormalTextTitle>{sortOption.text}</B1NormalTextTitle>
                        {sortOption.value === searchParam.sort && (
                          <FaCheck className="fa-check ml-5"></FaCheck>
                        )}
                      </FlexAlignCenterDiv>
                    </Dropdown.Item>
                  );
                })}

                {/* <SmallTextTitle className="grey-color px-4">
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
                </FlexAlignCenterDiv> */}
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
              {exploreAuctions.length > 0 ? (
                <div className="row px-2">
                  {exploreAuctions.map((auction, index) => {
                    return (
                      <NftItemCard key={index} item={auction}></NftItemCard>
                    );
                  })}
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
              )}
            </>
          )}
        </div>
        {exploreLoading && explorePageNum > 1 ? (
          <div className="d-flex my-3 justify-content-center loading-bar">
            <LoadingBar />
          </div>
        ) : (
          exploreAuctions.length > 0 &&
          explorePages > explorePageNum && (
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
        )}
      </div>

      <DepositWallet
        show={showDepositWallet}
        handleClose={depositWalletClose}
      ></DepositWallet>
    </Layout>
  );
};

export default Home;
