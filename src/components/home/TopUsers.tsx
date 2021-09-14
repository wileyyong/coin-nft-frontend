import React, { Component } from "react";
import { Image } from "react-bootstrap";
import Slider from "react-slick";
import { useHistory } from 'react-router-dom';
import imageAvatar from "assets/imgs/seller1.png";
import configs from "configs";

interface TopUsersProps {
    users: Array<any>;
}

const TopUsers: React.FC<TopUsersProps> = ({ users }) => {
    const history = useHistory();
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };
    return (
        <div>
            <Slider {...settings}>
                {
                    users.map((user, index) => (
                        <div key={index} className="seller-segment" onClick={() => history.push(`/users/${user.wallet}`)}>
                            <Image src={user.avatar ? `${configs.DEPLOY_URL}${user.avatar}` : imageAvatar} className="seg-img" alt="seller"></Image>
                            <div className="seg-name pt-2">{user.name}</div>
                            <div className="seg-type pt-2">{user.type}</div>
                            <div className="seg-price pt-2">{user.amount} PUML</div>
                            <div className="seg-price-eth pt-2">{user.amount}</div>
                        </div>
                    ))
                }
            </Slider>
        </div>
    );
};

export default TopUsers;