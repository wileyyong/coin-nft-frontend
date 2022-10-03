import React from "react";
import moment from "moment";
import {
  B1NormalTextTitle,
  NftAvatar,
  SmallTextTitle,
  SmallTextTitleGrey
} from "../common/common.styles";
import imgAvatar from "assets/imgs/avatar.png";
import configs from "configs";
import { BigNumberMul } from "service/number";
import { useAppSelector } from "store/hooks";
import {
  getETHUSDTCurrency,
  getMATICUSDTCurrency
} from "store/Nft/nft.selector";
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
      return now.diff(end, "hours");
    } else {
      return "";
    }
  };

  const getUserAvatar = () => {
    if (item.user && item.user.avatar) {
      return `${configs.DEPLOY_URL}${item.user.avatar}`;
    }
    return imgAvatar;
  };

  const getDollarPrice = (ethValue: any) => {
    let blockchain: string = token.blockchain ? token.blockchain : "ETH";
    let dollarPrice: any = 0;
    if (ethValue) {
      switch (blockchain) {
        case "ETH":
          dollarPrice = BigNumberMul(ethValue, ethDollarPrice).toFixed(2);
          break;
        case "MATIC":
          dollarPrice = BigNumberMul(ethValue, maticDollarPrice).toFixed(2);
          break;
        case "PUMLx":
          dollarPrice = (ethValue * 0.05).toFixed(2);
          break;
        default:
      }
    }
    return dollarPrice;
  };

  const getDetailDateTime = (history: any) => {
    return (
      <div className="detail-info d-flex align-items-center pt-1">
        <SmallTextTitleGrey>
          &nbsp;{moment(history.date).format("M/D/YYYY, H:mm A")}
        </SmallTextTitleGrey>
      </div>
    );
  };

  return (
    <div className="bid-history-item d-flex align-items-center mt-3 mb-2">
      <NftAvatar imagePath={getUserAvatar()} className="mr-3"></NftAvatar>
      <div>
        <p className="mb-1">
          {item.price} {token.blockchain ? token.blockchain : "ETH"}
          <span className="text-primary item-user pl-2">
            by {item.user ? item.user.name : ""}
          </span>
        </p>
        {/*<p className="time-ago mb-1">{getDifferentHours(item.date)} hours ago</p>
          <a href={`${configs.HASH_LINK_URL}${item.hash}`} target="_blank" className="social-link-item text-center" rel="noreferrer">
            {Utility.getHiddenWalletAddress(item.hash)}
          </a>*/}
        {getDetailDateTime(item)}
      </div>
    </div>
  );
};

export default BidHistoryItem;
