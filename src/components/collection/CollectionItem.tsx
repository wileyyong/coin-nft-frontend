import React from "react";
import configs from 'configs';
import { useHistory } from 'react-router-dom';
import { B1NormalTextTitle, NftAvatar, SubDescription } from "../common/common.styles";
import Utility from "service/utility";

interface CollectionItemProps {
  item: any;
}

const CollectionItem: React.FC<CollectionItemProps> = ({ item }) => {
  const history = useHistory();
  const walletHiddenAddress = () => {
    if(item.creator) return Utility.getHiddenWalletAddress(item.creator.wallet);
    return '';
  }
  const collectionImgUrl = () => {
    if(item.thumbnail || item.image || item.media) return `${configs.DEPLOY_URL}${item.thumbnail || item.image || item.media}`;
    return '';
  }

  const collectionCreatorImgUrl = () => {
    if(item.creator && item.creator.avatar) return `${configs.DEPLOY_URL}${item.creator.avatar}`;
    console.log(item.creator);
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
    <div className="flex-fill collection-item mr-4" onClick={() => pushLink()}>
      <div className="collection-item-bg pos-relative">
          {collectionImgUrl() ? <img src={collectionImgUrl()} alt="collectionImage" /> : <div className="no-thumbnail"></div> }
          <NftAvatar imagePath={collectionCreatorImgUrl()} className="nft-avatar"></NftAvatar>
      </div>
      <div className="background-gray d-flex flex-column align-items-center pt-1 pb-2">
        <B1NormalTextTitle className="mt-4 text-center title pt-2">{item.name}</B1NormalTextTitle>
        <SubDescription className="mt-1 text-center sub-title pt-2 pb-2">Athlete</SubDescription>
      </div>
    </div>
  );
};

export default CollectionItem;
