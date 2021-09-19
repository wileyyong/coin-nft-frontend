/* eslint-disable react-hooks/exhaustive-deps */
import itemLogo from "assets/imgs/puml-logo-footer.png";
import imgAvatar from "assets/imgs/avatar.png";

import SmartContract from "ethereum/Contract";
import OfferController from "controller/OfferController";
import React, { useEffect, useState, useRef, Fragment } from "react";
import { Row, Col, Button, Container, Image } from "react-bootstrap";
import { NotificationManager } from "react-notifications";
import { useParams, useHistory} from "react-router-dom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import configs from "configs";
import Layout from "components/Layout";
import BidHistoryItem from "components/token/BidHistoryItem";
import PlaceBidModal from "components/token/PlaceBidModal";
import Utility from "service/utility";
import Tabs from "components/common/Tabs";
import { BigNumberAdd, BigNumberMul } from "service/number";
import LoadingSpinner from "components/common/LoadingSpinner";
import DateTimeService from "service/dateTime";
import HistoryItem from "components/token/HistoryItem";
import TokenController from "controller/TokenController";
import ReadMore from "components/common/ReadMore";
import ResellNftModal from "components/token/ResellNftModal";
import ResellNftStatusModal from "components/token/ResellNftStatusModal";
import { NftCreateStatus } from "model/NftCreateStatus";

import { useAppDispatch, useAppSelector } from "store/hooks";
import { getETHUSDTCurrency } from "store/Nft/nft.selector";
import { getMyInfo, getWalletAddress } from "store/User/user.selector";
import { connectUserWallet, getWalletBalance } from "store/User/user.slice";

import {
    B1NormalTextTitle,
    B2NormalTextTitle,
    B3NormalTextTitle,
    DivideLine,
    MidTextTitle,
    FlexAlignCenterDiv,
    NftAvatar,
} from "components/common/common.styles";

interface TokenDetailProps { }

