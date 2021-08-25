import React, { useRef } from "react";
import back from "assets/imgs/hot-back.svg";
import { Image, Button } from "react-bootstrap";
import account_data from "assets/account_data";
import Layout from "components/Layout";

interface MyItemProps { }

const MyItems: React.FC<MyItemProps> = () => {
    const layoutView = useRef(null);
    return (
        <Layout className="myitems-container" ref={layoutView}>
            <div className="d-flex flex-column align-items-center">
                <Image src={back} className="background-item"></Image>
                <Image src={account_data.img} className="avatar"></Image>
                <h1 className="user-name">{account_data.name}</h1>
                <Button className="mr-2 mr-lg-4 btn-primary">Edit Profile</Button>
            </div>
        </Layout>
    );
}

export default MyItems;