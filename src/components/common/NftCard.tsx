import { Button, Image } from "react-bootstrap";

type cardProps = {
    url: string,
    title: string,
    price: string,
    content: string,
    style: string
}

const NftCard = ({ url, title, price, content, style }: cardProps) => {
    const stylename = 'card-info pb-4 ' + style;

    return (
        <div className="flex-fill nftcard text-center pr-2">
            <Image className="nft-image" src={url}></Image>
            <div className={stylename}>
                <div className="nft-title">{title}</div>
                <div className="nft-price">{price}</div>
                <div className="nft-content">{content}</div>
                <Button>Buy</Button>
            </div>
        </div>
    );
};

export default NftCard;