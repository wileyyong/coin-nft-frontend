import { Button, Image } from "react-bootstrap";

type cardProps = {
    backurl: string,
    imgurl: string,
    title: string,
    type: string
}

const HotCard = ({ backurl, imgurl, title, type }: cardProps) => {
    return (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 hotcard text-center pr-2 pb-4">
            <div className="back-image" style={{ backgroundImage: `url(${backurl})` }}></div>
            <div className="card-info pb-4 hot-back">
                <Image src={imgurl} className="hot-image"></Image>
                <div className="hot-title">{title}</div>
                <div className="hot-type">{type}</div>
                <Button>Buy</Button>
            </div>
        </div>
    );
};

export default HotCard;