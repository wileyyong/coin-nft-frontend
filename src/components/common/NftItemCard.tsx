import configs from "configs";
import { useHistory } from "react-router-dom";
import {
    NormalTextTitle
} from 'components/common/common.styles';
import { BigNumberMul } from "service/number";
import { useAppSelector } from "store/hooks";
import { getETHUSDTCurrency, getMATICUSDTCurrency } from "store/Nft/nft.selector";

interface nftItemProps {
    item: any;
}

const NftItemCard: React.FC<nftItemProps> = ({ item }) => {

    const history = useHistory();
    const ethDollarPrice = useAppSelector(getETHUSDTCurrency);
    const maticDollarPrice = useAppSelector(getMATICUSDTCurrency);
    const getOwner = () => {
        if (item && item.owners && item.owners.length) return item.owners[0];
        return null;
    };

    const getMedia = () => {
        if (item.thumbnail || item.media) {
            let media = item.media_type ? item.media_type.toLowerCase() : '';
            if (
                media.includes("mp3") ||
                media.includes("mp4") ||
                media.includes("webm")
            ) {
                if (item.thumbnail) {
                    return `${item.thumbnail}`;
                }
                return `${configs.DEPLOY_URL}/content/collection/puml.png`;
            }
            return `${item.thumbnail || item.media}`;
        } else if (item.token.thumbnail || item.token.media) {
            let media = item.token.media_type ? item.token.media_type.toLowerCase() : '';
            if (
                media.includes("mp3") ||
                media.includes("mp4") ||
                media.includes("webm")
            ) {
                if (item.token.thumbnail) {
                    return `${item.token.thumbnail}`;
                }
                return `${configs.DEPLOY_URL}/content/collection/puml.png`;
            }
            return `${item.token.thumbnail || item.token.media}`;
        }
    }

    const getDollarPrice = (ethValue: any) => {
        let blockchain:string = item.token.blockchain ? item.token.blockchain : 'ETH';
        let dollarPrice:any = 0;
        if (ethValue) {
            switch (blockchain) {
                case 'ETH':
                   dollarPrice = BigNumberMul(ethValue, ethDollarPrice).toFixed(2);
                   break;
                case 'MATIC':
                   dollarPrice = BigNumberMul(ethValue, maticDollarPrice).toFixed(2);
                   break;
                default:
            }
        }
        return dollarPrice;
    }

    return (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 myitem-card text-center py-2 px-2" onClick={() => { history.push("/tokens/" + (item.token && item.token._id ? item.token._id : item._id)) }}>
            <div style={{ backgroundImage: `url("${getMedia()}")` }} className="card-image">
            </div>
            <div className="card-info pt-3 pb-4">
                <div className="card-title">{item.name || item.token.name}</div>
                {item.type && (item.type === 'auction' || item.type === 'both') && (
                    <div>
                        <span className="puml-price">${getDollarPrice(getOwner() ? getOwner().price : item.min_bid)}</span>
                        <span className="eth-price"> • {getOwner()? getOwner().price : item.min_bid} {item.token.blockchain ? item.token.blockchain : 'ETH'}</span>
                    </div>
                )}
                {item.type && (item.type === 'direct' || item.type === 'both') && (
                    <div>
                        <span className="puml-price">${getDollarPrice(getOwner() ? getOwner().price : item.offer_price)}</span>
                        <span className="eth-price"> • {getOwner()? getOwner().price : item.offer_price} {item.token.blockchain ? item.token.blockchain : 'ETH'}</span>
                    </div>
                )}
                {/* {
                    item.description ? (
                        <div className="card-content pt-2">{item.description}</div>
                    ) : (
                        item.token ? (
                            <div className="card-content pt-2">{item.token.description}</div>
                        ) : (
                            <div className="card-content pt-2"></div>
                        )
                    )
                } */}
                {item.status === 'pending' && <NormalTextTitle className="faint-color mt-2">{
                    (item.type === 'direct' || item.type === 'both') ? 'Buy now' : 'Place a bid'
                }</NormalTextTitle>}
            </div>
        </div>
    );
};

export default NftItemCard;