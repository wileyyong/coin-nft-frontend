import { Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

type cardProps = {
    url: string,
    title: string,
    price: string,
    price_eth: string,
    content: string
}

const NftItemCard = ({ url, title, price, price_eth, content }: cardProps) => {
    return (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 myitem-card text-center pb-4">
            <Link to="/buy">
                <Image className="card-image" src={url}></Image>
            </Link>
            <div className="card-info pt-3 pb-4">
                <div className="card-title">{title}</div>
                <div>
                    <span className="puml-price">{price}</span>
                    <span className="eth-price"> • {price_eth}</span>
                </div>
                <div className="card-content pt-2">{content}</div>
            </div>
        </div>
    );
};

export default NftItemCard;