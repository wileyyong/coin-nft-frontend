import itemImage from "assets/imgs/nft-image3.png";
import itemImage2 from "assets/imgs/nft-image2.png";
import itemMember from "assets/imgs/seller6.png";
import itemLogo from "assets/imgs/puml-logo-footer.png";

import { Button, Container, Image } from "react-bootstrap";
import Tabs from "components/common/Tabs";
import Layout from "components/Layout";
import React, { useRef, useState } from "react";

interface BuyItemProps { }

const BuyItem: React.FC<BuyItemProps> = () => {
    const layoutView = useRef(null);

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
        {
            label: "Details",
            Component: Details
        },
        {
            label: "Bid",
            Component: Bid
        },
        {
            label: "History",
            Component: History
        }
    ];

    const [selectedTab, setSelectedTab] = useState(0);

    return (
        <Layout ref={layoutView}>
            <Container className="buyitem-container">
                <div className="d-flex flex-column flex-lg-row">
                    <div className="d-flex flex-row align-items-center pb-4">
                        <Image src={itemImage} className="item-image"></Image>
                    </div>
                    <div className="d-flex flex-column flex-fill item-info">
                        <div className="item-title pb-4">Plado Man</div>
                        <div className="item-price pb-4">
                            <span className="for-sale">For Sale • Highest Bid </span>
                            <span className="price-puml">30.000.00PUML</span>
                        </div>
                        <div className="d-flex flex-row">
                            <div className="d-flex flex-row align-items-center item-members pr-4">
                                <Image src={itemMember} className="member-image mr-2"></Image>
                                <div className="d-flex flex-column pt-2">
                                    <div className="member-type pb-1">Creator</div>
                                    <div className="member-name">Christian Trist</div>
                                </div>
                            </div>
                            <div className="d-flex flex-row align-items-center item-members pr-2">
                                <Image src={itemImage} className="member-image mr-2"></Image>
                                <div className="d-flex flex-column pt-2">
                                    <div className="member-type pb-1">Collection</div>
                                    <div className="member-name">Christian Trist</div>
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
                                    <span className="bid-member">Daniel Edwards</span>
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

export default BuyItem;