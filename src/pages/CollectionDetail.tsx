/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Button, Nav, Tab } from "react-bootstrap";
import Layout from "components/Layout";
import {
    SmallTextTitleGrey
} from "components/common/common.styles";
import CollectionController from "controller/CollectionController";
import LoadingBar from "components/common/LoadingBar";
import imgAvatar from "assets/imgs/avatar.png";
import NoItem from "components/common/noItem";
import configs from "configs";
import CollectionItem from "components/collection/CollectionItem";
import OnSaleItem from "components/myitems/OnSaleItem";
import ReadMore from "components/common/ReadMore";

interface CollectionDetailProps { }

const _categories = [
    { title: "On sale", count: 0, active: false, path: "on_sale" },
    { title: "Owned", count: 0, active: false, path: "owned" }
];

const _collectionInfo = {
    _id: "",
    name: "",
    short: "",
    symbol: "",
    date_create: "",
    description: "",
    image: "",
    thumbnail: "",
    cover: "",
    creator: {
        avatar: "",
        bio: "",
        cover: "",
        date_create: "",
        name: "",
        wallet: "",
        _id: ""
    }
};

const CollectionDetail: React.FC<CollectionDetailProps> = () => {
    const params: any = useParams();
    const [loading, setLoading] = useState(false);
    const [pages, setPages] = useState(1);
    const [pageNum, setPageNumber] = useState(1);
    const [collectionInfo, setCollectionInfo] = useState(_collectionInfo);
    const [categories, setCategories] = useState(_categories);
    const [itemList, setItemList] = useState([]);
    const [selectedTab, setSelectedTab] = useState("owned");
    const [walletAddress, setWalletAddress] = useState('');
    const [collectionId, setCollectionId] = useState('');

    useEffect(() => {
        const loadTokensAndCollections = async () => {
            setCollectionId(params.id);
            if (collectionId) {
                let data = await CollectionController.getById(collectionId);
                if (data.collection) {
                    setCollectionInfo(data.collection);
                    setWalletAddress(data.collection.creator.wallet);
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
            loadItems();
        };
        loadTokensAndCollections();
    }, [categories, collectionId, walletAddress]);

    useEffect(() => {
        loadItems();
    }, [selectedTab, pageNum]);

    const loadItems = async () => {
        if (collectionId) {
            setLoading(true);
            let { items, pages } = await CollectionController.getCollections(collectionId, selectedTab, pageNum);
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
        if (collectionInfo.creator && collectionInfo.creator.avatar) return `${configs.DEPLOY_URL}${collectionInfo.creator.avatar}`;
        return imgAvatar;
    };

    return (
        <Layout className="collection-detail-container">
            <div className="d-flex flex-column align-items-center">
                <div style={{ backgroundImage: `url("${configs.DEPLOY_URL}${collectionInfo.cover || collectionInfo.image || collectionInfo.thumbnail}")` }} className="background-item"></div>
                <div className="d-flex flex-row align-items-center justify-content-center">
                    <div className="avatar" style={{ backgroundImage: `url(${getUserImgAvatar()})` }}></div>
                </div>
            </div>
            <div className="d-flex justify-content-center px-3 px-md-0">
                <span className="title user-name">{`${collectionInfo.name || "Collection - "}`}</span>
            </div>
            <div className="d-flex justify-content-center text-center mx-auto" style={{ maxWidth: 300 }}>
                <SmallTextTitleGrey>
                    <ReadMore text={collectionInfo.description} maxChars={150} />
                </SmallTextTitleGrey>
            </div>
            <Tab.Container defaultActiveKey="owned" id="items_tabs">
                <div className="link-section px-md-5">
                    <Nav defaultActiveKey="owned">
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
                            {
                                loading && pageNum === 1 ? (
                                    <div className="mt-5 d-flex justify-content-center">
                                        <LoadingBar />
                                    </div>
                                ) : (
                                    <div className="auction-section">
                                        <div className="item-list mt-3 mt-md-5">
                                            {itemList.length > 0 ? (
                                                itemList.map((saleItem, i) => (
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
                                    </div>
                                )
                            }
                        </Tab.Pane>
                        <Tab.Pane eventKey="owned">
                            {loading && pageNum === 1 ? (
                                <div className="mt-5 d-flex justify-content-center">
                                    <LoadingBar />
                                </div>
                            ) : (
                                <div className="collections-section">
                                    <div className="row mt-3 mt-md-5">
                                        {itemList.length > 0 ? (
                                            itemList.map(
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
                                                title="No items found"
                                                description="Come back soon! Or try to browse something for you on our marketplace"
                                                btnLink="/"
                                                btnLabel="Browse marketplace"
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                        </Tab.Pane>
                        {
                            loading && pageNum > 1 ? (
                                <div className="mt-5 d-flex justify-content-center">
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
                    </Tab.Content>
                </div>
            </Tab.Container>
        </Layout>
    );
};

export default CollectionDetail;
