/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect, Fragment } from "react";
import { NotificationManager } from "react-notifications";
import { Button, Image, Nav, Tab } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import imgAvatar from "assets/imgs/avatar.png";

import Layout from "components/Layout";
import TokenView from "components/token/TokenView";
import { useAppSelector } from "store/hooks";
import { getWalletAddress } from "store/User/user.selector";
import Utility from "service/utility";
import configs from "configs";
import UserController from "controller/UserController";
import TokenController from "controller/TokenController";
import LoadingBar from "components/common/LoadingBar";
import NoItem from "components/common/noItem";
import OnSaleItem from "components/myitems/OnSaleItem";
import ExpiringAuction from "components/myitems/ExpiringAuction";
import {
    BigTitle
} from "components/common/common.styles";
import CoverImage from 'assets/imgs/default_rect.svg';

interface MyItemProps { }

const _categories = [
    { title: "On sale", count: 0, active: false, path: "on_sale" },
    { title: "Collectibles", count: 0, active: false, path: "collectibles" },
    { title: "Expiring auctions", count: 0, active: false, path: "expiring" },
];

const _userInfo = {
    id: "",
    name: "",
    wallet: "",
    date_create: "",
    avatar: "",
    cover: "",
    verified: false,
};

const MyItems: React.FC<MyItemProps> = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [pages, setPages] = useState(1);
    const [pageNum, setPageNumber] = useState(1);
    const [userInfo, setUserInfo] = useState(_userInfo);
    const [categories, setCategories] = useState(_categories);
    const [itemList, setItemList] = useState([]);
    const [selectedTab, setSelectedTab] = useState("collectibles");
    const walletAddress = useAppSelector(getWalletAddress);
    const [uploadCoverImage, setUploadCoverImage] = useState(null);
    const [backgroundCoverImage, setCoverImage] = useState<any>(null);

    useEffect(() => {
        loadItems();
        loadTokensAndCollections();
    }, [selectedTab, pageNum, walletAddress]);

    useEffect(() => {
        loadTokensAndCollections();
    }, [categories, walletAddress])

    const loadTokensAndCollections = async () => {
        if (walletAddress) {
            let data = await UserController.userStats(walletAddress);
            if (data.user) {
                setUserInfo(data.user);
                if (data.user.cover) {
                    setCoverImage(`${configs.DEPLOY_URL}${data.user.cover}`);
                }
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
        }
    };

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

    const getUserImgAvatar = () => {
        if (userInfo.avatar) return `${configs.DEPLOY_URL}${userInfo.avatar}`;
        return imgAvatar;
    };

    const fileChanged = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            setUploadCoverImage(file);

            var reader = new FileReader();
            reader.addEventListener(
                "load",
                () => {
                    setCoverImage(reader.result || "");
                },
                false
            );
            reader.readAsDataURL(file);
        }
    };

    const onUploadImage = () => {
        fileInputRef?.current?.click();
    }

    const onSaveImage = async () => {
        let data = {
            image: uploadCoverImage
        };
        let formdata = Utility.getFormDataFromObject(data);
        await UserController.uploadCover(formdata).then((res) => {
            if (res && res.status === 200) {
                NotificationManager.success(
                    uploadCoverImage ? 'Successfully uploaded!' : 'Successfully removed!',
                    "Success"
                );
                setUploadCoverImage(null);
            }
        }).catch((err) => {
            if (err.response && err.response.data && err.response.data.error) {
                NotificationManager.error(
                    err.response.data.error,
                    'Error'
                );
            }
        });
    }

    const onRemoveImage = async () => {
        if (window.confirm('Do you want remove cover image?')) {
            setUploadCoverImage(null);
            try {
                await onSaveImage();;
            } finally {
                setCoverImage('');
            }
        }
    }

    const resaleSucced = () => {
        loadTokensAndCollections();
        loadItems();
    }

    return (
        <Layout className="myitems-container">
            <div className="section-1">
                <div className="intro" style={{ backgroundImage: `url("${backgroundCoverImage || CoverImage}")` }}>
                    <Image src={getUserImgAvatar()} className="avatar" roundedCircle />
                    {
                        uploadCoverImage ? (
                            <Button variant="outline-white" className="btn-round cover-btn save-btn outline-btn" onClick={() => onSaveImage()}>
                                Save Cover
                            </Button>
                        ) : (
                            <Button variant="outline-white" className="btn-round cover-btn outline-btn" onClick={() => onUploadImage()}>
                                Add Cover
                            </Button>
                        )
                    }
                    {
                        backgroundCoverImage && (
                            <div className="trach-btn text-danger text-right mr-3">
                                <FaTrash className="pointer-cursor" onClick={() => onRemoveImage()} />
                            </div>
                        )
                    }
                    <input
                        ref={fileInputRef}
                        type="file"
                        hidden
                        accept={configs.IMG_FILE_ACCEPT}
                        onChange={fileChanged}
                    />
                </div>
            </div>
            <div className="section-2">
                <div className="d-flex justify-content-center px-3 px-md-0">
                    <span className="title faint-color font-matrice">{`${userInfo.name || "User - "}`}</span>
                </div>
            </div>
            <div className="section-3">
                <div className="d-flex justify-content-center align-items-center">
                    <Link to="/profile">
                        <Button variant="primary" className="text-white px-5">
                            <span>Edit Profile</span>
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="section-4">
                <Tab.Container defaultActiveKey="collectibles" id="items_tabs">
                    <div className="link-section px-md-5">
                        <Nav defaultActiveKey="collectibles">
                            {categories.map((category, index) => (
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
                                        <div className="text-center mt-5 loading-bar">
                                            <LoadingBar />
                                        </div>
                                    ) : (
                                        <div className="item-list mt-3 mt-md-5">
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
                                            <div className="my-3 d-flex justify-content-center loading-bar">
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
                            <Tab.Pane eventKey="collectibles">
                                {loading && pageNum === 1 ? (
                                    <div className="mt-5 text-center loading-bar">
                                        <LoadingBar />
                                    </div>
                                ) : (
                                    <Fragment>
                                        <div className="tokens-section">
                                            <BigTitle>My Tokens</BigTitle>
                                            <div className="item-list mt-3 mt-md-5">
                                                {itemList.length > 0 ? (
                                                    itemList.map((token: any, i: number) => (
                                                        <TokenView key={i} item={token} user={userInfo} resaleSucced={() => resaleSucced()}></TokenView>
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
                                                    <div className="my-3 d-flex justify-content-center loading-bar">
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
                                    </Fragment>
                                )}
                            </Tab.Pane>
                            <Tab.Pane eventKey="expiring">
                                <div className="auction-section">
                                    <BigTitle>Expiring Auctions</BigTitle>
                                    {loading && pageNum === 1 ? (
                                        <div className="text-center mt-5 loading-bar">
                                            <LoadingBar />
                                        </div>
                                    ) : (
                                        <div className="item-list mt-3 mt-md-5">
                                            {itemList.length > 0 ? (
                                                itemList.map((auction: any, i: number) => (
                                                    <ExpiringAuction key={i} item={auction}></ExpiringAuction>
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
                                            <div className="my-3 d-flex justify-content-center loading-bar">
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
                        </Tab.Content>
                    </div>
                </Tab.Container>
            </div>
        </Layout>
    );
}

export default MyItems;