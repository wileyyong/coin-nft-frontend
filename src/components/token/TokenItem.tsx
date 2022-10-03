import React from "react";
import { NftAvatar, B1NormalTextTitle } from "../common/common.styles";
import configs from "configs";
import { useHistory } from "react-router-dom";
import { AiFillHeart } from "react-icons/ai";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import imgAvatar from "assets/imgs/avatar.png";

interface TokenItemProps {
  item: any;
}

const TokenItem: React.FC<TokenItemProps> = ({ item }) => {
  const history = useHistory();
  const getTokenThumbnail = () => {
    return `${item.thumbnail || item.media}`;
  };

  const getLink = () => {
    if (item.token) {
      history.push(`/tokens/${item.token._id}`);
    } else if (item.offer && item.offer.token) {
      history.push(`/tokens/${item.offer.token}`);
    } else if (item.collections && item.collections._id) {
      history.push(`/collections/${item.collections._id}`);
    } else if (item.creator && item.creator.wallet) {
      history.push(`/users/${item.creator.wallet}`);
    }
  };

  const getCreator = () => {
    if (item && item.creator && item.creator.wallet) return item.creator;
    return null;
  };

  const getCreatorAvatar = () => {
    const creator = getCreator();
    if (creator && creator.avatar) {
      return `${configs.DEPLOY_URL}${creator.avatar}`;
    }
    return imgAvatar;
  };

  const goToCreatorProfile = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (getCreator()) history.push("/users/" + getCreator()?._id);
  };

  return (
    <div className="auction-item mr-4" onClick={() => getLink()}>
      <div className="token-img-area">
        <div className="pre-token-img">
          {item.media ? (
            <img src={getTokenThumbnail()} alt="auctionImage" />
          ) : (
            <div className="no-thumbnail"></div>
          )}
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-end p-3">
        <div className="item-content">
          <B1NormalTextTitle className="mb-1">{item.name}</B1NormalTextTitle>
          <div className="description">{item.description}</div>
        </div>
        {item && item.likes && (
          <div className="likes d-flex align-items-center">
            <AiFillHeart />
            &nbsp;
            {item.likes}
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenItem;
