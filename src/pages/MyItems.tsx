import React, { useRef, useState } from "react";
import back from "assets/imgs/hot-back.svg";
import { Image, Button } from "react-bootstrap";
import account_data from "assets/account_data";
import Layout from "components/Layout";
import Tabs from "components/common/Tabs";
import nftlist from "assets/nftlist";
import NftItemCard from "components/common/NftItemCard";
import { Link } from "react-router-dom";

interface MyItemProps { }

const MyItems: React.FC<MyItemProps> = () => {
    const layoutView = useRef(null);

    const OnSail = () => (
        <div className="row pt-4">
            {
                nftlist.map((nft, index) => (
                    <NftItemCard key={index} url={nft.url} title={nft.title} price={nft.price} price_eth={nft.price_eth} content={nft.content}></NftItemCard>
                ))
            }
        </div>
    );
    // const Collectibles = () => <div> Collectibles component. </div>;
    // const ExpiringAuctions = () => <div>Expiring Auctions component.</div>;

    const tabs = [
        {
            label: "On Sail",
            Component: OnSail
        },
        {
            label: "Collectibles",
            Component: OnSail
        },
        {
            label: "Expiring Auctions",
            Component: OnSail
        }
    ];

    const [selectedTab, setSelectedTab] = useState(0);

    return (
        <Layout className="myitems-container" ref={layoutView}>
            <div className="d-flex flex-column align-items-center">
                <div style={{ backgroundImage: `url(${back})` }} className="background-item"></div>
                {/* <Image className="hot-image" src={account_data.img}></Image> */}
                <div className="d-flex flex-row align-items-center justify-content-center">
                    <div className="avatar" style={{ backgroundImage: `url(${account_data.img})` }}></div>
                </div>
                <div className="display user-name">{account_data.name}</div>
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