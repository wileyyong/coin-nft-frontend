import React, { useEffect } from "react";
import {
  B1NormalTextTitle,
  FlexAlignCenterDiv,
  NormalTextTitle,
  SmallTextTitleGrey,
} from "../common/common.styles";
import { useHistory } from "react-router-dom";
import configs from "configs";
import { AiFillHeart } from 'react-icons/ai';

interface OnSaleItemProps {
  item: any;
}

const OnSaleItem: React.FC<OnSaleItemProps> = ({ item }) => {
  const history = useHistory();
  const token = item.token || {};

  useEffect(() => {
    console.log(item);
  }, []);

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
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 myitem-card text-center py-4 px-2" onClick={() => { history.push("/tokens/" + item._id) }}>
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
        <div className="card-content pt-2">Unfolding reality to see whats underneath the favricated surface</div>
      </div>
    </div>
  );
};

export default OnSaleItem;

{/* <div
        className="auction-item mr-4 p-4"
        onClick={() => { history.push("/tokens/" + token._id); }}
      >
        <div className="token-img-area mt-2">
          <div className="pre-token-img">
            {token.media ? (
              <img src={getTokenThumbnail()} alt="auctionImage" />
            ) : (
              <div className="no-thumbnail"></div>
            )}
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-end">
          <div className="item-content">
            <B1NormalTextTitle className="mt-3">{token.name}</B1NormalTextTitle>
            <SmallTextTitleGrey className="token-collection-name">{token.collections ? token.collections.name : "xSigma"}</SmallTextTitleGrey>
            <SmallTextTitleGrey>
              {item.type === "auction" ? (
                "Not for Sale"
              ) : (
                <>From {item.offer_price} ETH</>
              )}
            </SmallTextTitleGrey>
            <FlexAlignCenterDiv className="mt-1">
              <NormalTextTitle className="faint-color">
                {getCurrentBidPrice() ? (
                  <>Current Bid {getCurrentBidPrice()} ETH</>
                ) : (
                  <>Minimum Bid {item.min_bid} ETH</>
                )}{" "}
              </NormalTextTitle>
            </FlexAlignCenterDiv>
          </div>
          {
            token.likes ? (
              <div className="likes d-flex align-items-center">
                <AiFillHeart />
                &nbsp;
                {token.likes}
              </div>
            ) : ''
          }
        </div>
      </div> */}