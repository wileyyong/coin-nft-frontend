/* eslint-disable react-hooks/exhaustive-deps */

import itemLogo from "assets/imgs/puml.png";
import imgAvatar from "assets/imgs/avatar.png";

import SmartContract from "ethereum/Contract";
import OfferController from "controller/OfferController";
import UserController from "controller/UserController";
import React, { useEffect, useState, useRef, Fragment } from "react";
import { Row, Col, Button, Container, Image } from "react-bootstrap";
import { NotificationManager } from "react-notifications";
import { useParams, useHistory } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import configs from "configs";
import Layout from "components/Layout";
import BidHistoryItem from "components/token/BidHistoryItem";
import PlaceBidModal from "components/token/PlaceBidModal";
import BuyTokenModal from "components/token/BuyTokenModal";
import Utility from "service/utility";
import Tabs from "components/common/Tabs";
import { BigNumberAdd, BigNumberMul, toFixed } from "service/number";
import LoadingSpinner from "components/common/LoadingSpinner";
import DateTimeService from "service/dateTime";
import HistoryItem from "components/token/HistoryItem";
import TokenController from "controller/TokenController";
import ReadMore from "components/common/ReadMore";
import ResellNftModal from "components/token/ResellNftModal";
import ResellNftStatusModal from "components/token/ResellNftStatusModal";
import { NftCreateStatus } from "model/NftCreateStatus";
import ShareNFTModal from "components/token/ShareNFTModal";
import { toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  getETHUSDTCurrency,
  getNftServiceFee,
  getMATICUSDTCurrency
} from "store/Nft/nft.selector";
import { getMyInfo, getWalletAddress } from "store/User/user.selector";
import {
  connectUserWallet,
  getWalletBalance,
  switchNetwork,
  getWalletPumlx
} from "store/User/user.slice";

import {
  B1NormalTextTitle,
  B2NormalTextTitle,
  B3NormalTextTitle,
  DivideLine,
  MidTextTitle,
  FlexAlignCenterDiv,
  NftAvatar
} from "components/common/common.styles";
import EthUtil from "ethereum/EthUtil";
import { EthereumNetworkID } from "model/EthereumNetwork";

import CollectionController from "controller/CollectionController";
import NftController from "controller/NftController";
import { BiBorderRadius } from "react-icons/bi";

interface TokenDetailProps {}

