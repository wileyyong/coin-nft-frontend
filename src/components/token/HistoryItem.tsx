import React from "react";
import moment from 'moment';
import {
  B1NormalTextTitle,
  B1NormalTextTitleGrey,
  SmallTextTitle,
  SmallTextTitleGrey,
  NftAvatar,
} from "../common/common.styles";
import imgAvatar from "assets/imgs/avatar.png";
import configs from "configs";
import { BigNumberMul } from "service/number";
import { useAppSelector } from "store/hooks";
import { getETHUSDTCurrency } from "store/Nft/nft.selector";

interface HistoryItemProps {
  item: any;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ item }) => {
  const ethDollarPrice = useAppSelector(getETHUSDTCurrency);
  const getDollarPrice = (ethValue: any) => {
    if (ethValue) {
        let dollarPrice = BigNumberMul(ethValue, ethDollarPrice).toFixed(2);
        return dollarPrice;
    }
    return 0;
  };
  const getDetailDateTime = (history: any) => {
    return <div className="detail-info d-flex align-items-center"><SmallTextTitleGrey>by&nbsp;</SmallTextTitleGrey>
      <SmallTextTitle style={{ whiteSpace: 'nowrap' }}>{history.user.name}</SmallTextTitle>
      <SmallTextTitleGrey>&nbsp;at {moment(history.date).format('M/D/YYYY, H:mm A')}</SmallTextTitleGrey>
    </div>;
  }
  const getTitle = (history: any) => {
    switch(history.type) {
      case 'liked':
        return <div className="d-flex align-items-center">
          <B1NormalTextTitleGrey>Liked</B1NormalTextTitleGrey>
        </div>;
      case 'listed':
        return <div className="d-flex align-items-center">
          <B1NormalTextTitleGrey>Listed for&nbsp;</B1NormalTextTitleGrey>
          <B1NormalTextTitle>{history.price} ETH • <span className="text-primary">${getDollarPrice(history.price)}</span></B1NormalTextTitle>
        </div>;
      case 'purchased':
        return <div className="d-flex align-items-center">
          <B1NormalTextTitleGrey>Purchased for&nbsp;</B1NormalTextTitleGrey>
          <B1NormalTextTitle>{history.price} ETH • <span className="text-primary">${getDollarPrice(history.price)}</span></B1NormalTextTitle>
        </div>;
      case 'minted':
        return <div className="d-flex align-items-center">
          <B1NormalTextTitleGrey>Minted</B1NormalTextTitleGrey>
        </div>;
      case 'offered':
        return <div className="d-flex align-items-center">
          <B1NormalTextTitleGrey>Bid&nbsp;</B1NormalTextTitleGrey>
          <B1NormalTextTitle>{history.price} ETH • <span className="text-primary">${getDollarPrice(history.price)}</span></B1NormalTextTitle>
        </div>;
      default:
        break;
    }
  }

  const getAvatar = () => {
    if(item.user && item.user.avatar) return `${configs.DEPLOY_URL}${item.user.avatar}`;
    return imgAvatar;
  }

  return (
    <div className="history-item mb-2">
      <NftAvatar imagePath={getAvatar()} className="mr-3">
      </NftAvatar>
      <div>
        {getTitle(item)}
        {getDetailDateTime(item)}
      </div>
    </div>
  );
};

export default HistoryItem;