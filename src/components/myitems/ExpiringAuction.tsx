import React from "react";
import {
  AuctionItemCircle,
  B1NormalTextTitle,
  FlexJustifyBetweenDiv,
  SmallTextTitle,
  SubDescription,
} from "../common/common.styles";
import moment from 'moment';
import configs from "configs";

interface AuctionItemProps {
  item: any;
}

const AuctionItem: React.FC<AuctionItemProps> = ({ item }) => {
  const token = item.token || {};

  const getTokenThumbnail = () => {
    return `${configs.DEPLOY_URL}${token.thumbnail || token.media}`;
  };

  return (
    <div className="auction-item mr-4 p-4">
      <AuctionItemCircle className="mb-3"></AuctionItemCircle>
      <div className="token-img-area">
        {token.media ? (
          <img src={getTokenThumbnail()} alt="autctionImage" />
        ) : (
          <div className="no-thumbnail"></div>
        )}
      </div>
      <FlexJustifyBetweenDiv className="mt-3">
        <B1NormalTextTitle>{token.name}</B1NormalTextTitle>
        <SmallTextTitle>Ending in</SmallTextTitle>
      </FlexJustifyBetweenDiv>
      <FlexJustifyBetweenDiv className="mt-2">
        <SmallTextTitle>{token.price}</SmallTextTitle>
        <SubDescription>Expire date: {moment(token.date_end).format('YYYY-MM-DD hh:mm A')}</SubDescription>
        <SmallTextTitle>Auction has ended</SmallTextTitle>
      </FlexJustifyBetweenDiv>
    </div>
  );
};

export default AuctionItem;
