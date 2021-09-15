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

    return (
        <div className="myitem-card text-center py-4 px-2" onClick={() => { history.push("/tokens/" + token._id) }}>
            <Link to="/buy">
                <Image className="card-image" src={getOwnerAvatar()}></Image>
            </Link>
            <div className="card-info pt-3 pb-4">
                <div className="card-title">{token.name}</div>
                <div>
                    <span className="puml-price">{item.min_bid}</span>
                    <span className="eth-price"> • {item.min_bid}</span>
                </div>
                <div className="card-content pt-2">Unfolding reality to see whats underneath the favricated surface</div>
            </div>
        </div>
    );
};

export default NftItemCard;