const TokenDetail: React.FC<TokenDetailProps> = () => {
    const layoutView = useRef(null);

    const auctionGap = 0.001;
    const params: any = useParams();
    const history = useHistory();
    const dispatch = useAppDispatch();

    const ethDollarPrice = useAppSelector(getETHUSDTCurrency);
    const walletAddress = useAppSelector(getWalletAddress);
    const userInfo = useAppSelector(getMyInfo);
    const [offer, setOffer] = useState<any>(null);
    const [token, setToken] = useState<any>({});
    const [histories, setHistories] = useState([]);
    const [bidHistory, setBidHistory] = useState<any[]>([]);
    const [highestBidder, setHighestBidder] = useState<any>(null);
    const [creator, setCreator] = useState<any>(null);
    const [remainTimeObj, setRemainTimeObj] = useState<any>({});

    const tokenImgEl = useRef(null);
    const tokenVideoEl = useRef(null);
    const [sizeObj, setSizeObj] = useState<any>(null);
    const [timeObj, setTimeObj] = useState<any>(null);
    const [showResellDialog, setShowResellDialog] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [resellNftStatus, setResellNftStatus] = useState(NftCreateStatus.NONE);
    const [showPlaceBidModal, setShowPlaceBidModal] = useState(false);
    const [isTransProgressing, setTransProgressing] = useState(false);
    const [likeDisable, setLikeDisable] = useState(false);
    const [likes, setLikes] = useState(0);
    const [selectedTab, setSelectedTab] = useState(0);
    const [loading, setLoading] = useState(false);

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
                y: tokenImgEl.current?.naturalHeight,
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
                    y: tokenVideoEl.current?.videoHeight,
                });
                // @ts-ignore
                setTimeObj({ duration: parseInt(tokenVideoEl.current?.duration) });
            };
        }
    }, [tokenVideoEl.current]);

    const loadOffer = async () => {
        if (params.id) {
            setLoading(true);
            const { offer, history, token } = await TokenController.getById(params.id);
            history.sort(function (a: any, b: any) {
                return b.date - a.date;
            });
            setHistories(history);
            const bids: any[] = offer && offer.bids ? [...offer.bids] : [];
            bids.sort(function (a: any, b: any) {
                return b.price - a.price;
            });
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
            setLoading(false);
        }
    };

    const isOwner = () => {
        if (token && token.owners) {
            return token.owners[0];
        }
    }

    const onLiked = async (id: string) => {
        if (!likeDisable) {
            let res = await TokenController.setLike(id);
            if (res.status === 200) {
                NotificationManager.success("Successfully liked!", "Success");
                setLikes(likes + 1);
                setLikeDisable(true);
            }
        } else {
            let res = await TokenController.setUnLike(id);
            if (res.status === 200) {
                NotificationManager.success("Successfully unliked!", "Success");
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
        return `${configs.DEPLOY_URL}${token.media}`;
    };

    const getCollectionImgPath = () => {
        if (token && token.collections && token.collections.image)
            return `${configs.DEPLOY_URL}${token.collections.image}`;
        return `${configs.DEPLOY_URL}/content/collection/puml.png`;
    };

    const isPicture = () => {
        if (token.media) {
            let media = token.media.toLowerCase();
            if (media.includes("png") || media.includes("gif") || media.includes("jpeg") || media.includes("jpg") || media.includes("webp")) return true;
            return false;
        }
        return false;
    };

    const isBidder = () => {
        if (bidHistory.length > 0) {
            const bidder = bidHistory.find((bid: any) => bid.user.wallet === walletAddress);
            if (bidder) return true;
            return false;
        }
        return false;
    }

    const submitBid = async (price: any) => {
        try {
            if (offer) {
                setTransProgressing(true);
                const result = await SmartContract.bid(token.chain_id, price);
                if (result.success && result.transactionHash) {
                    dispatch(getWalletBalance());
                    await OfferController.placeBid(offer._id, {
                        price: price,
                        hash: result.transactionHash,
                    });
                    loadOffer();
                    NotificationManager.success(
                        "You bid to this item successfully.",
                        "Success"
                    );
                } else {
                    NotificationManager.error("You failed to bid this item.", "Error");
                }
                setTransProgressing(false);
                setShowPlaceBidModal(false);
            }
        } catch (err) {
            setTransProgressing(false);
            NotificationManager.error("You failed to bid this item.", "Error");
        }
    };

    const checkOfferReady = () => {
        if (!walletAddress) {
            dispatch(connectUserWallet());
            return false;
        }

        if (isOwner() && userInfo && isOwner().user && isOwner().user._id === userInfo._id) {
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
        if (ethValue) {
            let dollarPrice = BigNumberMul(ethValue, ethDollarPrice).toFixed(2);
            return dollarPrice;
        }
        return 0;
    };

    const getAvatar = (type: any) => {
        if (type === "creator" && creator && creator.avatar)
            return `${configs.DEPLOY_URL}${creator.avatar}`;
        if (type === "owner" && isOwner() && isOwner().user && isOwner().user.avatar)
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
        if(offer && isAuction()) {
          if(offer.status === "expired") return true;
          const dateEnd = new Date(offer.date_end).getTime();
          const now = new Date().getTime();
          if(dateEnd && dateEnd <= now) return true;
        }
        return false;
    }

    const approveNft = async () => {
        setResellNftStatus(NftCreateStatus.APPROVE_PROGRESSING);
        try {
          if(token.chain_id) {
            let result: any = await SmartContract.approve(token.chain_id);
            if (result) {
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
            let result: any = await SmartContract.createOffer(
              token.chain_id,
              isDirectSale,
              isAuction,
              offerPrice,
              minBidPrice,
              auctionStart,
              duration
            );
            if (result) {
              dispatch(getWalletBalance());
              let offerObj: any = {
                token_id: token._id,
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
        setShowStatusModal(true);
        setShowResellDialog(false);
        resellFormData.current = form;
        await approveNft();
      };
    
      const isCreator = () => {
        if (offer && offer.creator && userInfo._id === offer.creator._id) return true;
        return false;
      };

    const Details = () => (
        <div className="d-flex flex-column pt-2">
            <div className="d-flex flex-row align-items-center item-address pr-2 pb-3">
                <Image src={itemLogo} className="member-image"></Image>
                <div className="address">{token._id}</div>
            </div>
            {sizeObj && (
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
            )}
            <div className="item-description pb-4">
                <div className="title">Description</div>
                <div className="content pt-1"><ReadMore maxChars={250} text={token.description} /></div>
            </div>
            <div className="item-description pb-4">
                <div className="title">{token.royalties}% Royalties</div>
                {
                    isOwner() && isOwner().user.wallet === walletAddress && (
                        <div className="content pt-1">For every future sale. You will recieve {token.royalties}% of the sold price</div>
                    )
                }
            </div>
        </div>
    );
    const Bid = () => (
        <div>
            {bidHistory.length > 0 ?
                bidHistory.map((bidItem, index) => {
                return (
                    <Fragment key={index}>
                        <BidHistoryItem item={bidItem} token={token} />
                        <DivideLine key={`line_${index}`}></DivideLine>
                    </Fragment>
                );
            }) : (
                <div className="mx-auto my-2">
                    <B3NormalTextTitle>Not Found Bidders yet</B3NormalTextTitle>
                </div>
            )}
        </div>
    );
    const History = () => (
        <div className="history-list">
            {histories.length > 0 ? (
                histories.map((history, i) => (
                    <HistoryItem item={history} key={i} />
                ))
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
        { label: "History", Component: History },
    ];

    return (
        <Layout ref={layoutView}>
            {loading ? <div className="my-5 d-flex justify-content-center">
                <LoadingSpinner />
            </div> :
                <Container className="buyitem-container">
                    <div className="row">
                        <div className="col-12 col-md-6 col-lg-6 col-xl-5 d-flex flex-row pb-4">
                            <div className="featured-media w-100">
                                {isPicture() ? (
                                <img
                                    id="token-img"
                                    ref={tokenImgEl}
                                    className="media my-4"
                                    src={getTokenMedia()}
                                    alt="tokenImage"
                                />
                                ) : (
                                token &&
                                token.media && (
                                    <video
                                    ref={tokenVideoEl}
                                    src={getTokenMedia()}
                                    className="media my-4"
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
                        </div>
                        <div className="col-12 col-md-6 col-lg-7 col-xl-8 d-flex flex-column flex-fill item-info">
                            <div className="item-title pb-4 d-flex align-items-center">
                                {token.name}
                                <div className="font-size-lg">
                                    <div
                                        className={
                                            likeDisable ? "liked-action disabled ml-5" : "liked-action ml-5"
                                        }
                                        onClick={() => onLiked(token._id)}
                                        >
                                        {likes ? <AiFillHeart /> : <AiOutlineHeart />}
                                        <span>{likes || 0}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="item-price pb-4">
                                <span className="for-sale">For Sale • Highest Bid </span>
                                <span className="text-dark">{offer ? `${offer.min_bid}` : ''} ETH • </span>
                                <span className="price-puml">{offer ? `$${getDollarPrice(offer.min_bid)} ` : ' '} PUML</span>
                            </div>
                            <div className="d-flex flex-row">
                                {creator && (
                                    <div className="d-flex flex-row align-items-center item-members pr-4" onClick={() => history.push(`/users/${creator.wallet}`)}>
                                        <Image src={configs.DEPLOY_URL + creator.avatar} className="member-image mr-2"></Image>
                                        <div className="d-flex flex-column pt-2">
                                            <div className="member-type pb-1">Creator</div>
                                            <div className="member-name">{creator.name}</div>
                                        </div>
                                    </div>
                                )}
                                <FlexAlignCenterDiv className="pointer-cursor d-flex align-items-center" onClick={() => token.collections ? history.push(`/collections/${token.collections._id}`) : history.push('/collections/puml')}>
                                    <NftAvatar
                                        className="mr-3"
                                        imagePath={getCollectionImgPath()}
                                    ></NftAvatar>
                                    <B1NormalTextTitle style={{ width: 'calc(100% - 76px)' }}>
                                        {token.collections ? token.collections.name : "PUML"}
                                    </B1NormalTextTitle>
                                </FlexAlignCenterDiv>
                            </div>

                            <div className="buyitem-tab pt-2">
                                <Tabs
                                    className="mt-4"
                                    selectedTab={selectedTab}
                                    onClick={setSelectedTab}
                                    tabs={tabs}
                                />
                            </div>
                            <Row className="auction-end-details pb-3">
                                <Col md="6" className="highest-bidder">
                                    {highestBidder ? (
                                        <>
                                        <MidTextTitle>
                                            <span className="text-gray">Highest bid by</span>{" "}
                                            <span style={{ whiteSpace: 'pre-wrap' }}>{highestBidder.user ? highestBidder.user.name : ""}</span>
                                        </MidTextTitle>
                                        <div className="bid-history-item d-flex mt-3 mb-2">
                                            <NftAvatar
                                            imagePath={getAvatar("highestBidder")}
                                            className="mr-3"
                                            ></NftAvatar>
                                            <div>
                                            <B2NormalTextTitle>
                                                {highestBidder.price} ETH •&nbsp;
                                            </B2NormalTextTitle>
                                            <B1NormalTextTitle className="faint-color">
                                                ${getDollarPrice(highestBidder.price)}
                                            </B1NormalTextTitle>
                                            </div>
                                        </div>
                                        </>
                                    ) : offer && offer.status === "pending" ? (
                                        <MidTextTitle>
                                            Be the first one to bid!
                                        </MidTextTitle>
                                    ) : (
                                        <MidTextTitle>No bidders on this auction.</MidTextTitle>
                                    )}
                                </Col>
                                <Col md="6" className="pl-md-4">
                                    {offer && offer.status === "completed" && (
                                        <MidTextTitle className="mt-3">Auction Ended</MidTextTitle>
                                    )}
                                    {isExpired() && (
                                        <MidTextTitle className="mt-3">
                                        Auction Expired
                                        </MidTextTitle>
                                    )}
                                    {offer && offer.status === "pending" && !isExpired() && (
                                        <>
                                        <MidTextTitle className="faint-color">
                                            Auction ends
                                        </MidTextTitle>
                                        {
                                            remainTimeObj && remainTimeObj.sec ? (
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
                                            ) : ''
                                        }
                                        </>
                                    )}
                                </Col>
                            </Row>
                            <div className="row pt-2">
                                {isOwner() && isOwner().user.wallet !== walletAddress && !isBidder() ? (
                                    !isExpired() && <div className="col-12 col-sm-6"><Button className="btn-primary mr-2 mb-2" onClick={() => onPlaceBidClicked()}>Place a Bid</Button></div>
                                    ) : (
                                        isOwner() && isOwner().user.wallet === walletAddress && (offer.status !== 'pending' || isExpired()) &&
                                        <div className="col-12 col-sm-6"><Button className="btn-primary mr-2 mb-2" onClick={() => {setShowResellDialog(true);}}>Resell</Button></div>
                                    )
                                }
                                <div className="col-12 col-sm-6"><Button className="btn-gray mr-2">Share</Button></div>
                            </div>
                        </div>
                    </div>
                </Container>
            }
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
            {isTransProgressing && <LoadingSpinner></LoadingSpinner>}
            <ResellNftModal
                show={showResellDialog}
                handleClose={() => {
                    setShowResellDialog(false);
                }}
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
}

export default TokenDetail;