import React, { useRef, useState, useEffect } from "react";
import back from "assets/imgs/hot-back.svg";
import { Button, Image } from "react-bootstrap";
import account_data from "assets/account_data";
import Layout from "components/Layout";
import Tabs from "components/common/Tabs";
import nftlist from "assets/nftlist";
import NftItemCard from "components/common/NftItemCard";
import { Link, useParams } from "react-router-dom";

import verifyImg from "assets/imgs/verify.svg";
import copyImg from "assets/imgs/copy.png";

interface UserProfileProps { }

const UserProfile: React.FC<UserProfileProps> = () => {
    const layoutView = useRef(null);
    const params: any = useParams();
    const [walletAddress, setWalletAddress] = useState('');

    useEffect(() => {
        setWalletAddress(params.walletAddress);
    }, [params, walletAddress]);

    const OnSail = () => (
        <div className="row pt-4">
            {
                nftlist.map((nft, index) => (
                    <NftItemCard key={index} url={nft.url} title={nft.title} price={nft.price} price_eth={nft.price_eth} content={nft.content}></NftItemCard>
                ))
            }
        </div>
    );

    const tabs = [
        {
            label: "On Sail",
            Component: OnSail
        },
        {
            label: "Owned",
            Component: OnSail
        },
        {
            label: "Created",
            Component: OnSail
        },
        {
            label: "Linked",
            Component: OnSail
        },
        {
            label: "Activity",
            Component: OnSail
        }
    ];

    const [selectedTab, setSelectedTab] = useState(0);

    return (
        <Layout className="userprofile-container" ref={layoutView}>
            <div className="d-flex flex-column align-items-center">
                <div style={{ backgroundImage: `url(${back})` }} className="background-item"></div>
                {/* <Image className="hot-image" src={account_data.img}></Image> */}
                <div className="d-flex flex-row align-items-center justify-content-center">
                    <div className="avatar" style={{ backgroundImage: `url(${account_data.img})` }}>
                        <Image className="verify" src={verifyImg}></Image>
                    </div>
                </div>
                <div className="display user-name pb-3">{account_data.name}</div>
                <div className="d-flex flex-row align-items-center pb-3">
                    <div className="token-address pr-2">0x36d564dsafd645fads6456fads</div>
                    <Image src={copyImg}></Image>
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