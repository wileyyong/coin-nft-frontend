import React from "react";
import moment from 'moment';
import {
  B1NormalTextTitle,
  NftAvatar,
} from "../common/common.styles";
import imgAvatar from "assets/imgs/avatar.png";
import configs from "configs";
import { BigNumberMul } from "service/number";
import { useAppSelector } from "store/hooks";
import { getETHUSDTCurrency, getMATICUSDTCurrency } from "store/Nft/nft.selector";
import Utility from "service/utility";

interface BidHistoryItemProps {
  item: any;
  token: any;
}

const BidHistoryItem: React.FC<BidHistoryItemProps> = ({ item, token }) => {
  const ethDollarPrice = useAppSelector(getETHUSDTCurrency);
  const maticDollarPrice = useAppSelector(getMATICUSDTCurrency);

  const getDifferentHours = (date: string) => {
    if (date) {
      var now = moment(new Date()); //todays date
      var end = moment(date); // another date
      return now.diff(end, 'hours');
    } else {
      return '';
    }
  }

  const getUserAvatar = () => {
    if (item.user && item.user.avatar) {
      return `${configs.DEPLOY_URL}${item.user.avatar}`;
    }
    return imgAvatar;
  }

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
            default:
        }
    }
    return dollarPrice;
  }

  return (
    <div className="bid-history-item d-flex align-items-center mt-3 mb-2">
      <NftAvatar imagePath={getUserAvatar()} className="mr-3">
      </NftAvatar>
      <div>
          <B1NormalTextTitle>{item.user ? item.user.name : ''} </B1NormalTextTitle>
          <p className="mb-1">Offered {item.price} {token.blockchain ? token.blockchain : 'ETH'} • <span className="text-primary">${getDollarPrice(item.price)}</span></p>
          <p className="time-ago mb-1">{getDifferentHours(item.date)} hours ago</p>
          <a href={`${configs.HASH_LINK_URL}${item.hash}`} target="_blank" className="social-link-item text-center" rel="noreferrer">
            {Utility.getHiddenWalletAddress(item.hash)}
          </a>
      </div>
    </div>
  );
};

export default BidHistoryItem;
