import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import configs from "configs";
import { useHistory } from "react-router-dom";

interface nftItemProps {
    item: any;
}

const NftItemCard: React.FC<nftItemProps> = ({ item }) => {

    const history = useHistory();
    const token = item.token || {};

    const getOwner = () => {
        if (token && token.owners && token.owners.length) return token.owners[0];
        return null;
    };

    const getOwnerAvatar = () => {
        const owner = getOwner();
        if (owner && owner.user && owner.user.avatar) {
            return `${configs.DEPLOY_URL}${owner.user.avatar}`;
        }
        // return imgAvatar;
    };

    // const getCurrentBidPrice = () => {
    //     if (item.bids && item.bids.length) {
    //         let bids = item.bids.sort(function (a: any, b: any) {
    //             return b.price - a.price;
    //         });
    //         return bids[0].price;
    //     }
    //     return 0;
    // };

    return (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 myitem-card text-center pb-4" onClick={() => { history.push("/tokens/" + token._id) }}>
            <Link to="/buy">
                <Image className="card-image" src={getOwnerAvatar()}></Image>
            </Link>
            <div className="card-info pt-3 pb-4">
                <div className="card-title">{token.name}</div>
                <div>
                    <span className="puml-price">{item.offer_price}</span>
                    <span className="eth-price"> • {item.offer_price}</span>
                </div>
                <div className="card-content pt-2">Unfolding reality to see whats underneath the favricated surface</div>
            </div>
        </div>
    );
};

export default NftItemCard;