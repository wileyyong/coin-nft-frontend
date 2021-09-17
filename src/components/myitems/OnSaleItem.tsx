import React from "react";
import { useHistory } from "react-router-dom";
import configs from "configs";

interface OnSaleItemProps {
  item: any;
}

const OnSaleItem: React.FC<OnSaleItemProps> = ({ item }) => {
  const history = useHistory();
  const token = item.token || {};

  const getTokenThumbnail = () => {
    return `${configs.DEPLOY_URL}${token.thumbnail || token.media}`;
  };

  const getCurrentBidPrice = () => {
    if (item.bids && item.bids.length) {
      let bids = item.bids.sort(function (a: any, b: any) {
        return b.price - a.price;
      });
      return bids[0].price;
    }
    return 0;
  };

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 myitem-card text-center py-2 px-2" onClick={() => { history.push("/tokens/" + item._id) }}>
      <div style={{ backgroundImage: `url("${getTokenThumbnail()}")` }} className="card-image">
      </div>
      <div className="card-info pt-3 pb-4">
        <div className="card-title">{token.name}</div>
        <div>
          <span className="puml-price">{item.min_bid}ETH</span>
          <span className="eth-price"> • {item.type === "auction" ? (
              "Not for Sale"
            ) : (
              <>From {getCurrentBidPrice()} ETH</>
            )}</span>
        </div>
        <div className="card-content pt-2">{token.description}</div>
      </div>
    </div>
  );
};

export default OnSaleItem;