import React, { Fragment, useEffect, useState, useRef } from "react";
import { Link, useParams, useHistory } from "react-router-dom";

import { Row, Col, Dropdown, Button, Image, Nav, Tab } from "react-bootstrap";
import { NotificationManager } from "react-notifications";
import Layout from "components/Layout";

import {
    BigTitle,
    MidTextTitle,
    B2NormalTextTitleGrey,
    SmallTextTitleGrey,
    SmallTextTitle,
    NormalTextTitle,
    SubDescription,
    FilterIcon
} from "components/common/common.styles";
import TokenController from "controller/TokenController";
import CollectionController from "controller/CollectionController";
import LoadingBar from "components/common/LoadingBar";
import imgAvatar from "assets/imgs/avatar.png";
import imgCopyIcon from "assets/imgs/copyicon.svg";
import NoItem from "components/common/noItem";
import { useAppSelector } from "store/hooks";
import { getWalletAddress } from "store/User/user.selector";
import { FaFacebook, FaMailBulk, FaTelegram, FaTwitter } from "react-icons/fa";
import UserController from "controller/UserController";
import Utility from "service/utility";
import configs from "configs";
import CollectionItem from "components/collection/CollectionItem";
import { FaTag, FaHeart, FaCheck } from "react-icons/fa";
import { BsLightningFill } from 'react-icons/bs';
import { BiTransfer } from 'react-icons/bi';
import { RiAuctionFill } from 'react-icons/ri';
import { ImDiamonds } from 'react-icons/im';
import { AiOutlineCloudUpload } from 'react-icons/ai';

import Tabs from "components/common/Tabs";
import verifyImg from "assets/imgs/verify.svg";
import copyImg from "assets/imgs/copy.png";
import back from "assets/imgs/hot-back.svg";

interface UserProfileProps { }

const _categories = [
    { title: "On sale", count: 0, active: false, path: "on_sale" },
    { title: "Collectibles", count: 0, active: false, path: "collectibles" },
    { title: "Expiring auctions", count: 0, active: false, path: "expiring" },
];

const _userInfo = {
    _id: "",
    name: "",
    wallet: "",
    date_create: "",
    avatar: "",
    cover: "",
    verified: false,
};

const _filters = [
    { name: 'Listings', selected: false, filter: 'listed', icon: <FaTag /> },
    { name: 'Purchases', selected: false, filter: 'purchased', icon: <ImDiamonds /> },
    { name: 'Sales', selected: false, filter: 'minted', icon: <BsLightningFill /> },
    { name: 'Transfers', selected: false, filter: 'transfered', icon: <BiTransfer /> },
    { name: 'Bids', selected: false, filter: 'offered', icon: <RiAuctionFill /> },
    { name: 'Likes', selected: false, filter: 'liked', icon: <FaHeart /> },
    { name: 'Followings', selected: false, filter: 'following', icon: <FaCheck /> },
];

const _royalty = {
    royalties: 0,
    tokens: 0,
    collections: 0
}