const TokenDetail: React.FC<TokenDetailProps> = () => {
  const layoutView = useRef(null);

  const auctionGap = 0.001;
  const params: any = useParams();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const serviceFee = useAppSelector(getNftServiceFee);
  const ethDollarPrice = useAppSelector(getETHUSDTCurrency);
  const maticDollarPrice = useAppSelector(getMATICUSDTCurrency);
  const walletAddress = useAppSelector(getWalletAddress);
  const userInfo = useAppSelector(getMyInfo);
  const [offer, setOffer] = useState<any>(null);
  const [token, setToken] = useState<any>({});
  const [histories, setHistories] = useState([]);
  const [bidHistory, setBidHistory] = useState<any[]>([]);
  const [highestBidder, setHighestBidder] = useState<any>(null);
  const [creator, setCreator] = useState<any>(null);
  const [remainTimeObj, setRemainTimeObj] = useState<any>({});
  const [owner, setOwner] = useState<any>(null);
  const tokenImgEl = useRef(null);
  const tokenVideoEl = useRef(null);
  const [sizeObj, setSizeObj] = useState<any>(null);
  const [timeObj, setTimeObj] = useState<any>(null);
  const [showBuyTokenModal, setShowBuyTokenModal] = useState(false);
  const [showResellDialog, setShowResellDialog] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [resellNftStatus, setResellNftStatus] = useState(NftCreateStatus.NONE);
  const [showPlaceBidModal, setShowPlaceBidModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isTransProgressing, setTransProgressing] = useState(false);
  const [likeDisable, setLikeDisable] = useState(false);
  const [likes, setLikes] = useState(0);
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [network, setNetwork] = useState<any>(EthereumNetworkID.GoerliNetwork);

  const resellFormData = useRef({
    min_bid_price: 0,
    expiry_date: "",
    offer_price: 0
  });
  useEffect(() => {
    loadOffer();
  }, []);

  useEffect(() => {
    const timeInterval =
      offer && offer.status === "pending"
        ? setInterval(() => {
            if (offer) {
              let obj = Utility.getPassedTimeObject(offer.date_end);
              setRemainTimeObj(obj);
            }
          }, 1000)
        : null;

    return () => {
      if (timeInterval) clearInterval(timeInterval);
    };
  }, [offer]);

  useEffect(() => {
    if (tokenImgEl.current) {
      setSizeObj({
        // @ts-ignore
        x: tokenImgEl.current?.naturalWidth,
        // @ts-ignore
        y: tokenImgEl.current?.naturalHeight
      });
    }
  }, [tokenImgEl.current]);

  useEffect(() => {
    if (tokenVideoEl.current) {
      // @ts-ignore
      tokenVideoEl.current.onloadedmetadata = function () {
        setSizeObj({
          // @ts-ignore
          x: tokenVideoEl.current?.videoWidth,
          // @ts-ignore
          y: tokenVideoEl.current?.videoHeight
        });
        // @ts-ignore
        setTimeObj({ duration: parseInt(tokenVideoEl.current?.duration) });
      };
    }
  }, [tokenVideoEl.current]);

  const loadOffer = async () => {
    if (params.id) {
      setLoading(true);
      const { offer, history, token } = await TokenController.getById(
        params.id
      );

      if (token.blockchain) {
        switch (token.blockchain) {
          case "ETH":
            setNetwork(EthereumNetworkID.GoerliNetwork);
            break;
          case "MATIC":
            setNetwork(EthereumNetworkID.MumbaiNetwork);
            break;
          default:
        }
      }
      history.sort(function (a: any, b: any) {
        return b.date - a.date;
      });
      setHistories(history);
      const bids: any[] = offer && offer.bids ? [...offer.bids] : [];
      bids.sort(function (a: any, b: any) {
        return b.price - a.price;
      });
      if (token.properties !== "") {
        setProperties(JSON.parse(token.attributes));
      }
      setOffer(offer);
      setToken(token);
      if (token.liked) {
        setLikeDisable(true);
      } else {
        setLikeDisable(false);
      }
      setLikes(token.likes || 0);
      setBidHistory(bids);
      if (bids.length) setHighestBidder(bids[0]);
      if (token.creator) setCreator(token.creator);
      setOwner(token.owners[0]);
      setLoading(false);
    }
  };

  const isOwner = () => {
    if (token && token.owners && offer) {
      // return token.owners.find((it: any) => {
      //     return it.user._id === offer.creator._id;
      // });
      return token.owners[0];
    }
  };

  const onLiked = async (id: string) => {
    if (!likeDisable) {
      let res = await TokenController.setLike(id);
      if (res.status === 200) {
        toast.success("Like Successful!");
        NotificationManager.success("Successfully liked!", "Success");
        setLikes(likes + 1);
        setLikeDisable(true);
      }
    } else {
      let res = await TokenController.setUnLike(id);
      if (res.status === 200) {
        toast.success("Unlike Successful!");
        setLikes(likes - 1);
        setLikeDisable(false);
      }
    }
  };

  const getBidMinPrice = () => {
    let minBidPrice: any = 0;
    if (offer) {
      minBidPrice = highestBidder ? highestBidder.price : offer.min_bid;
    }
    minBidPrice = BigNumberAdd(minBidPrice, auctionGap).toFixed();
    return minBidPrice;
  };

  const getTokenMedia = () => {
    return `${token.thumbnail || token.media}`;
  };

  const getCollectionImgPath = () => {
    // if (token && token.collections && token.collections.image)
    //     return `${configs.DEPLOY_URL}${token.collections.image}`;
    // return `${configs.DEPLOY_URL}/content/collection/puml.png`;
    if (token && token.collections && token.collections.image) {
      if (token.collections.image.includes("https://"))
        return token.collections.image;
      return `${configs.DEPLOY_URL}${token.collections.image}`;
    }
    return `${configs.DEPLOY_URL}/content/collection/puml.png`;
  };

  const isPicture = () => {
    if (token.media) {
      let media = token.media_type.toLowerCase();
      if (
        media.includes("png") ||
        media.includes("gif") ||
        media.includes("jpeg") ||
        media.includes("jpg") ||
        media.includes("webp")
      )
        return true;
      return false;
    }
    return false;
  };

  const isBidder = () => {
    if (bidHistory.length > 0) {
      const bidder = bidHistory.find(
        (bid: any) => bid.user.wallet === walletAddress
      );
      if (bidder) return true;
      return false;
    }
    return false;
  };

  const submitBid = async (price: any) => {
    try {
      if (offer) {
        const networkID = EthUtil.getNetwork();
        if (networkID !== network) {
          await switchNetwork(network);
          await dispatch(getWalletBalance());
        }
        setTransProgressing(true);

        let result: any;
        const pumlxApproved = userInfo && userInfo.pumlxApproved ? 1 : 0;

        if (token.blockchain && token.blockchain === "PUMLx") {
          // let bidTokenResult = await SmartContract.transferToken(
          //     configs.MAIN_ACCOUNT,
          //     price
          // )

          // if (bidTokenResult.success) {
          //     dispatch(getWalletPumlx());
          //     let obj: any = {
          //         tokenChainId: token.chain_id,
          //         tokenId: token._id,
          //         bidderAddress: EthUtil.getAddress()
          //     };
          //     result = await TokenController.bidToken(obj);
          // }
          var bidPrice = 0.000011;
          var bids = offer.bids;
          bidPrice += 0.000001 * bids.length;

          result = await SmartContract.bid(
            token.chain_id,
            bidPrice,
            pumlxApproved,
            price
          );
        } else {
          result = await SmartContract.bid(
            token.chain_id,
            price,
            pumlxApproved
          );
        }

        const approvedresult = await UserController.pumlxApproved(
          EthUtil.getAddress()
        );
        console.log(approvedresult);

        if (result.success && result.transactionHash) {
          dispatch(getWalletBalance());
          await OfferController.placeBid(offer._id, {
            price: price,
            hash: result.transactionHash
          });
          loadOffer();
          toast.success("Bid successful.");
          NotificationManager.success(
            "You bid to this item successfully.",
            "Success"
          );
        } else {
          console.log("error", result.error);
          toast.warning("Bid Failed.");
        }
        setTransProgressing(false);
        setShowPlaceBidModal(false);
      }
    } catch (err) {
      setTransProgressing(false);
      toast.warning("Bid Failed.");
    }
  };

  const checkOfferReady = () => {
    if (!walletAddress) {
      dispatch(connectUserWallet());
      return false;
    }

    if (
      isOwner() &&
      userInfo &&
      isOwner().user &&
      isOwner().user._id === userInfo._id
    ) {
      toast.warning("Already owned this item.");
      NotificationManager.info("You already owned this item.", "Info");
      return false;
    }
    return true;
  };

  const onPlaceBidClicked = () => {
    if (checkOfferReady()) setShowPlaceBidModal(true);
  };

  const isAuction = () => {
    if (offer) return offer.type === "auction" || offer.type === "both";
    return false;
  };

  const getDollarPrice = (ethValue: any) => {
    let blockchain: string = token.blockchain ? token.blockchain : "ETH";
    let dollarPrice: any = 0;
    if (ethValue) {
      switch (blockchain) {
        case "ETH":
          dollarPrice = BigNumberMul(ethValue, ethDollarPrice).toFixed(2);
          break;
        case "MATIC":
          dollarPrice = BigNumberMul(ethValue, maticDollarPrice).toFixed(2);
          break;
        case "PUMLx":
          dollarPrice = (ethValue * 0.05).toFixed(2);
          break;
        default:
      }
    }
    return dollarPrice;
  };

  const getAvatar = (type: any) => {
    if (type === "creator" && creator && creator.avatar)
      return `${configs.DEPLOY_URL}${creator.avatar}`;
    if (
      type === "owner" &&
      isOwner() &&
      isOwner().user &&
      isOwner().user.avatar
    )
      return `${configs.DEPLOY_URL}${isOwner().user.avatar}`;
    if (
      type === "highestBidder" &&
      highestBidder &&
      highestBidder.user &&
      highestBidder.user.avatar
    )
      return `${configs.DEPLOY_URL}${highestBidder.user.avatar}`;
    return imgAvatar;
  };

  const isExpired = () => {
    if (offer && isAuction()) {
      if (offer.status === "expired") return true;
      const dateEnd = new Date(offer.date_end).getTime();
      const now = new Date().getTime();
      if (dateEnd && dateEnd <= now) return true;
    }
    return false;
  };

  const approveNft = async () => {
    setResellNftStatus(NftCreateStatus.APPROVE_PROGRESSING);
    try {
      if (token.chain_id) {
        let result: any;

        let collection: any;
        if (token.collectionsId)
          collection = await CollectionController.getById(token.collectionsId);
        const contractAddress =
          collection && collection.collection
            ? collection.collection.contract_address
            : "";

        result = await SmartContract.approve(token.chain_id, contractAddress);
        if (result) {
          await NftController.stakeToken({
            chainIds: { [token.contract_address]: token.chain_id },
            stake: false
          });
          setResellNftStatus(NftCreateStatus.APPROVE_SUCCEED);
          dispatch(getWalletBalance());
          return;
        }
      }
    } catch (err) {
      setResellNftStatus(NftCreateStatus.APPROVE_FAILED);
    }
    setResellNftStatus(NftCreateStatus.APPROVE_FAILED);
  };

  const createOffer = async () => {
    setResellNftStatus(NftCreateStatus.CREATEOFFER_PROGRESSING);
    try {
      if (token.chain_id && resellFormData.current) {
        const offerPrice = Number(resellFormData.current.offer_price);
        const minBidPrice = Number(resellFormData.current.min_bid_price);
        const isDirectSale = offerPrice > 0 ? true : false;
        const isAuction = minBidPrice > 0 ? true : false;
        let auctionStart = Math.floor(new Date().getTime() / 1000);
        let duration = DateTimeService.getDurationSecondsWithTwoDates(
          "now",
          resellFormData.current.expiry_date
        );
        let result: any;

        let collection: any;
        if (token.collectionsId)
          collection = await CollectionController.getById(token.collectionsId);
        const contractAddress =
          collection && collection.collection
            ? collection.collection.contract_address
            : "";

        result = await SmartContract.createOffer(
          token.chain_id,
          isDirectSale,
          isAuction,
          offerPrice,
          minBidPrice,
          auctionStart,
          duration,
          token.blockchain,
          contractAddress
        );
        if (result) {
          dispatch(getWalletBalance());
          let offerObj: any = {
            token_id: token._id
          };

          if (offerPrice > 0) offerObj["offer_price"] = offerPrice;
          if (isAuction) {
            offerObj["min_bid"] = minBidPrice;
            offerObj["expiry_date"] = resellFormData.current.expiry_date;
          }
          await OfferController.create(offerObj);

          setResellNftStatus(NftCreateStatus.CREATEOFFER_SUCCEED);
          setShowStatusModal(false);
          loadOffer();
          toast.success("Offer successful.");
          NotificationManager.success(
            "Offer is created successfully.",
            "Success"
          );
        }
      }
    } catch (err) {
      setResellNftStatus(NftCreateStatus.CREATEOFFER_FAILED);
    }
    setResellNftStatus(NftCreateStatus.CREATEOFFER_FAILED);
  };

  const submitted = async (form: any) => {
    const networkID = EthUtil.getNetwork();
    if (networkID !== network) {
      await switchNetwork(network);
      await dispatch(getWalletBalance());
    }
    setShowStatusModal(true);
    setShowResellDialog(false);
    resellFormData.current = form;
    await approveNft();
  };

  const isCreator = () => {
    if (offer && offer.creator && userInfo._id === offer.creator._id)
      return true;
    return false;
  };

  const isDirectSale = () => {
    if (offer) return offer.type === "direct" || offer.type === "both";
    return false;
  };

  const getOfferPriceWithServiceFee = () => {
    let overFlowPer = 100 - serviceFee;
    if (offer) return toFixed((offer.offer_price * overFlowPer) / 100, 3);
  };

  const onDirectBuyClicked = () => {
    if (checkOfferReady()) setShowBuyTokenModal(true);
  };

  const directBuy = async () => {
    try {
      setTransProgressing(true);
      if (offer) {
        const networkID = EthUtil.getNetwork();
        if (networkID !== network) {
          await switchNetwork(network);
          await dispatch(getWalletBalance());
          if (token.blockchain === "PUMLx") {
            await SmartContract.addCustomToken(
              configs.PUML20_ADDRESS,
              "PUML",
              18
            );
          }
        }

        let buyResult: any;
        const pumlxApproved = userInfo && userInfo.pumlxApproved ? 1 : 0;

        if (token.blockchain && token.blockchain === "PUMLx") {
          var buyPrice = 0.000011;
          buyResult = await SmartContract.directBuy(
            token.chain_id,
            buyPrice,
            pumlxApproved,
            offer.offer_price
          );
        } else {
          buyResult = await SmartContract.directBuy(
            token.chain_id,
            offer.offer_price,
            pumlxApproved
          );
        }
        if (buyResult.success && buyResult.transactionHash) {
          dispatch(getWalletBalance());
          const contractAddress =
            token.collections && token.collections.contract_address
              ? token.collections.contract_address
              : "";
          await OfferController.directBuy(offer._id, {
            price: offer.offer_price,
            hash: buyResult.transactionHash,
            copies: 1
          });
          await NftController.stakeToken({
            chainIds: { [contractAddress]: token.chain_id },
            stake: false
          });

          await UserController.pumlxApproved(EthUtil.getAddress());

          // if (token.blockchain && token.blockchain === "PUMLx") {
          let obj: any = {
            buyerAddress: EthUtil.getAddress(),
            sellerAddress: offer.creator.wallet,
            buyPrice: offer.offer_price,
            token: token.blockchain
          };
          await TokenController.buyToken(obj);
          // }
          toast.success("Buy successful.");
          NotificationManager.success("Buy NFT successful.", "Success");
          setShowBuyTokenModal(false);
          loadOffer();
        } else {
          console.log("error", buyResult.error);
          toast.warning("Buy Failed.");
          NotificationManager.error("Failed to buy NFT..", "Error");
        }
        setTransProgressing(false);
      }
    } catch (err) {
      toast.warning("Buy Failed.");
      NotificationManager.error("Failed to buy NFT.", "Error");
      setTransProgressing(false);
    }
  };

  const Details = () => (
    <div className="d-flex flex-column pt-2">
      <div className="d-flex flex-row align-items-center item-address pr-2 pb-3">
        <Image src={itemLogo} className="member-image mr-2"></Image>
        <div className="address">{token._id}</div>
      </div>
      {owner && (
        <div
          className="d-flex flex-row align-items-center item-members pr-4"
          onClick={() => history.push(`/users/${owner.user.wallet}`)}
        >
          <Image
            src={configs.DEPLOY_URL + owner.user.avatar}
            className="member-image mr-2"
          ></Image>
          <div className="d-flex flex-column pt-2">
            <div className="member-type pb-1">Owner</div>
            <div className="member-name">{owner.user.name}</div>
          </div>
        </div>
      )}
      <div className="item-description my-4">
        <div className="title">{token.royalties}% Royalties</div>
        {isOwner() && isOwner().user.wallet === walletAddress && (
          <div className="content pt-1">
            For every future sale. You will recieve {token.royalties}% of the
            sold price
          </div>
        )}
      </div>
      <div className="item-description">
        <div className="title">Description</div>
        <div className="content mt-2 mb-4">{token.description}</div>
      </div>
    </div>
  );

  const Bid = () => (
    <div>
      {bidHistory.length > 0 ? (
        bidHistory.map((bidItem, index) => {
          return (
            <Fragment key={index}>
              <BidHistoryItem item={bidItem} token={token} />
            </Fragment>
          );
        })
      ) : (
        <div className="mx-auto my-2">
          <B3NormalTextTitle>Not Found Bidders yet</B3NormalTextTitle>
        </div>
      )}
    </div>
  );

  const History = () => (
    <div className="history-list">
      {histories.length > 0 ? (
        histories.map((history, i) => <HistoryItem item={history} key={i} />)
      ) : (
        <div className="mx-auto my-2">
          <B3NormalTextTitle>Not Found History</B3NormalTextTitle>
        </div>
      )}
    </div>
  );

  const tabs = [
    { label: "Details", Component: Details },
    { label: "Bids", Component: Bid },
    { label: "History", Component: History }
  ];
  return (
    <Layout ref={layoutView}>
      {loading ? (
        <div className="my-5 d-flex justify-content-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="buyitem-container">
          <div className="col-12 col-md-6 col-lg-6 col-xl-5 pb-4">
            <div className="featured-media w-100">
              {isPicture() ? (
                <img
                  id="token-img"
                  ref={tokenImgEl}
                  className="media"
                  src={getTokenMedia()}
                  alt="tokenImage"
                />
              ) : (
                token &&
                token.media && (
                  <video
                    ref={tokenVideoEl}
                    src={getTokenMedia()}
                    className="media"
                    loop
                    autoPlay
                    controls
                  >
                    <source type="video/mp4"></source>
                    <source type="video/webm"></source>
                    <source type="video/ogg"></source>
                    Your browser does not support HTML5 video.
                  </video>
                )
              )}
            </div>
            <div className="property">
              <div className="d-flex property-header flex-row">
                <div className="property-image mr-3"></div>
                <div className="property-title">Properties</div>
              </div>
              <div className="property-body">
                {properties &&
                  properties.length > 0 &&
                  properties.map((it, index) => (
                    <div className="flex-fill col-12 col-md-4 pt-2" key={index}>
                      <div className="property-item">
                        <div className="field pb-2">{it["trait_type"]}</div>
                        <div className="value">{it && it["value"]}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            {isDirectSale() && (
              <>
                {offer &&
                  offer.status === "pending" &&
                  (owner &&
                  owner.user &&
                  owner.user.wallet !== walletAddress ? (
                    <Button
                      variant="primary"
                      className="mt-4 buy-now w-50 text-white"
                      onClick={() => {
                        onDirectBuyClicked();
                      }}
                    >
                      <span>Buy Now</span>
                    </Button>
                  ) : (
                    ""
                  ))}
                <div className="my-5 d-block">
                  <span className="o-5">Service Fee</span>&nbsp;&nbsp;
                  {serviceFee}%<br></br>
                  {owner && owner.user && owner.user._id === userInfo._id && (
                    <>
                      <span className="o-5">You will receive</span>
                      &nbsp;&nbsp;
                      {getOfferPriceWithServiceFee()}
                      &nbsp; {token.blockchain ? token.blockchain : "ETH"}
                      &nbsp;&nbsp;
                      <span className="o-5">
                        (${getDollarPrice(getOfferPriceWithServiceFee())})
                      </span>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="col-12 col-md-6 col-lg-7 col-xl-8 d-flex flex-column flex-fill item-info">
            <div className="item-title pb-4 d-flex align-items-center">
              {token.name}
              <div className="font-size-lg">
                <div
                  className={
                    likeDisable
                      ? "liked-action disabled ml-5"
                      : "liked-action ml-5"
                  }
                  onClick={() => onLiked(token._id)}
                >
                  {likes ? <AiFillHeart /> : <AiOutlineHeart />}
                  <span>{likes || 0}</span>
                </div>
              </div>
            </div>
            {offer && offer.min_bid && (
              <div className="item-price pb-4">
                <span className="for-sale">For Sale ??? Highest Bid </span>
                <span>
                  {offer ? `${offer.min_bid}` : ""}{" "}
                  {token.blockchain ? token.blockchain : "ETH"} ???{" "}
                </span>
                <span className="price-puml">
                  {offer ? `$${getDollarPrice(offer.min_bid)} ` : " "}
                </span>
              </div>
            )}
            {offer && offer.offer_price && (
              <div className="item-price pb-4">
                <span className="for-sale">For Sale ??? Direct buy Price </span>
                <span>
                  {offer ? `${offer.offer_price}` : ""}{" "}
                  {token.blockchain ? token.blockchain : "ETH"} ???{" "}
                </span>
                <span className="price-puml">
                  {offer ? `$${getDollarPrice(offer.offer_price)} ` : " "}
                </span>
              </div>
            )}
            {/*{token && token.categories && (
                <div className="d-flex mt-3 flex-wrap">
                  {token.categories.map((category: any, index: number) => {
                    return (
                      <div className="nft-type-btn mr-2" key={index}>
                        {category.name}
                      </div>
                    );
                  })}
                </div>
                )}*/}
            <div className="d-flex flex-row flex-wrap mb-3">
              {creator && (
                <div
                  className="d-flex flex-row align-items-center item-members pr-4"
                  onClick={() => history.push(`/users/${creator.wallet}`)}
                >
                  <Image
                    src={configs.DEPLOY_URL + creator.avatar}
                    className="member-image mr-2"
                  ></Image>
                  <div className="d-flex flex-column pt-2">
                    <div className="member-type pb-1">Creator</div>
                    <div className="member-name">{creator.name}</div>
                  </div>
                </div>
              )}
              <div
                className="d-flex flex-row align-items-center item-members pr-4"
                onClick={() =>
                  token.collections
                    ? history.push(`/collections/${token.collections._id}`)
                    : ""
                }
              >
                <NftAvatar
                  className="mr-3"
                  imagePath={getCollectionImgPath()}
                ></NftAvatar>
                <div className="d-flex flex-column pt-2">
                  <div className="member-type pb-1">Collection</div>
                  <div className="member-name">
                    {token.collections ? token.collections.name : "PUML"}
                  </div>
                </div>
              </div>
            </div>
            {/*{sizeObj && (
                <div className="mr-3 mr-md-5">
                  <B3NormalTextTitle>Size</B3NormalTextTitle>
                  <p>
                    {sizeObj.x}x{sizeObj.y}
                  </p>
                </div>
              )}
              {timeObj && (
                <div>
                  <B3NormalTextTitle>Time</B3NormalTextTitle>
                  <p>{timeObj.duration} sec</p>
                </div>
              )}*/}
            <div className="buyitem-tab pt-2 mb-2">
              <Tabs
                className="mt-4"
                selectedTab={selectedTab}
                onClick={setSelectedTab}
                tabs={tabs}
              />
            </div>
            <div className="end-details">
              {isAuction() && (
                <div className="auction-end-details">
                  <div className="highest-bidder">
                    {highestBidder ? (
                      <>
                        <div className="bid-history-item d-flex">
                          <div>
                            <img
                              src={getAvatar("highestBidder")}
                              width={55}
                              style={{ borderRadius: "55%" }}
                              className="mr-3"
                            />
                          </div>
                          <div>
                            <div className="high-bidder">
                              Highest bid by
                              <span className="bidder-name pl-2">
                                {highestBidder.user
                                  ? highestBidder.user.name
                                  : ""}
                              </span>
                            </div>
                            <div className="high-bidprice">
                              {highestBidder.price}{" "}
                              {token.blockchain ? token.blockchain : "ETH"}{" "}
                              ???&nbsp;${getDollarPrice(highestBidder.price)} for
                              1 edition
                            </div>
                          </div>
                        </div>
                      </>
                    ) : offer && offer.status === "pending" ? (
                      <MidTextTitle>Be the first one to bid!</MidTextTitle>
                    ) : (
                      <MidTextTitle>No bidders on this auction.</MidTextTitle>
                    )}
                  </div>
                  <div className="pl-md-4">
                    {offer && offer.status === "completed" && (
                      <MidTextTitle className="mt-3">
                        Auction Ended
                      </MidTextTitle>
                    )}
                    {isExpired() && (
                      <MidTextTitle className="mt-3">
                        Auction Expired
                      </MidTextTitle>
                    )}
                    {/*{offer && offer.status === "pending" && !isExpired() && (
                      <>
                        <MidTextTitle className="faint-color">
                          Auction ends
                        </MidTextTitle>
                        {remainTimeObj ? (
                          <div className="d-flex align-items-end mt-3">
                            <div>
                              <MidTextTitle>{remainTimeObj.day}</MidTextTitle>
                              <B1NormalTextTitle className="mt-1 faint-color">
                                Days
                              </B1NormalTextTitle>
                            </div>
                            <div className="ml-2 ml-md-4">
                              <MidTextTitle>{remainTimeObj.hour}</MidTextTitle>
                              <B1NormalTextTitle className="mt-1 faint-color">
                                Hours
                              </B1NormalTextTitle>
                            </div>
                            <div className="ml-2 ml-md-4">
                              <MidTextTitle>{remainTimeObj.min}</MidTextTitle>
                              <B1NormalTextTitle className="mt-1 faint-color">
                                Min
                              </B1NormalTextTitle>
                            </div>
                            <div className="ml-2 ml-md-4">
                              <MidTextTitle>{remainTimeObj.sec}</MidTextTitle>
                              <B1NormalTextTitle className="mt-1 faint-color">
                                Sec
                              </B1NormalTextTitle>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </>
                        )}*/}
                  </div>
                </div>
              )}
              <div className="row">
                {isOwner() &&
                isOwner().user.wallet !== walletAddress &&
                !isBidder()
                  ? !isExpired() &&
                    isAuction() && (
                      <div className="col-12 col-sm-6 pt-4">
                        <Button
                          className="btn-primary mr-2 mb-2"
                          onClick={() => onPlaceBidClicked()}
                        >
                          Place a Bid
                        </Button>
                      </div>
                    )
                  : isOwner() &&
                    isOwner().user.wallet === walletAddress &&
                    (!offer || offer.status !== "pending") && (
                      <div className="col-12 col-sm-6 pt-4">
                        <Button
                          className="btn-primary mr-2 mb-2"
                          onClick={() => {
                            setShowResellDialog(true);
                          }}
                        >
                          Resell
                        </Button>
                      </div>
                    )}
                {owner && owner.user.wallet === walletAddress && (
                  <div className="col-12 col-sm-6 pt-4">
                    <Button
                      className="btn-gray mr-2"
                      onClick={() => {
                        setShowShareModal(true);
                      }}
                    >
                      Share
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {showBuyTokenModal && offer && (
        <BuyTokenModal
          show={showBuyTokenModal}
          offer={offer}
          handleClose={() => {
            setShowBuyTokenModal(false);
          }}
          token={token}
          owner={owner}
          directBuy={() => {
            directBuy();
          }}
        ></BuyTokenModal>
      )}
      {showPlaceBidModal && (
        <PlaceBidModal
          show={showPlaceBidModal}
          minPrice={getBidMinPrice()}
          token={token}
          owner={isOwner()}
          submitBid={submitBid}
          handleClose={() => {
            setShowPlaceBidModal(false);
          }}
        ></PlaceBidModal>
      )}
      {showShareModal && (
        <ShareNFTModal
          show={showShareModal}
          handleClose={() => {
            setShowShareModal(false);
          }}
          item={token}
        ></ShareNFTModal>
      )}
      {isTransProgressing && <LoadingSpinner></LoadingSpinner>}
      <ResellNftModal
        show={showResellDialog}
        handleClose={() => {
          setShowResellDialog(false);
        }}
        token={token}
        isResell={!isCreator()}
        handleSubmit={submitted}
      ></ResellNftModal>
      <ResellNftStatusModal
        show={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
        }}
        status={resellNftStatus}
        approveNft={approveNft}
        createOffer={createOffer}
      ></ResellNftStatusModal>
    </Layout>
  );
};

export default TokenDetail;
