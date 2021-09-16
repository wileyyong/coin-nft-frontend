/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";

import { Row, Col, Button, Image, Nav, Tab } from "react-bootstrap";
import { NotificationManager } from "react-notifications";
import Layout from "components/Layout";
import TokenView from "components/token/TokenView";
import {
    BigTitle,
    B2NormalTextTitleGrey,
    NormalTextTitle,
    FilterIcon
} from "components/common/common.styles";
import TokenController from "controller/TokenController";
import CollectionController from "controller/CollectionController";
import LoadingBar from "components/common/LoadingBar";
import imgAvatar from "assets/imgs/avatar.png";
import imgCopyIcon from "assets/imgs/copy.png";
import verifyImg from "assets/imgs/verify.svg";
import NoItem from "components/common/noItem";
import { useAppSelector } from "store/hooks";
import { getWalletAddress } from "store/User/user.selector";
import UserController from "controller/UserController";
import configs from "configs";
import Utility from "service/utility";
import CollectionItem from "components/collection/CollectionItem";
import ActivityItem from "components/token/ActivityItem";
import OnSaleItem from "components/myitems/OnSaleItem";
import TokenItem from "components/token/TokenItem";
import { FaTag, FaHeart, FaCheck } from "react-icons/fa";
import { BsLightningFill } from 'react-icons/bs';
import { BiTransfer } from 'react-icons/bi';
import { RiAuctionFill } from 'react-icons/ri';
import { ImDiamonds } from 'react-icons/im';
import CoverImage from 'assets/imgs/default_rect.svg';

interface UserProfileProps { }

const _categories = [
    { title: "On sale", count: 0, active: false, path: "on_sale" },
    { title: "Owned", count: 0, active: false, path: "collectibles" },
    { title: "Created", count: 0, active: false, path: "created" },
    { title: "Liked", count: 0, active: false, path: "liked" },
    { title: "Activity", count: 0, active: false, path: "activity" },
    { title: "Following", count: 0, active: false, path: "following" },
    { title: "Followers", count: 0, active: false, path: "followers" },
];

