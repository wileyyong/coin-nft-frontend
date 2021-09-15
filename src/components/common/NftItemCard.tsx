import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import configs from "configs";
import { useHistory } from "react-router-dom";
import imgAvatar from "assets/imgs/avatar.png";

interface nftItemProps {
    item: any;
}

const NftItemCard: React.FC<nftItemProps> = ({ item }) => {

    const history = useHistory();

    const getOwner = () => {
        if (item && item.owners && item.owners.length) return item.owners[0];
        return null;
    };

    const getOwnerAvatar = () => {
        const owner = getOwner();
        if (owner && owner.user && owner.user.avatar) {
            return `${configs.DEPLOY_URL}${owner.user.avatar}`;
        }
        return imgAvatar;
    };

    const getMedia = () => {
        if (item) {
            return `${configs.DEPLOY_URL}${item.media}`;
        }
    }

    return (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 myitem-card text-center py-4 px-2" onClick={() => { history.push("/tokens/" + item._id) }}>
            {/* <Link to="/buy">
                <Image className="card-image" src={getMedia()}></Image>
            </Link> */}
            <div style={{ backgroundImage: `url("${getMedia()}")` }} className="card-image">
            </div>
            <div className="card-info pt-3 pb-4">
                <div className="card-title">{item.name}</div>
                <div>
                    <span className="puml-price">{getOwner().price}</span>
                    <span className="eth-price"> • {getOwner().price}</span>
                </div>
                <div className="card-content pt-2">Unfolding reality to see whats underneath the favricated surface</div>
            </div>
        </div>
    );
};

export default NftItemCard;