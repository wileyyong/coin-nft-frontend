import React from "react";
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
    <div
      className="auction-item mr-4 p-4"
      onClick={() => {history.push("/tokens/" + token._id);}}
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
          <SmallTextTitleGrey className="token-collection-name">{token.collections ? token.collections.name : "PUML"}</SmallTextTitleGrey>
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
    </div>
  );
};

export default OnSaleItem;
