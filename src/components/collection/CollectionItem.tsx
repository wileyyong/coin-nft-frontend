import React from "react";
import configs from 'configs';
import { useHistory } from 'react-router-dom';
import { B1NormalTextTitle, NftAvatar } from "../common/common.styles";

interface CollectionItemProps {
  item: any;
}

const CollectionItem: React.FC<CollectionItemProps> = ({ item }) => {
  const history = useHistory();
  const collectionImgUrl = () => {
    let media = item.media_type && item.media_type.toLowerCase();
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
    return `${item.image || item.thumbnail || item.media}`;
  }

  const collectionCreatorImgUrl = () => {
    if(item.creator && item.creator.avatar) return `${configs.DEPLOY_URL}${item.creator.avatar}`;
    return '';
  }

  const pushLink = () => {
    if (item.collections && item.creator) {
      history.push(`/users/${item.creator.wallet}`);
    } else {
      history.push(`/collections/${item._id}`);
    }
  }

  return (
    <div className="mx-3 collection-item" onClick={() => pushLink()}>
      <div className="collection-item-bg pos-relative" style={{backgroundImage: `url("${collectionImgUrl()}")`}}>
          {!collectionImgUrl() ? <div className="no-thumbnail"></div> : '' }
          <NftAvatar imagePath={collectionCreatorImgUrl()} className="nft-avatar"></NftAvatar>
      </div>
      <div className="background-gray d-flex flex-column align-items-center pt-1 pb-2">
        <B1NormalTextTitle className="mt-4 text-center title pt-2">{item.name}</B1NormalTextTitle>
        {/* <SubDescription className="mt-1 text-center sub-title pt-2 pb-2 font-size-sm" style={{minHeight: 35}}>{item.description}</SubDescription> */}
      </div>
    </div>
  );
};

export default CollectionItem;
