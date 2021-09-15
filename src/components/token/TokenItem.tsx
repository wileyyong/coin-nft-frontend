import React from "react";
import {
  AuctionItemCircle,
  B1NormalTextTitle
} from "../common/common.styles";
import configs from "configs";
import { useHistory } from "react-router-dom";
import { AiFillHeart } from 'react-icons/ai';

interface TokenItemProps {
  item: any;
}

const TokenItem: React.FC<TokenItemProps> = ({ item }) => {
  const history = useHistory();
  const getTokenThumbnail = () => {
    return `${configs.DEPLOY_URL}${item.thumbnail || item.media}`;
  };

  const getLink = () => {
    if (item.token) {
      history.push(`/tokens/${item.token._id}`);
    } else if (item.offer && item.offer.token) {
      history.push(`/tokens/${item.offer.token}`);
    } else if (item.collections && item.collections._id) {
      history.push(`/collections/${item.collections._id}`)
    } else if (item.creator && item.creator.wallet) {
      history.push(`/users/${item.creator.wallet}`);
    }
  }

  return (
    <div
      className="auction-item mr-4 p-4"
      onClick={() => getLink()}
    >
      <AuctionItemCircle className="mb-3" />
      <div className="token-img-area">
        <div className="pre-token-img">
          {item.media ? (
            <img src={getTokenThumbnail()} alt="auctionImage" />
          ) : (
            <div className="no-thumbnail"></div>
          )}
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-end">
        <div className="item-content">
          <B1NormalTextTitle className="mt-3">{item.name}</B1NormalTextTitle>
          <div className="description">
            {item.description}
          </div>
        </div>
        {
          item && item.likes && (
            <div className="likes d-flex align-items-center">
              <AiFillHeart />
              &nbsp;
              {item.likes}
            </div>
          )
        }
      </div>
    </div>
  );
};

export default TokenItem;
