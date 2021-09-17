import configs from "configs";
import { useHistory } from "react-router-dom";
import {
    NormalTextTitle
} from 'components/common/common.styles';
import { BigNumberMul } from "service/number";
import { useAppSelector } from "store/hooks";
import { getETHUSDTCurrency } from "store/Nft/nft.selector";

interface nftItemProps {
    item: any;
}

const NftItemCard: React.FC<nftItemProps> = ({ item }) => {

    const history = useHistory();
    const ethDollarPrice = useAppSelector(getETHUSDTCurrency);
    const getOwner = () => {
        if (item && item.owners && item.owners.length) return item.owners[0];
        return null;
    };

    const getMedia = () => {
        if (item.thumbnail || item.media) {
            return `${configs.DEPLOY_URL}${item.thumbnail || item.media}`;
        } else if (item.token.thumbnail || item.token.media) {
            return `${configs.DEPLOY_URL}${item.token.thumbnail || item.token.media}`;
        }
    }

    const getDollarPrice = (ethValue: any) => {
        if (ethValue) {
            let dollarPrice = BigNumberMul(ethValue, ethDollarPrice).toFixed(2);
            return dollarPrice;
        }
        return 0;
      }

    return (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 myitem-card text-center py-2 px-2" onClick={() => { history.push("/tokens/" + (item.token && item.token._id ? item.token._id : item._id)) }}>
            <div style={{ backgroundImage: `url("${getMedia()}")` }} className="card-image">
            </div>
            <div className="card-info pt-3 pb-4">
                <div className="card-title">{item.name || item.token.name}</div>
                <div>
                    <span className="puml-price">${getDollarPrice(getOwner() ? getOwner().price : item.min_bid)} PUML</span>
                    <span className="eth-price"> • {getOwner()? getOwner().price : item.min_bid} ETH</span>
                </div>
                {
                    item.description ? (
                        <div className="card-content pt-2">{item.description}</div>
                    ) : (
                        item.token ? (
                            <div className="card-content pt-2">{item.token.description}</div>
                        ) : (
                            <div className="card-content pt-2"></div>
                        )
                    )
                }
                {item.status === 'pending' && <NormalTextTitle className="faint-color mt-2">Place a bid</NormalTextTitle>}
            </div>
        </div>
    );
};

export default NftItemCard;