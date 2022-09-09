import React from "react";
import { useHistory } from "react-router-dom";
import { BigNumberMul } from "service/number";
import { useAppSelector } from "store/hooks";
import { getETHUSDTCurrency, getMATICUSDTCurrency } from "store/Nft/nft.selector";
import configs from 'configs';

interface OnSaleItemProps {
  item: any;
}

const OnSaleItem: React.FC<OnSaleItemProps> = ({ item }) => {
  const history = useHistory();
  const token = item.token || {};
  const ethDollarPrice = useAppSelector(getETHUSDTCurrency);
  const maticDollarPrice = useAppSelector(getMATICUSDTCurrency);
  const getTokenThumbnail = () => {
    let media = token.media_type ? token.media_type.toLowerCase() : '';
    if (
        media.includes("mp3") ||
        media.includes("mp4") ||
        media.includes("webm")
    ) {
      if (token.thumbnail) {
        return `${token.thumbnail}`;
      }
        return `${configs.DEPLOY_URL}/content/collection/puml.png`;
    }
    return `${token.thumbnail || token.media}`;
  };

  const getCurrentBidPrice = () => {
    if (item.bids && item.bids.length) {
      let bids = item.bids.sort(function (a: any, b: any) {
        return b.price - a.price;
      });
      return bids[0].price;
    }
    return item.offer_price;
  };
  const getDollarPrice = (ethValue: any) => {
    let blockchain:string = token.blockchain ? token.blockchain : 'ETH';
    let dollarPrice:any = 0;
    if (ethValue) {
        switch (blockchain) {
            case 'ETH':
                dollarPrice = BigNumberMul(ethValue, ethDollarPrice).toFixed(2);
                break;
            case 'MATIC':
                dollarPrice = BigNumberMul(ethValue, maticDollarPrice).toFixed(2);
                break;
            case 'PUMLx':
                dollarPrice = (ethValue * 0.05).toFixed(2);
                break;
            default:
        }
    }
    return dollarPrice;
  }

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 myitem-card text-center py-2 px-2" onClick={() => { history.push("/tokens/" + item.token._id) }}>
      <div style={{ backgroundImage: `url("${getTokenThumbnail()}")` }} className="card-image">
      </div>
      <div className="card-info pt-3 pb-4">
        <div className="card-title">{token.name}</div>
        <div>
          <span className="puml-price">${getDollarPrice(item.min_bid || item.offer_price)}</span>
          <span className="eth-price"> • {item.type === "direct" ? (
              "Not for Sale"
            ) : (
              <>From {getCurrentBidPrice() || item.min_bid} {token.blockchain ? token.blockchain : 'ETH'}</>
            )}</span>
        </div>
        <div className="card-content pt-2">{token.description}</div>
      </div>
    </div>
  );
};

export default OnSaleItem;