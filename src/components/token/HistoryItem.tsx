import React from "react";
import moment from "moment";
import {
  B1NormalTextTitle,
  B1NormalTextTitleGrey,
  SmallTextTitle,
  SmallTextTitleGrey,
  NftAvatar
} from "../common/common.styles";
import imgAvatar from "assets/imgs/avatar.png";
import configs from "configs";
import { BigNumberMul } from "service/number";
import { useAppSelector } from "store/hooks";
import {
  getETHUSDTCurrency,
  getMATICUSDTCurrency
} from "store/Nft/nft.selector";

interface HistoryItemProps {
  item: any;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ item }) => {
  const ethDollarPrice = useAppSelector(getETHUSDTCurrency);
  const maticDollarPrice = useAppSelector(getMATICUSDTCurrency);
  const getDollarPrice = (ethValue: any) => {
    let blockchain: string = item.token.blockchain
      ? item.token.blockchain
      : "ETH";
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
      <div className="detail-info d-flex align-items-center">
        <SmallTextTitleGrey>by&nbsp;</SmallTextTitleGrey>
        <SmallTextTitle style={{ whiteSpace: "nowrap" }}>
          {history.user.name}
        </SmallTextTitle>
        <SmallTextTitleGrey>
          &nbsp;at {moment(history.date).format("M/D/YYYY, H:mm A")}
        </SmallTextTitleGrey>
      </div>
    );
  };
  const getTitle = (history: any) => {
    switch (history.type) {
      case "liked":
        return (
          <div className="d-flex align-items-center">
            <B1NormalTextTitleGrey>
              Liked
              <span className="text-primary item-user pl-2">
                by {item.user ? item.user.name : ""}
              </span>
            </B1NormalTextTitleGrey>
          </div>
        );
      case "listed":
        return (
          <div className="d-flex align-items-center">
            <B1NormalTextTitleGrey>Listed for&nbsp;</B1NormalTextTitleGrey>
            <B1NormalTextTitle>
              {history.price}{" "}
              {item.token.blockchain ? item.token.blockchain : "ETH"}
              <span className="text-primary item-user pl-2">
                by {item.user ? item.user.name : ""}
              </span>
            </B1NormalTextTitle>
          </div>
        );
      case "purchased":
        return (
          <div className="d-flex align-items-center">
            <B1NormalTextTitleGrey>Purchased for&nbsp;</B1NormalTextTitleGrey>
            <B1NormalTextTitle>
              {history.price}{" "}
              {item.token.blockchain ? item.token.blockchain : "ETH"}{" "}
              <span className="text-primary item-user pl-2">
                by {item.user ? item.user.name : ""}
              </span>
            </B1NormalTextTitle>
          </div>
        );
      case "minted":
        return (
          <div className="d-flex align-items-center">
            <B1NormalTextTitleGrey>Minted</B1NormalTextTitleGrey>
            <B1NormalTextTitle>
              <span className="text-primary item-user pl-2">
                by {item.user ? item.user.name : ""}
              </span>
            </B1NormalTextTitle>
          </div>
        );
      case "offered":
        return (
          <div className="d-flex align-items-center">
            <B1NormalTextTitleGrey>Bid&nbsp;</B1NormalTextTitleGrey>
            <B1NormalTextTitle>
              {history.price}{" "}
              {item.token.blockchain ? item.token.blockchain : "ETH"}
              <span className="text-primary item-user pl-2">
                by {item.user ? item.user.name : ""}
              </span>
            </B1NormalTextTitle>
          </div>
        );
      default:
        break;
    }
  };

  const getAvatar = () => {
    if (item.user && item.user.avatar)
      return `${configs.DEPLOY_URL}${item.user.avatar}`;
    return imgAvatar;
  };

  return (
    <div className="history-item mb-2">
      <NftAvatar imagePath={getAvatar()} className="mr-3"></NftAvatar>
      <div>
        {getTitle(item)}
        {/*{getDetailDateTime(item)}*/}
      </div>
    </div>
  );
};

export default HistoryItem;
