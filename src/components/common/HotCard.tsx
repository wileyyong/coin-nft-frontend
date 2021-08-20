import { Button, Image } from "react-bootstrap";

type cardProps = {
    backurl: string,
    imgurl: string,
    title: string,
    type: string
}

const HotCard = ({ backurl, imgurl, title, type }: cardProps) => {
    return (
        <div className="flex-fill hotcard text-center pr-2">
            <Image className="back-image" src={backurl}></Image>
            <div className="card-info pb-4 hot-back">
                <Image className="hot-image" src={imgurl}></Image>
                <div className="hot-title">{title}</div>
                <div className="hot-type">{type}</div>
                <Button>Buy</Button>
            </div>
        </div>
    );
};

export default HotCard;