import itemImage from "assets/imgs/nft-image3.png";
import itemImage2 from "assets/imgs/nft-image2.png";
import itemMember from "assets/imgs/seller6.png";
import itemLogo from "assets/imgs/puml-logo-footer.png";
import imgAvatar from "assets/imgs/avatar.png";

import { Button, Container, Image } from "react-bootstrap";
import Tabs from "components/common/Tabs";
import Layout from "components/Layout";
import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from 'react-router-dom';
import { NotificationManager } from "react-notifications";

import { useAppDispatch, useAppSelector } from "store/hooks";
import { getNftServiceFee, getETHUSDTCurrency } from "store/Nft/nft.selector";
import { getMyInfo, getWalletAddress } from "store/User/user.selector";
import { connectUserWallet, getWalletBalance } from "store/User/user.slice";
import TokenController from "controller/TokenController";
import Utility from "service/utility";
import { BigNumberAdd, BigNumberMul, toFixed } from "service/number";
import configs from "configs";
import SmartContract from "ethereum/Contract";
import OfferController from "controller/OfferController";

interface TokenDetailProps { }

const TokenDetail: React.FC<TokenDetailProps> = () => {
    const layoutView = useRef(null);

    const auctionGap = 0.001;
    const params: any = useParams();
    const history = useHistory();
    const dispatch = useAppDispatch();
    const serviceFee = useAppSelector(getNftServiceFee);
    const ethDollarPrice = useAppSelector(getETHUSDTCurrency);
    const walletAddress = useAppSelector(getWalletAddress);
    const userInfo = useAppSelector(getMyInfo);
    const [offer, setOffer] = useState<any>(null);
    const [token, setToken] = useState<any>({});
    const [histories, setHistories] = useState([]);
    const [bidHistory, setBidHistory] = useState<any[]>([]);
    const [highestBidder, setHighestBidder] = useState<any>(null);
    const [owner, setOwner] = useState<any>(null);
    const [creator, setCreator] = useState<any>(null);
    const [remainTimeObj, setRemainTimeObj] = useState<any>({});

    const tokenImgEl = useRef(null);
    const tokenVideoEl = useRef(null);
    const [sizeObj, setSizeObj] = useState<any>(null);
    const [timeObj, setTimeObj] = useState<any>(null);

    const [showBuyTokenModal, setShowBuyTokenModal] = useState(false);
    const [showPlaceBidModal, setShowPlaceBidModal] = useState(false);
    const [isTransProgressing, setTransProgressing] = useState(false);
    const [likeDisable, setLikeDisable] = useState(false);
    const [likes, setLikes] = useState(0);
    const [selectedTab, setSelectedTab] = useState(0);

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
            const { offer, history, token } = await TokenController.getById(params.id);
            history.sort(function (a: any, b: any) {
                return b.date - a.date;
            });
            setHistories(history);
            const bids: any[] = offer && offer.bids ? [...offer.bids] : [];
            bids.sort(function (a: any, b: any) {
                return b.price - a.price;
            });
            const owners = token ? token.owners : [];
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
            if (owners.length) setOwner(owners[0]);
            if (token.creator) setCreator(token.creator);
        }
    };

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
        return `${configs.DEPLOY_URL}/content/collection/xsigma.jpg`;
    };

    const isPicture = () => {
        if (token.media) {
            let media = token.media.toLowerCase();
            if (media.includes("png") || media.includes("gif") || media.includes("jpeg") || media.includes("jpg") || media.includes("webp")) return true;
            return false;
        }
        return false;
    };

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

        if (owner && userInfo && owner.user && owner.user._id === userInfo._id) {
            NotificationManager.info("You already owned this item.", "Info");
            return false;
        }
        return true;
    };

    const onDirectBuyClicked = () => {
        if (checkOfferReady()) setShowBuyTokenModal(true);
    };

    const onPlaceBidClicked = () => {
        if (checkOfferReady()) setShowPlaceBidModal(true);
    };

    const directBuy = async () => {
        try {
            if (offer) {
                setTransProgressing(true);
                let buyResult = await SmartContract.directBuy(
                    token.chain_id,
                    offer.offer_price
                );
                if (buyResult.success && buyResult.transactionHash) {
                    dispatch(getWalletBalance());
                    await OfferController.directBuy(offer._id, {
                        price: offer.offer_price,
                        hash: buyResult.transactionHash,
                    });
                    loadOffer();
                    NotificationManager.success(
                        "You buy this item successfully.",
                        "Success"
                    );
                    setShowBuyTokenModal(false);
                } else {
                    NotificationManager.error(
                        "You failed to buy this item directly.",
                        "Error"
                    );
                }
                setTransProgressing(false);
            }
        } catch (err) {
            NotificationManager.error(
                "You failed to buy this item directly.",
                "Error"
            );
            setTransProgressing(false);
        }
    };

    const isDirectSale = () => {
        if (offer) return offer.type === "direct" || offer.type === "both";
        return false;
    };

    const isAuction = () => {
        if (offer) return offer.type === "auction" || offer.type === "both";
        return false;
    };

    const getDollarPrice = (ethValue: any) => {
        if (ethValue) {
            let dollarPrice = BigNumberMul(ethValue, ethDollarPrice).toFixed(1);
            return dollarPrice;
        }
        return 0;
    };

    const getOfferPriceWithServiceFee = () => {
        let overFlowPer = 100 + serviceFee;
        return toFixed((offer.offer_price * overFlowPer) / 100, 3);
    };

    const getAvatar = (type: any) => {
        if (type === "creator" && creator && creator.avatar)
            return `${configs.DEPLOY_URL}${creator.avatar}`;
        if (type === "owner" && owner && owner.user && owner.user.avatar)
            return `${configs.DEPLOY_URL}${owner.user.avatar}`;
        if (
            type === "highestBidder" &&
            highestBidder &&
            highestBidder.user &&
            highestBidder.user.avatar
        )
            return `${configs.DEPLOY_URL}${highestBidder.user.avatar}`;
        return imgAvatar;
    };

    const Details = () => (
        <div className="d-flex flex-column pt-2">
            <div className="d-flex flex-row align-items-center item-address pr-2 pb-3">
                <Image src={itemLogo} className="member-image"></Image>
                <div className="address">0x2545584586xs54664sd6</div>
            </div>
            <div className="item-description pb-4">
                <div className="title">Description</div>
                <div className="content pt-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis</div>
            </div>
            <div className="item-description pb-4">
                <div className="title">10% Royalties</div>
                <div className="content pt-1">For every future sale. You will recieve 10% of the sold price</div>
            </div>
        </div>
    );
    const Bid = () => (
        <div>
            <div className="d-flex flex-row align-items-center pb-4">
                <Image src={itemImage} className="member-image mr-2" alt="image"></Image>
                <div className="history-item">
                    <div className="history-price">
                        <span>30.000.00PUML • </span>
                        <span className="priceby">by Twerky Club</span>
                    </div>
                    <div className="history-time">12/05/2021</div>
                </div>
            </div>
            <div className="d-flex flex-row align-items-center pb-4">
                <Image src={itemImage2} className="member-image mr-2" alt="image"></Image>
                <div className="history-item">
                    <div className="history-price">
                        <span>30.000.00PUML • </span>
                        <span className="priceby">by Twerky Club</span>
                    </div>
                    <div className="history-time">12/05/2021</div>
                </div>
            </div>
        </div>
    );
    const History = () => (
        <div>
            <div className="d-flex flex-row align-items-center pb-4">
                <Image src={itemImage} className="member-image mr-2" alt="image"></Image>
                <div className="history-item">
                    <div className="history-price">
                        <span>Bid 30.000.00PUML • </span>
                        <span className="priceby">by Mr Tuna</span>
                    </div>
                    <div className="history-time">12/05/2021</div>
                </div>
            </div>
            <div className="d-flex flex-row align-items-center pb-4">
                <Image src={itemImage2} className="member-image mr-2" alt="image"></Image>
                <div className="history-item">
                    <div className="history-price">
                        <span>Bid cancelled</span>
                        <span className="priceby">by Mr Tuna</span>
                    </div>
                    <div className="history-time">12/05/2021</div>
                </div>
            </div>
        </div>
    );

    const tabs = [
        { label: "Details", Component: Details },
        { label: "Bids", Component: Bid },
        { label: "History", Component: History },
    ];

    return (
        <Layout ref={layoutView}>
            <Container className="buyitem-container">
                <div className="row">
                    <div className="col-12 col-md-6 d-flex flex-row align-items-center pb-4">
                        <Image src={itemImage} className="item-image"></Image>
                    </div>
                    <div className="col-12 col-md-6 d-flex flex-column flex-fill item-info">
                        <div className="item-title pb-4">{token.name}</div>
                        <div className="item-price pb-4">
                            <span className="for-sale">For Sale • Highest Bid </span>
                            <span className="price-puml">{ offer ? getDollarPrice(offer.offer_price) : '' }PUML</span>
                        </div>
                        <div className="d-flex flex-row">
                            <div className="d-flex flex-row align-items-center item-members pr-4" onClick={() => history.push(`/users/2`)}>
                                <Image src={itemMember} className="member-image mr-2"></Image>
                                <div className="d-flex flex-column pt-2">
                                    <div className="member-type pb-1">Creator</div>
                                    <div className="member-name">{owner ? owner.user : ''}</div>
                                </div>
                            </div>
                            <div className="d-flex flex-row align-items-center item-members pr-2" onClick={() => history.push(`/users/3`)}>
                                <Image src={itemImage} className="member-image mr-2"></Image>
                                <div className="d-flex flex-column pt-2">
                                    <div className="member-type pb-1">Collection</div>
                                    <div className="member-name">{owner ? owner.user : ''}</div>
                                </div>
                            </div>
                        </div>

                        <div className="buyitem-tab pt-2">
                            <Tabs
                                className="mt-4"
                                selectedTab={selectedTab}
                                onClick={setSelectedTab}
                                tabs={tabs}
                            />
                        </div>

                        <div className="d-flex flex-row align-items-center">
                            <Image src={itemImage} className="member-image mb-2 mr-2" alt="image"></Image>
                            <div>
                                <div className="item-bid">
                                    <span className="bid-attr">Highest bid by </span>
                                    <span className="bid-member">{owner
                                     ? owner.user.name : ""}</span>
                                </div>
                                <div className="item-price1 pt-2">
                                    <span className="price-puml">30.0000PUML</span>
                                    <span className="for-sale"> • 0.55ETH • $567.89 for 1 edition</span>
                                </div>
                            </div>
                        </div>
                        <div className="row pt-2">
                            <div className="col-12 col-sm-6"><Button className="btn-primary mr-2 mb-2">Place a Bid</Button></div>
                            <div className="col-12 col-sm-6"><Button className="btn-gray mr-2">Share</Button></div>
                        </div>
                    </div>
                </div>
            </Container>
        </Layout>
    );
}

export default TokenDetail;