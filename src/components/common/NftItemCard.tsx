import configs from "configs";
import { useHistory } from "react-router-dom";
import {
    NormalTextTitle
} from 'components/common/common.styles';

interface nftItemProps {
    item: any;
}

const NftItemCard: React.FC<nftItemProps> = ({ item }) => {

    const history = useHistory();

    const getOwner = () => {
        if (item && item.owners && item.owners.length) return item.owners[0];
        return null;
    };

    const getMedia = () => {
        if (item) {
            return `${configs.DEPLOY_URL}${item.media || item.thumbnail}`;
        }
    }

    return (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 myitem-card text-center py-4 px-2" onClick={() => { history.push("/tokens/" + item._id) }}>
            <div style={{ backgroundImage: `url("${getMedia()}")` }} className="card-image">
            </div>
            <div className="card-info pt-3 pb-4">
                <div className="card-title">{item.name}</div>
                <div>
                    <span className="puml-price">$30.00 PUML</span>
                    <span className="eth-price"> • {getOwner().price} ETH</span>
                </div>
                <div className="card-content pt-2">{item.description}</div>
                {item.status === 'pending' && <NormalTextTitle className="faint-color mt-2">Place a bid</NormalTextTitle>}
            </div>
        </div>
    );
};

export default NftItemCard;