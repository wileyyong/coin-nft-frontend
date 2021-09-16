import React from "react";
import configs from 'configs';
import { useHistory } from 'react-router-dom';
import { B1NormalTextTitle, NftAvatar, SubDescription } from "../common/common.styles";
import Utility from "service/utility";

interface UserItemProps {
  item: any;
}

const UserItem: React.FC<UserItemProps> = ({ item }) => {
  const history = useHistory();
  const walletHiddenAddress = () => {
    if(item.wallet) return Utility.getHiddenWalletAddress(item.wallet);
    return '';
  }
  const userImgUrl = (image: string) => {
    if (image) {
      return `${configs.DEPLOY_URL}${image}`;
    }
    return '';
  }

  return (
    <div className="collection-item mr-4" onClick={() => history.push(`/users/${item.wallet}`)}>
      <div className="collection-item-bg pos-relative">
          {userImgUrl(item.image || item.thumbnail || item.cover) ? <img src={userImgUrl(item.image || item.thumbnail || item.cover)} style={{ minHeight: 130, height: 130, width: '100%', objectFit: 'cover' }} alt="userImage" />: <div className="no-thumbnail" style={{ minHeight: 130 }} /> }
          <NftAvatar imagePath={userImgUrl(item.avatar)} className="nft-avatar"></NftAvatar>
      </div>
      <div className="m-3 pt-1 pb-2">
        <B1NormalTextTitle className="mt-4 text-center">{item.name}</B1NormalTextTitle>
        <SubDescription className="wallet-address mt-1 text-center">{walletHiddenAddress()}</SubDescription>
      </div>
    </div>
  );
};

export default UserItem;