const UserProfile: React.FC<UserProfileProps> = () => {
    const layoutView = useRef(null);
    const params: any = useParams();
    const history = useHistory();
    const [pages, setPages] = useState(1);
    const [pageNum, setPageNumber] = useState(1);
    const [userInfo, setUserInfo] = useState(_userInfo);
    const [categories, setCategories] = useState(_categories);
    const [itemList, setItemList] = useState([]);
    const [collections, setCollections] = useState([]);
    const [selectedTab, setSelectedTab] = useState(0);
    const [walletAddress, setWalletAddress] = useState('');
    const [followedAllow, setFollowedAllow] = useState(true);
    const [filters] = useState(_filters);
    const [selectedFilter, setSelectedFilter] = useState('');
    const [filteredActivities, setFilteredActivities] = useState([]);
    const myWallet = useAppSelector(getWalletAddress);
    const [royalty, setRoyalty] = useState(_royalty);

    useEffect(() => {
        const loadTokensAndCollections = async () => {
            setWalletAddress(params.walletAddress);
            if (myWallet && myWallet === walletAddress) {
                history.push('/items');
            }
            if (walletAddress) {
                let data = await UserController.userStats(walletAddress);
                if (data.user) {
                    setUserInfo(data.user);
                    setFollowedAllow(!data.user.followed);
                }
                if (data.stats) {
                    for (let i = 0; i < categories.length; i++) {
                        const category = categories[i];
                        if (data.stats[category.path]) {
                            category.count = data.stats[category.path];
                        } else {
                            category.count = 0;
                        }
                    }
                    setCategories(categories);
                }
                let { collections } = await CollectionController.getByUserId(data.user._id);
                setCollections(collections);
            }
            loadItems();
        };
        loadTokensAndCollections();
    }, [params, categories, walletAddress]);

    useEffect(() => {
        loadItems();
    }, [selectedTab, pageNum]);

    const onFollow = async () => {
        if (followedAllow) {
            await UserController.userFollow(userInfo._id).then((res: any) => {
                if (res.status === 200) {
                    NotificationManager.success(
                        'Successfully followed!',
                        "Success"
                    );
                    setFollowedAllow(false);
                }
            });
        } else {
            await UserController.userUnFollow(userInfo._id).then((res: any) => {
                if (res.status === 200) {
                    NotificationManager.success(
                        'Successfully unfollowed!',
                        "Success"
                    );
                    setFollowedAllow(true);
                }
            });
        }
    }

    const loadItems = async () => {
        if (walletAddress) {
            let { items, pages } = await TokenController.getItems(walletAddress, _categories[selectedTab].path, pageNum);
            if (pageNum === 1) {
                setPages(pages);
            }
            setItemList(pageNum === 1 ? items : itemList.concat(items));
        }
    }

    const onSelectType = (type: any) => {
        setSelectedTab(type);
        setPages(1);
        setPageNumber(1);
    };

    const copyName = async () => {
        if (userInfo) {
            let element = document.querySelector(".copy-icon");
            element?.classList.add("clicked");
            setTimeout(() => {
                element?.classList.remove("clicked");
            }, 1000);
            await navigator.clipboard.writeText(`${userInfo.name}`);
        }
    };

    const getUserImgAvatar = () => {
        if (userInfo.avatar) return `${configs.DEPLOY_URL}${userInfo.avatar}`;
        return imgAvatar;
    };

    useEffect(() => {
        if (selectedFilter) {
            setFilteredActivities(itemList.filter((token: { type: String; }) => token.type === selectedFilter));

        } else {
            setFilteredActivities(itemList);
        }
    }, [itemList]);

    const getFilterClass = (val: string) => {
        if (selectedFilter === val)
            return "filter-btn active";
        return "filter-btn";
    };

    const onSelectFilter = (filter: String) => {
        if (selectedFilter === filter || filter === '') {
            setSelectedFilter('');
            setFilteredActivities(itemList);
        } else {
            setSelectedFilter(`${filter}`);
            setFilteredActivities(itemList.filter((token: { type: String; }) => token.type === filter));
        }
    }

    const OnSale = () => (
        <div className="row pt-4">
            {/* {
                nftlist.map((nft, index) => (
                    <NftItemCard key={index} url={nft.url} title={nft.title} price={nft.price} price_eth={nft.price_eth} content={nft.content}></NftItemCard>
                ))
            } */}
        </div>
    );

    const tabs = [
        {
            label: "On Sale",
            Component: OnSale
        },
        {
            label: "Collectibles",
            Component: OnSale
        },
        {
            label: "Expiring auctions",
            Component: OnSale
        }
    ];

    return (
        <Layout className="userprofile-container" ref={layoutView}>
            <div className="d-flex flex-column align-items-center">
                <div style={{ backgroundImage: `url(${configs.DEPLOY_URL}${userInfo.cover})` }} className="background-item"></div>
                {/* <Image className="hot-image" src={account_data.img}></Image> */}
                <div className="d-flex flex-row align-items-center justify-content-center">
                    <div className="avatar" style={{ backgroundImage: `url(${getUserImgAvatar()})` }}>
                        {
                            userInfo && userInfo.verified && (
                                <Image className="verify" src={verifyImg}></Image>
                            )
                        }
                    </div>
                </div>
                <div className="display user-name pb-3">{userInfo ? userInfo.name : ''}</div>
                <div className="d-flex flex-row align-items-center pb-3">
                    <div className="token-address pr-2">{userInfo.wallet}</div>
                    <Image src={copyImg} className="token-copy"></Image>
                </div>
                <div className="d-flex flex-row align-items-center pb-2">
                    <p className="font-weight-bold text-color pr-1">20</p>
                    <p className="text-gray font-weight-bold pr-3">Followers</p>
                    <p className="font-weight-bold text-color pr-1">3k</p>
                    <p className="text-gray font-weight-bold">Following</p>
                </div>
                <Link to="/" className="link-follow mt-2" >
                    <Button className="mr-2 mr-lg-4 btn-primary">
                        Follow
                    </Button>
                </Link>
            </div>
            <div className="userprofile-tab">
                <Tabs
                    className="mt-4"
                    selectedTab={selectedTab}
                    onClick={setSelectedTab}
                    tabs={tabs}
                />
            </div>
        </Layout>
    );
}

export default UserProfile;