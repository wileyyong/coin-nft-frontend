import React, { useRef, useState, useEffect } from "react";
import { NotificationManager } from "react-notifications";
import { Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

import camera from "assets/imgs/camera_alt.png";
import verifyImg from "assets/imgs/verify.svg";
import imgAvatar from "assets/imgs/avatar.png";
import defaultImage from "assets/imgs/default_rect.svg";

import Layout from "components/Layout";
import Tabs from "components/common/Tabs";
import { useAppSelector } from "store/hooks";
import { getMyInfo, getWalletAddress } from "store/User/user.selector";
import Utility from "service/utility";
import configs from "configs";
import UserController from "controller/UserController";
import CollectionController from "controller/CollectionController";
import TokenController from "controller/TokenController";
import NftItemCard from "components/common/NftItemCard";
import NoItem from "components/common/noItem";

interface MyItemProps { }

const _categories = [
    { title: "On sale", count: 0, active: false, path: "on_sale" },
    { title: "Collectibles", count: 0, active: false, path: "collectibles" },
    { title: "Expiring auctions", count: 0, active: false, path: "expiring" },
];

const _filters = [
    { name: 'Listings', selected: false, filter: 'listed' },
    { name: 'Purchases', selected: false, filter: 'purchased' },
    { name: 'Sales', selected: false, filter: 'minted' },
    { name: 'Transfers', selected: false, filter: 'transfered' },
    { name: 'Bids', selected: false, filter: 'offered' },
    { name: 'Likes', selected: false, filter: 'liked' },
    { name: 'Followings', selected: false, filter: 'following' },
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

const _royalty = {
    royalties: 0,
    tokens: 0,
    collections: 0
}

const MyItems: React.FC<MyItemProps> = () => {
    const layoutView = useRef(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [pages, setPages] = useState(1);
    const [pageNum, setPageNumber] = useState(1);
    const [userInfo, setUserInfo] = useState(_userInfo);
    const myInfo = useAppSelector(getMyInfo);
    const [categories, setCategories] = useState(_categories);
    const [itemList, setItemList] = useState([]);
    const [collections, setCollections] = useState([]);
    const [selectedTab, setSelectedTab] = useState(0);
    const walletAddress = useAppSelector(getWalletAddress);
    const [uploadCoverImage, setUploadCoverImage] = useState(null);
    const [backgroundCoverImage, setCoverImage] = useState<any>(null);
    const [filters] = useState(_filters);
    const [selectedFilter, setSelectedFilter] = useState('');
    const [filteredActivities, setFilteredActivities] = useState([]);
    const [royalty, setRoyalty] = useState(_royalty);

    useEffect(() => {
        loadItems();
    }, [selectedTab, pageNum, walletAddress]);

    useEffect(() => {
        if(myInfo) {
            if(myInfo.cover) setCoverImage(`${configs.DEPLOY_URL}${myInfo.cover}`);
        }
    }, [myInfo])

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
        let collections = await CollectionController.getMyCollections();
        setCollections(collections);
    };

    const loadItems = async () => {
        if (walletAddress) {
            console.log(pageNum);
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

    const getUserImgAvatar = () => {
        if (myInfo.avatar) return `${configs.DEPLOY_URL}${myInfo.avatar}`;
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
        <div className="row justify-content-center pt-4">
            {
                itemList.length > 0 ?
                    itemList.map((item, index) => (
                        <NftItemCard key={index} item={item}></NftItemCard>
                    ))
                    :
                    <div>
                        <NoItem
                            title="No items found"
                            description="Come back soon! Or try to browse something for you on our marketplace"
                            btnLink="/"
                            btnLabel="Browse marketplace"
                        />
                    </div>
            }
        </div>
    );
    // const Collectibles = () => <div> Collectibles component. </div>;
    // const ExpiringAuctions = () => <div>Expiring Auctions component.</div>;

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
        <Layout className="myitems-container" ref={layoutView}>
            <div className="d-flex flex-column align-items-center">
                <div style={{ backgroundImage: `url(${backgroundCoverImage ? backgroundCoverImage : defaultImage})` }} className="background-item">
                    {
                        uploadCoverImage ? (
                            <Button variant="outline-white" className="cover-btn d-flex flex-row align-items-center" onClick={() => onSaveImage()}>
                                <Image src={camera} className="pr-2 btn-image"></Image>
                                <div>Save Cover Photo</div>
                            </Button>
                        ) : (
                            <Button variant="outline-white" className="cover-btn d-flex flex-row align-items-center" onClick={() => onUploadImage()}>
                                <Image src={camera} className="pr-2 btn-image"></Image>
                                <div>Add Cover Photo</div>
                            </Button>
                        )
                    }
                    {
                        backgroundCoverImage && (
                            <div className="trach-btn text-danger text-right pr-4 pt-4">
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
                <div className="d-flex flex-row align-items-center justify-content-center">
                    <div className="avatar" style={{ backgroundImage: `url(${getUserImgAvatar()})` }}>
                        {
                            userInfo.verified && <Image src={verifyImg} className="verify"></Image>
                        }
                    </div>
                </div>
                <div className="display user-name">{myInfo.name}</div>
                <Link to="/profile" className="link-profile mt-2" >
                    <Button className="mr-2 mr-lg-4 btn-primary">
                        Edit Profile
                    </Button>
                </Link>
            </div>
            <div className="myitems-tab">
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

export default MyItems;