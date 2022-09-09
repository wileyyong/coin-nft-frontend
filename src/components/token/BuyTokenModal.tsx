import React, { useState, useEffect } from "react";
import { useAppSelector } from "store/hooks";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { getNftServiceFee } from "store/Nft/nft.selector";
import {
  B2NormalTextTitle,
  BigTitle,
  DivideLine,
  FlexJustifyBetweenDiv
} from "../common/common.styles";
import { getWalletBalance } from "store/User/user.selector";
import SmartContract from "ethereum/Contract";
import configs from "configs";

interface BuyTokenModalProps {
  handleClose?: any;
  directBuy?: any;
  show: boolean;
  offer: any;
  token: any;
  owner: any;
}

const BuyTokenModal: React.FC<BuyTokenModalProps> = ({
  show,
  handleClose,
  directBuy,
  offer,
  token,
  owner
}) => {
  const [price] = useState<any>(offer.offer_price);
  const serviceFee = useAppSelector(getNftServiceFee);
  const [balance, setBalance] = useState<any>(useAppSelector(getWalletBalance));

  const balancePUML = async () => {
    const balanceOfPUML: any = await SmartContract.balanceCustomToken(configs.PUML20_ADDRESS);
    setBalance(parseFloat(balanceOfPUML).toFixed(3));
  }

  useEffect(() => {
    if (token.blockchain === 'PUMLx') balancePUML();
  }, [token.blockchain]);

  return (
    <Modal show={show} onHide={handleClose} className="buy-token-modal">
      <Modal.Header closeButton>
        <Modal.Title>
          <BigTitle>Checkout</BigTitle>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md="12" className="px-4">
            <B2NormalTextTitle>
              You are about to purchase {token.name}
              <br />
              from {owner && owner.user ? owner.user.name : ""}
            </B2NormalTextTitle>
            <B2NormalTextTitle className="mt-4">You pay</B2NormalTextTitle>
            <FlexJustifyBetweenDiv className="mt-2">
              <div>{price}</div>
              <B2NormalTextTitle>{token.blockchain ? token.blockchain : "ETH"}</B2NormalTextTitle>
            </FlexJustifyBetweenDiv>
            <DivideLine className="mt-2"></DivideLine>
            <FlexJustifyBetweenDiv className="mt-3">
              <div>Your balance</div>
              <B2NormalTextTitle>{balance} {token.blockchain ? token.blockchain : "ETH"}</B2NormalTextTitle>
            </FlexJustifyBetweenDiv>
            <FlexJustifyBetweenDiv className="mt-2">
              <div>Service fee</div>
              <B2NormalTextTitle>{serviceFee} %</B2NormalTextTitle>
            </FlexJustifyBetweenDiv>
            <FlexJustifyBetweenDiv className="mt-2">
              <div>You will pay</div>
              <B2NormalTextTitle>{price.toFixed(3)} {token.blockchain ? token.blockchain : "ETH"}</B2NormalTextTitle>
            </FlexJustifyBetweenDiv>
            <Button
              variant="primary"
              className="full-width mt-3 text-white"
              onClick={() => {
                directBuy();
              }}
            >
              Proceed to payment
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

export default BuyTokenModal;
