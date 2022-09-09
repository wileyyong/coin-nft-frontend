/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { NotificationManager } from "react-notifications";
import { toast } from 'react-toastify';
import {
  B1NormalTextTitle,
  B2NormalTextTitle,
  BigTitle,
  FlexJustifyBetweenDiv,
} from "components/common/common.styles";
import { useAppSelector } from "store/hooks";
import DateTimeService from "service/dateTime";
import { getNftServiceFee } from "store/Nft/nft.selector";

interface ResellNftModalProps {
  handleClose?: any;
  handleSubmit?: any;
  show: boolean;
  isResell?: boolean;
  token?: any
}

const ResellNftModal: React.FC<ResellNftModalProps> = ({
  show,
  handleClose,
  handleSubmit,
  isResell,
  token
}) => {
  const [validated, setValidated] = useState(false);
  const [expiryOption, setExpiryOption] = useState("3");
  const [isInstantPrice, setIsInstantPrice] = useState(false);
  const [isAuction, setIsAuction] = useState(true);
  const serviceFee = useAppSelector(getNftServiceFee);
  const [newOffer, setNewOffer] = useState<any>({
    min_bid_price: 0,
    expiry_date: "",
    offer_price: 0
  });

  const expiryDateOptions = [
    {
      value: "1",
      label: "1 Day",
    },
    {
      value: "3",
      label: "3 Days",
    },
    {
      value: "5",
      label: "5 Days",
    },
    {
      value: "7",
      label: "1 Week",
    },
    {
      value: "10",
      label: "10 Days",
    },
    {
      value: "14",
      label: "2 Weeks",
    },
  ];

  const instantReceiveAmount = () => {
    let remainPer = 100 - serviceFee;
    if (!newOffer.offer_price) newOffer.offer_price = 0;
    return (newOffer.offer_price * remainPer) / 100;
  };

  useEffect(() => {
    let date = DateTimeService.getIsoDateTimeWithDays(parseInt(expiryOption));
    setNewOffer({ ...newOffer, expiry_date: date });
  }, [expiryOption]);

  const onSubmit = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity() !== false) {
      if (!isInstantPrice && !isAuction) {
        toast.warning("Please choose at least one option. (Auction or Direct Sale)");
        NotificationManager.error(
          "Please choose at least one option. (Auction or Direct Sale)",
          "Error"
        );
        return;
      }
      if (isInstantPrice && newOffer.offer_price === '0') {
        toast.warning("Please input at least 0.001 of Offer price.");
        NotificationManager.error(
          "Please input at least 0.001 of Offer price.",
          "Error"
        );
        return;
      }
      if (isAuction && newOffer.min_bid_price === '0') {
        toast.warning("Please input at least 0.001 of bid price.");
        NotificationManager.error(
          "Please input at least 0.001 of bid price.",
          "Error"
        );
        return;
      }
      handleSubmit(newOffer);
    }
    setValidated(true);
  };

  const handleChange = (e: any) => {
    let fieldName = e.target.name;
    let fieldVal = e.target.value;
    if (fieldName === "offer_price" || fieldName === "min_bid_price") {
      const regex = /^[0-9]\d*(?:[.]\d*)?$/;
      if (e.target.value !== "" && !regex.test(e.target.value)) {
        e.preventDefault();
        return;
      }
      if(fieldVal.length>1 && fieldVal[0] === '0' && fieldVal[1] !== '.') {
        fieldVal = fieldVal.substring(1)
      }
    }
    setNewOffer({ ...newOffer, [fieldName]: fieldVal });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <BigTitle>{isResell ? "Resell Token" : "Create New Offer"}</BigTitle>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <Form noValidate validated={validated} onSubmit={onSubmit}>
              <FlexJustifyBetweenDiv className="mt-4">
                <BigTitle>Put up for sale</BigTitle>
                <Form.Check
                  type="switch"
                  id="put-up-sale-switch"
                  checked={isAuction}
                  name="is_auction"
                  onChange={(e: any) => setIsAuction(e.target.checked)}
                />
              </FlexJustifyBetweenDiv>
              <B2NormalTextTitle className="faint-color mt-2">
                You will receive bids for this item.
              </B2NormalTextTitle>
              {isAuction && (
                <div>
                  <B1NormalTextTitle className="mt-3">
                    Minimum bid price
                  </B1NormalTextTitle>
                  <Form.Row className="mt-1">
                    <Form.Group as={Col} md="12">
                      <Form.Control
                        required
                        type="text"
                        placeholder={`Enter Minimum Bid in ${token.blockchain ? token.blockchain : "ETH"}`}
                        name="min_bid_price"
                        value={newOffer.min_bid_price || ''}
                        onChange={(e) => handleChange(e)}
                        pattern="^(0|[1-9]\d*)?(\.\d+)?(?<=\d)$"
                        maxLength={10}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please input valid value.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Row>
                  <B1NormalTextTitle>Expiry Date</B1NormalTextTitle>
                  <Form.Row className="mt-1">
                    <Form.Group as={Col} md="6">
                      <Form.Control
                        as="select"
                        value={expiryOption}
                        onChange={(e) => {
                          setExpiryOption(e.target.value);
                        }}
                      >
                        {expiryDateOptions.map((eOpt, index) => {
                          return (
                            <option value={eOpt.value} key={index}>
                              {eOpt.label}
                            </option>
                          );
                        })}
                      </Form.Control>
                    </Form.Group>
                  </Form.Row>
                </div>
              )}
              <FlexJustifyBetweenDiv className="mt-4">
                <BigTitle>Instant Sell Price</BigTitle>
                <Form.Check
                  type="switch"
                  id="instant-sell-price-switch"
                  checked={isInstantPrice}
                  onChange={(e) => setIsInstantPrice(e.target.checked)}
                />
              </FlexJustifyBetweenDiv>
              <B2NormalTextTitle className="faint-color mt-2">
                Enter price to allow users instantly purchase your NFT
              </B2NormalTextTitle>
              {isInstantPrice && (
                <Form.Row className="mt-4">
                  <Form.Group as={Col} md="12">
                    <Form.Control
                      required
                      type="text"
                      placeholder="Enter price for one piece"
                      name="offer_price"
                      value={newOffer.offer_price || ''}
                      onChange={(e) => handleChange(e)}
                      pattern="^(0|[1-9]\d*)?(\.\d+)?(?<=\d)$"
                      maxLength={10}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please input valid value.
                    </Form.Control.Feedback>
                    <B2NormalTextTitle className="faint-color mt-3">
                      Service Fee {serviceFee} %
                    </B2NormalTextTitle>
                    <br />
                    <B2NormalTextTitle className="faint-color mt-1">
                      You will receive {instantReceiveAmount()} {token.blockchain ? token.blockchain : "ETH"}
                    </B2NormalTextTitle>
                  </Form.Group>
                </Form.Row>
              )}
              <Button
                type="submit"
                variant="primary"
                className="full-width mt-4 w-100"
              >
                <span>{isResell ? "Resell" : "Put on Sale"}</span>
              </Button>
            </Form>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default ResellNftModal;
