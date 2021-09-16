import React, { useRef, useState } from "react";
import {
  B1NormalTextTitle,
  FlexAlignCenterDiv,
  NormalTextTitle,
  SmallTextTitleGrey,
} from "../common/common.styles";
import configs from "configs";
import { Button } from "react-bootstrap";
import SmartContract721 from "ethereum/Contract";
import ResellNftModal from "./ResellNftModal";
import ResellNftStatusModal from "./ResellNftStatusModal";
import { NftCreateStatus } from "model/NftCreateStatus";
import DateTimeService from "service/dateTime";
import OfferController from "controller/OfferController";
import { NotificationManager } from "react-notifications";
import { useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getMyInfo } from "store/User/user.selector";
import { getWalletBalance } from "store/User/user.slice";

interface TokenViewProps {
  item: any;
  user: any;
  resaleSucced?: any;
}

const TokenView: React.FC<TokenViewProps> = ({ item, user, resaleSucced }) => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [showResellDialog, setShowResellDialog] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [resellNftStatus, setResellNftStatus] = useState(NftCreateStatus.NONE);
  const loggedInUserInfo = useAppSelector(getMyInfo);

  const resellFormData = useRef({
    min_bid_price: 0,
    expiry_date: "",
    offer_price: 0,
    quantity: 1
  });

  const getTokenThumbnail = () => {
    let media = item.thumbnail ? item.thumbnail.toLowerCase() : item.media.toLowerCase();
    if (
      media.includes("mp3") ||
      media.includes("mp4")
    ) {
      return `${configs.DEPLOY_URL}/content/collection/puml.png`;
    }
    return `${configs.DEPLOY_URL}${item.thumbnail || item.media}`;
  };

  const getCurrentBidPrice = () => {
    if (item.offer && item.offer.bids && item.offer.bids.length) {
      let bids = item.offer.bids.sort(function (a: any, b: any) {
        return b.price - a.price;
      });
      return bids[0].price;
    }
    return 0;
  };

  const get721Owner = () => {
    if (item.owners && item.owners.length) return item.owners[0];
    return null;
  };

  const isOwner = () => {
    const owner = get721Owner();
    if (owner) {
      if (user._id === owner.user && loggedInUserInfo._id === owner.user)
        return true;
    }
    return false;
  };

  const hasResellPermission = () => {
    return !item.offer && isOwner();
  };

  const isCreator = () => {
    if (user._id === item.creator) return true;
    return false;
  };

  const submitted = async (form: any) => {
    setShowStatusModal(true);
    setShowResellDialog(false);
    resellFormData.current = form;
    await approveNft();
  };

  const approveNft = async () => {
    setResellNftStatus(NftCreateStatus.APPROVE_PROGRESSING);
    try {
      if (item.chain_id) {
        let result: any = await SmartContract721.approve(item.chain_id);
        if (result) {
          setResellNftStatus(NftCreateStatus.APPROVE_SUCCEED);
          dispatch(getWalletBalance());
          return;
        }
      }
    } catch (err) {
      setResellNftStatus(NftCreateStatus.APPROVE_FAILED);
    }
    setResellNftStatus(NftCreateStatus.APPROVE_FAILED);
  };

  const createOffer = async () => {
    setResellNftStatus(NftCreateStatus.CREATEOFFER_PROGRESSING);
    try {
      if (item.chain_id && resellFormData.current) {
        const offerPrice = Number(resellFormData.current.offer_price);
        const minBidPrice = Number(resellFormData.current.min_bid_price);
        const isDirectSale = offerPrice > 0 ? true : false;
        const isAuction = minBidPrice > 0 ? true : false;
        let auctionStart =
          isDirectSale && !isAuction
            ? 0
            : Math.floor(new Date().getTime() / 1000);
        let duration =
          isDirectSale && !isAuction
            ? 0
            : DateTimeService.getDurationSecondsWithTwoDates(
              "now",
              resellFormData.current.expiry_date
            );
        let result: any = await SmartContract721.createOffer(
          item.chain_id,
          isDirectSale,
          isAuction,
          offerPrice,
          minBidPrice,
          auctionStart,
          duration
        );
        if (result) {
          dispatch(getWalletBalance());
          if (!result.success) {
            setResellNftStatus(NftCreateStatus.CREATEOFFER_FAILED);
            return;
          }
          let offerObj: any = {
            token_id: item._id,
          };

          if (offerPrice > 0) offerObj["offer_price"] = offerPrice;
          offerObj["min_bid"] = minBidPrice;
          offerObj["expiry_date"] = resellFormData.current.expiry_date;
          await OfferController.create(offerObj);

          setResellNftStatus(NftCreateStatus.CREATEOFFER_SUCCEED);
          setShowStatusModal(false);
          resaleSucced();
          NotificationManager.success(
            "Offer is created successfully.",
            "Success"
          );
        }
      }
    } catch (err) {
      setResellNftStatus(NftCreateStatus.CREATEOFFER_FAILED);
    }
    setResellNftStatus(NftCreateStatus.CREATEOFFER_FAILED);
  };

  const tokenViewClicked = () => {
    if (item && item.token) {
      history.push(`/tokens/${item.token._id}`);
    } else if (item.offer && item.offer.token) {
      history.push(`/tokens/${item.offer.token}`);
    } else {
      history.push(`/tokens/${item._id}`);
    }
  };

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 flex-fill justify-content-start myitem-card mt-2">
      <div className={`${item.media ? "card-image" : 'no-thumbnail'}`} onClick={tokenViewClicked} style={{ backgroundImage: `url("${item.media ? getTokenThumbnail() : ''}")` }}>
        {/* {item.media ? (
            <img src={getTokenThumbnail()} alt="tokenImage" />
          ) : (
            <div className="no-thumbnail"></div>
          )} */}
      </div>
      <div className="card-info">
        <B1NormalTextTitle className="mt-3" onClick={tokenViewClicked}>
          {item.name}
        </B1NormalTextTitle>
        <SmallTextTitleGrey
          className="token-collection-name"
          onClick={tokenViewClicked}
        >
          {item.collections ? item.collections.name : "PUML"}
        </SmallTextTitleGrey>
        {hasResellPermission() && !item.offer ? (
          <Button
            variant="primary"
            className="full-width mt-3 outline-btn"
            onClick={() => {
              setShowResellDialog(true);
            }}
          >
            <span>{isCreator() ? "Put on Sale" : "Resell"}</span>
          </Button>
        ) : (
          item.offer && (
            <div onClick={tokenViewClicked}>
              <NormalTextTitle>
                {item.offer.type === "auction" ? (
                  "Not for Sale"
                ) : (
                  <>From {item.offer.offer_price} ETH</>
                )}
              </NormalTextTitle>
              <FlexAlignCenterDiv className="mt-1">
                {(item.offer.type === "auction" ||
                  item.offer.type === "both") && (
                    <NormalTextTitle className="faint-color">
                      {getCurrentBidPrice() ? (
                        <>Current Bid {getCurrentBidPrice()} ETH</>
                      ) : (
                        item.offer.type !== 'direct' ? <>Minimum Bid {item.offer.min_bid} ETH</> : ''
                      )}
                    </NormalTextTitle>
                  )}
                &nbsp;
                <NormalTextTitle className="grey-color">{item.offer.available_copies ? item.offer.available_copies + '/' + item.offer.total_copies : ''}</NormalTextTitle>
              </FlexAlignCenterDiv>
            </div>
          )
        )}
      </div>

      <ResellNftModal
        show={showResellDialog}
        handleClose={() => {
          setShowResellDialog(false);
        }}
        isResell={!isCreator()}
        handleSubmit={submitted}
      ></ResellNftModal>
      <ResellNftStatusModal
        show={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
        }}
        status={resellNftStatus}
        approveNft={approveNft}
        createOffer={createOffer}
      ></ResellNftStatusModal>
    </div>
  );
};

export default TokenView;