const _userInfo = {
    _id: "",
    name: "",
    wallet: "",
    date_create: "",
    avatar: "",
    cover: "",
    verified: false
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

const UserProfile: React.FC<UserProfileProps> = () => {
    const params: any = useParams();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [pages, setPages] = useState(1);
    const [pageNum, setPageNumber] = useState(1);
    const [userInfo, setUserInfo] = useState(_userInfo);
    const [categories, setCategories] = useState(_categories);
    const [itemList, setItemList] = useState([]);
    const [collections, setCollections] = useState([]);
    const [selectedTab, setSelectedTab] = useState("collectibles");
    const [walletAddress, setWalletAddress] = useState('');
    const [walletHiddenText, setHiddenText] = useState('');
    const [followedAllow, setFollowedAllow] = useState(true);
    const [filters] = useState(_filters);
    const [selectedFilter, setSelectedFilter] = useState('');
    const [filteredActivities, setFilteredActivities] = useState([]);
    const myWallet = useAppSelector(getWalletAddress);
    const [following, setFollowing] = useState(0);
    const [followers, setFollowers] = useState(0);

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

                        if (category.path === "following") setFollowing(category.count);
                        if (category.path === "followers") setFollowers(category.count);
                    }

                    setCategories(categories);
                }
                let { collections } = await CollectionController.getByUserId(data.user._id);
                setCollections(collections);
            }
            loadItems();
        };
        loadTokensAndCollections();
        setHiddenText(Utility.getHiddenWalletAddress(walletAddress));
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
                    categories[6].count += 1;
                    setFollowers(followers + 1);
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
                    categories[6].count -= 1;
                    setFollowers(followers - 1);
                }
            });
        }
    }

    const loadItems = async () => {
        if (walletAddress) {
            setLoading(true);
            let { items, pages } = await TokenController.getItems(walletAddress, selectedTab, pageNum);

            if (pageNum === 1) {
                setPages(pages);
            }
            setItemList(pageNum === 1 ? items : itemList.concat(items));
            setLoading(false);
        }
    }

    const onSelectType = (type: any) => {
        setSelectedTab(type);
        setPages(1);
        setPageNumber(1);
    };

    const copyWalletAddress = async () => {
        setHiddenText("Copied!");
        setTimeout(() => {
          setHiddenText(Utility.getHiddenWalletAddress(walletAddress));
        }, 2000);
        await navigator.clipboard.writeText(walletAddress);
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

    const getFilterColor = (type: String) => {
        if (selectedFilter === type) {
            switch (type) {
                case 'following':
                    return 'rgb(109, 188, 0)';
                case 'liked':
                    return 'rgb(255, 158, 18)';
                case 'listed':
                    return 'rgb(0, 147, 255)';
                case 'purchased':
                    return 'rgb(255, 199, 90)';
                case 'minted':
                    return 'rgb(235, 88, 73)';
                case 'transfered':
                    return 'rgb(177, 89, 220)';
                case 'offered':
                    return 'rgb(247, 109, 192)';
                default:
                    break;
            }
        }
    };

    const onSelectFilter = (filter: String) => {
        setLoading(true);
        if (selectedFilter === filter || filter === '') {
            setSelectedFilter('');
            setFilteredActivities(itemList);
        } else {
            setSelectedFilter(`${filter}`);
            setFilteredActivities(itemList.filter((token: { type: String; }) => token.type === filter));
        }
        setLoading(false);
    }

    return (
        <Layout className="userprofile-container">
            <div className="d-flex flex-column align-items-center">
                <div style={{ backgroundImage: `url(${userInfo.cover ? configs.DEPLOY_URL + userInfo.cover : CoverImage})` }} className="background-item" />
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
                    <div className="token-address pr-2" >{walletHiddenText}</div>
                    <Image src={imgCopyIcon} className="token-copy" onClick={() => { copyWalletAddress(); }}></Image>
                </div>
                <div className="d-flex flex-row align-items-center pb-4">
                    <p className="font-weight-bold text-color pr-1">{followers}</p>
                    <p className="text-gray font-weight-bold pr-3">Followers</p>
                    <p className="font-weight-bold text-color pr-1">{following}</p>
                    <p className="text-gray font-weight-bold">Following</p>
                </div>
                <div className="link-follow mt-2">
                    <Button
                        variant="primary"
                        className="mr-2 mr-lg-4"
                        onClick={() => onFollow()}
                    >
                        <span>{followedAllow ? 'Follow' : 'Unfollow'}</span>
                    </Button>
                </div>
            </div>
            <div className="pt-4">
                <Tab.Container defaultActiveKey="collectibles" id="items_tabs">
                    <div className="link-section px-md-5">
                        <Nav defaultActiveKey="collectibles">
                            {categories.map((category, index) => (
                                category.path !== 'followers' && category.path !== 'following' &&
                                <Nav.Item
                                    key={index}
                                    onClick={() => onSelectType(category.path)}
                                >
                                    <Nav.Link eventKey={category.path}>
                                        {category.title}
                                        <span className={category.count ? 'fill-count' : ''}>{category.count}</span>
                                    </Nav.Link>
                                </Nav.Item>
                            ))}
                        </Nav>
                    </div>
                    <div className="item-columns">
                        <Tab.Content>
                            <Tab.Pane eventKey="on_sale">
                                <div className="auction-section">
                                    <BigTitle>On Sale Items</BigTitle>
                                    {loading && pageNum === 1 ? (
                                        <div className="text-center mt-5">
                                            <LoadingBar />
                                        </div>
                                    ) : (
                                        <div className="row mt-3 mt-md-5">
                                            {itemList.length > 0 ? (
                                                itemList.map((saleItem: any, i: number) => (
                                                    <OnSaleItem key={i} item={saleItem}></OnSaleItem>
                                                ))
                                            ) : (
                                                <NoItem
                                                    title="No items found"
                                                    description="Come back soon! Or try to browse something for you on our marketplace"
                                                    btnLink="/"
                                                    btnLabel="Browse marketplace"
                                                />
                                            )}
                                        </div>
                                    )}
                                    {
                                        loading && pageNum > 1 ? (
                                            <div className="text-center my-3">
                                                <LoadingBar />
                                            </div>
                                        ) : (
                                            itemList.length > 0 && pages > pageNum && (
                                                <div className="my-3 d-flex justify-content-center">
                                                    <Button
                                                        variant="primary"
                                                        className="btn-round w-50 outline-btn"
                                                        onClick={() => setPageNumber(pageNum + 1)}
                                                    >
                                                        <span>Load More</span>
                                                    </Button>
                                                </div>
                                            )
                                        )
                                    }
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="liked">
                                <div className="tokens-section">
                                    <BigTitle>Liked Tokens</BigTitle>
                                    {loading && pageNum === 1 ? (
                                        <div className="text-center mt-5">
                                            <LoadingBar />
                                        </div>
                                    ) : (
                                        <div className="item-list mt-3 mt-md-5">
                                            {itemList.length > 0 ? (
                                                itemList.map((item: any, i: number) => (
                                                    <TokenItem item={item} key={i} />
                                                ))
                                            ) : (
                                                <NoItem
                                                    title="No tokens found"
                                                    description="Come back soon! Or try to browse something for you on our marketplace"
                                                    btnLink="/"
                                                    btnLabel="Browse marketplace"
                                                />
                                            )}
                                        </div>
                                    )}
                                    {
                                        loading && pageNum > 1 ? (
                                            <div className="text-center my-3">
                                                <LoadingBar />
                                            </div>
                                        ) : (
                                            itemList.length > 0 && pages > pageNum && (
                                                <div className="my-3 d-flex justify-content-center">
                                                    <Button
                                                        variant="primary"
                                                        className="btn-round w-50 outline-btn"
                                                        onClick={() => setPageNumber(pageNum + 1)}
                                                    >
                                                        <span>Load More</span>
                                                    </Button>
                                                </div>
                                            )
                                        )
                                    }
                                </div>
                            </Tab.Pane>

                            <Tab.Pane eventKey="created">
                                <div className="tokens-section">
                                    <BigTitle>Created Tokens</BigTitle>
                                    {loading && pageNum === 1 ? (
                                        <div className="text-center mt-5">
                                            <LoadingBar />
                                        </div>
                                    ) : (
                                        <div className="row mt-3 mt-md-5">
                                            {itemList.length > 0 ? (
                                                itemList.map((item: any, i: number) => (
                                                    <TokenView key={i} item={item} user={userInfo}></TokenView>
                                                ))
                                            ) : (
                                                <NoItem
                                                    title="No tokens found"
                                                    description="Come back soon! Or try to browse something for you on our marketplace"
                                                    btnLink="/"
                                                    btnLabel="Browse marketplace"
                                                />
                                            )}
                                        </div>
                                    )}
                                    {
                                        loading && pageNum > 1 ? (
                                            <div className="text-center my-3">
                                                <LoadingBar />
                                            </div>
                                        ) : (
                                            itemList.length > 0 && pages > pageNum && (
                                                <div className="my-3 d-flex justify-content-center">
                                                    <Button
                                                        variant="primary"
                                                        className="btn-round w-50 outline-btn"
                                                        onClick={() => setPageNumber(pageNum + 1)}
                                                    >
                                                        <span>Load More</span>
                                                    </Button>
                                                </div>
                                            )
                                        )
                                    }
                                </div>
                                <div className="collections-section">
                                    <BigTitle>Created Collections</BigTitle>
                                    <div className="row mt-3 mt-md-5">
                                        {collections.length > 0 ? (
                                            collections.map(
                                                (collection: any, i: number) =>
                                                    collection._id && (
                                                        <CollectionItem
                                                            key={i}
                                                            item={collection}
                                                        ></CollectionItem>
                                                    )
                                            )
                                        ) : (
                                            <NoItem
                                                title="No collections found"
                                                description="Come back soon! Or try to browse something for you on our marketplace"
                                                btnLink="/"
                                                btnLabel="Browse marketplace"
                                            />
                                        )}
                                    </div>
                                    <div className="notice-view">
                                        <div className="notice py-4">
                                            <B2NormalTextTitleGrey>
                                                Create collections (your own storefonts), upload digital
                                                creations, configure your commision, and sell NFTs to
                                                your fans - all for free! You can also manage smart
                                                contracts than you created outside ofNFT’s.
                                            </B2NormalTextTitleGrey>
                                        </div>
                                        <div className="btn-section">
                                            <Link to="/collectible">
                                                <Button
                                                    variant="primary"
                                                    className="default-btn-size btn-create fill-btn"
                                                >
                                                    <span>Create NFT</span>
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="collectibles">
                                {loading && pageNum === 1 ? (
                                    <div className="mt-5 text-center">
                                        <LoadingBar />
                                    </div>
                                ) : (
                                    <Fragment>
                                        <div className="tokens-section">
                                            <BigTitle>Tokens</BigTitle>
                                            <div className="row mt-3 mt-md-5">
                                                {itemList.length > 0 ? (
                                                    itemList.map((token: any, i: number) => (
                                                        <TokenView key={i} item={token} user={userInfo}></TokenView>
                                                    ))
                                                ) : (
                                                    <NoItem
                                                        title="No tokens found"
                                                        description="Come back soon! Or try to browse something for you on our marketplace"
                                                        btnLink="/"
                                                        btnLabel="Browse marketplace"
                                                    />
                                                )}
                                            </div>
                                            {
                                                loading && pageNum > 1 ? (
                                                    <div className="text-center my-3">
                                                        <LoadingBar />
                                                    </div>
                                                ) : (
                                                    itemList.length > 0 && pages > pageNum && (
                                                        <div className="my-3 d-flex justify-content-center">
                                                            <Button
                                                                variant="primary"
                                                                className="btn-round w-50 outline-btn"
                                                                onClick={() => setPageNumber(pageNum + 1)}
                                                            >
                                                                <span>Load More</span>
                                                            </Button>
                                                        </div>
                                                    )
                                                )
                                            }
                                        </div>
                                        <div className="collections-section">
                                            <BigTitle>Collections</BigTitle>
                                            <div className="row justify-content-start mt-3 mt-md-5">
                                                {collections.length > 0 ? (
                                                    collections.map(
                                                        (collection: any, i: number) =>
                                                            collection._id && (
                                                                <CollectionItem
                                                                    key={i}
                                                                    item={collection}
                                                                ></CollectionItem>
                                                            )
                                                    )
                                                ) : (
                                                    <NoItem
                                                        title="No collections found"
                                                        description="Come back soon! Or try to browse something for you on our marketplace"
                                                        btnLink="/"
                                                        btnLabel="Browse marketplace"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </Fragment>
                                )}
                                <div className="notice-view">
                                    <div className="notice py-4">
                                        <B2NormalTextTitleGrey>
                                            Create collections (your own storefonts), upload digital
                                            creations, configure your commision, and sell NFTs to your
                                            fans - all for free! You can also manage smart contracts
                                            than you created outside ofNFT’s.
                                        </B2NormalTextTitleGrey>
                                    </div>
                                    <div className="btn-section">
                                        <Link to="/collectible">
                                            <Button
                                                variant="primary"
                                                className="default-btn-size btn-create fill-btn"
                                            >
                                                <span>Create NFT</span>
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="activity">
                                <div className="tokens-section">
                                    <BigTitle>Activities</BigTitle>
                                    {loading && pageNum === 1 ? (
                                        <div className="text-center mt-5">
                                            <LoadingBar />
                                        </div>
                                    ) : (
                                        <div className="item-list mt-3 mt-md-5">
                                            <Row>
                                                <Col md="8">
                                                        {filteredActivities.length > 0 ? (
                                                            <Row>
                                                                {
                                                                    filteredActivities.map((item: any, i: number) => (
                                                                        <Col key={i} xl="6">
                                                                            <ActivityItem item={item}></ActivityItem>
                                                                        </Col>
                                                                    ))
                                                                }
                                                            </Row>
                                                        ) : (
                                                            <Row className="w-100 justify-content-center">
                                                                <NoItem
                                                                    title="No activities found"
                                                                    description="Come back soon! Or try to browse something for you on our marketplace"
                                                                    btnLink="/"
                                                                    btnLabel="Browse marketplace"
                                                                />
                                                            </Row>
                                                        )}
                                                    {
                                                        loading && pageNum > 1 ? (
                                                            <div className="my-3 d-flex justify-content-center">
                                                                <LoadingBar />
                                                            </div>
                                                        ) : (
                                                            filteredActivities.length > 0 && pages > pageNum && (
                                                                <div className="my-3 d-flex justify-content-center">
                                                                    <Button
                                                                        variant="primary"
                                                                        className="btn-round w-50 outline-btn"
                                                                        onClick={() => setPageNumber(pageNum + 1)}
                                                                    >
                                                                        <span>Load More</span>
                                                                    </Button>
                                                                </div>
                                                            )
                                                        )
                                                    }
                                                </Col>
                                                <Col md="4">
                                                    <div className="sticky-filters">
                                                        <div className="filter-header mb-4">
                                                            <NormalTextTitle className="mr-3">
                                                                Filters
                                                            </NormalTextTitle>
                                                            {
                                                                selectedFilter && (
                                                                    <NormalTextTitle className="filter-reset" onClick={() => { onSelectFilter('') }}>
                                                                        Reset filter
                                                                    </NormalTextTitle>
                                                                )
                                                            }
                                                        </div>
                                                        <div className="filter-buttons">
                                                            {
                                                                filters.map((filter, index) => {
                                                                    return (
                                                                        <div
                                                                            className={getFilterClass(filter.filter)}
                                                                            key={index}
                                                                            onClick={() => { onSelectFilter(`${filter.filter}`) }}
                                                                            style={{ backgroundColor: getFilterColor(filter.filter) }}
                                                                        >
                                                                            <FilterIcon className="mr-3">
                                                                                {filter.icon}
                                                                            </FilterIcon>
                                                                            <span>{filter.name}</span>
                                                                        </div>
                                                                    );
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>

                                        </div>
                                    )}
                                    <div className="notice-view">
                                        <div className="notice py-4">
                                            <B2NormalTextTitleGrey>
                                                Create collections (your own storefonts), upload digital
                                                creations, configure your commision, and sell NFTs to
                                                your fans - all for free! You can also manage smart
                                                contracts than you created outside ofNFT’s.
                                            </B2NormalTextTitleGrey>
                                        </div>
                                        <div className="btn-section">
                                            <Link to="/collectible">
                                                <Button
                                                    variant="primary"
                                                    className="default-btn-size btn-create fill-btn"
                                                >
                                                    <span>Create NFT</span>
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </Tab.Pane>
                        </Tab.Content>
                    </div>
                </Tab.Container>
            </div>
        </Layout>
    );
};

export default UserProfile;
