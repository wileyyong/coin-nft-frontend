import React, { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { NotificationManager } from "react-notifications";
import { isLessValue } from "service/number";
import { useAppSelector } from "store/hooks";
import { getWalletBalance } from "store/User/user.selector";
import {
  B2NormalTextTitle,
  BigTitle,
  DivideLine,
  FlexJustifyBetweenDiv,
  NormalTextTitle,
} from "../common/common.styles";

interface PlaceBidModalProps {
  handleClose?: any;
  submitBid?: any;
  show: boolean;
  minPrice: any;
  token: any;
  owner: any;
}

const PlaceBidModal: React.FC<PlaceBidModalProps> = ({
  show,
  handleClose,
  minPrice,
  submitBid,
  token,
  owner
}) => {
  const balance = useAppSelector(getWalletBalance);
  const [price, setPrice] = useState<any>(minPrice);

  const isBelowMinPrice = () => {
    return isLessValue(price, minPrice);
  };

  const getTotalBidPrice = () => {
    return price;
  }

  const placeBid = () => {
    if (isBelowMinPrice()) return;
    if (isLessValue(price, balance)) {
      submitBid(price,1);
    } else {
      NotificationManager.error(
        "You have no enough balance to process transaction.",
        "Error"
      );
    }
  };

  return (
    <Modal show={show} onHide={handleClose} className="buy-token-modal">
      <Modal.Header closeButton>
        <Modal.Title>
          <BigTitle>Place a bid</BigTitle>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md="12" className="px-4">
            <B2NormalTextTitle>
              You are about to place a bid <span className="text-primary">{token ? token.name : ""}</span>
              <br />
              from <span className="text-secondary">{owner && owner.user ? owner.user.name : ""}</span>
            </B2NormalTextTitle>
            <B2NormalTextTitle className="mt-4">Your bid</B2NormalTextTitle>
            <FlexJustifyBetweenDiv className="mt-2">
              <Form.Control
                required
                type="number"
                placeholder="Enter bid"
                value={price}
                min={minPrice}
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
              />
            </FlexJustifyBetweenDiv>
            {isBelowMinPrice() ? (
              <NormalTextTitle className="mt-2 danger-color">
                You can not input below than {minPrice} ETH{" "}
              </NormalTextTitle>
            ) : (
              ''
            )}
            <DivideLine className="mt-2"></DivideLine>
            <FlexJustifyBetweenDiv className="mt-3">
              <div>Your balance</div>
              <B2NormalTextTitle>{balance} ETH</B2NormalTextTitle>
            </FlexJustifyBetweenDiv>
            <FlexJustifyBetweenDiv className="mt-2">
              <div>Total bid amount</div>
              <B2NormalTextTitle>{getTotalBidPrice()} ETH</B2NormalTextTitle>
            </FlexJustifyBetweenDiv>
            <Button
              variant="primary"
              className="full-width mt-3 text-white"
              onClick={placeBid}
            >
              <span>Place a bid</span>
            </Button>
            <Button variant="link" className="full-width" onClick={handleClose}>
              Cancel
            </Button>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default PlaceBidModal;
