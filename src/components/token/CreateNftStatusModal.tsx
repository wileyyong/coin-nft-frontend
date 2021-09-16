import React from "react";
import { Button, Col, Modal, Row, Spinner } from "react-bootstrap";
import { NftCreateStatus } from "model/NftCreateStatus";
import {
  MidTextTitle,
  BigTitle,
  B2NormalTextTitle,
  FlexAlignCenterDiv,
  B1NormalTextTitle,
} from "../common/common.styles";
import { FaCheck } from "react-icons/fa";

interface CreateNftStatusModalProps {
  show: boolean;
  status: any;
  collectible: any;
  onClose?: any;
  createNft?: any;
  approveNft?: any;
  createOffer?: any;
}

const CreateNftStatusModal: React.FC<CreateNftStatusModalProps> = ({
  show,
  status,
  collectible,
  onClose,
  createNft,
  approveNft,
  createOffer,
}) => {
  const reTryCreatingNft = () => {
    if (status === NftCreateStatus.MINT_FAILED) createNft();
  };

  return (
    <Modal show={show} onHide={onClose} className="create-nft-status-modal">
      <Modal.Body className="py-5 px-5">
        {collectible.is_auction || collectible.offer_price > 0 ? (
          <Row>
            <Col>
              <BigTitle>Follow Steps</BigTitle>
              <FlexAlignCenterDiv className="mt-3">
                <div>
                  {status === NftCreateStatus.MINT_PROGRESSING ? (
                    <Spinner animation="border" variant="primary" />
                  ) : (
                    <FaCheck className="fa-check"></FaCheck>
                  )}
                </div>
                <div className="ml-5">
                  <MidTextTitle>Mint</MidTextTitle>
                  <B2NormalTextTitle className="mt-2 grey-color">
                    Send transaction to create your NFT
                  </B2NormalTextTitle>
                </div>
              </FlexAlignCenterDiv>
              <Button
                variant={
                  status === NftCreateStatus.MINT_FAILED
                    ? "primary"
                    : "secondary"
                }
                disabled={status === NftCreateStatus.MINT_FAILED ? false : true}
                className="start-progressing-btn mt-4 outline-btn"
                onClick={() => {
                  reTryCreatingNft();
                }}
              >
                <span>
                  {status === NftCreateStatus.MINT_PROGRESSING &&
                    "Progressing..."}
                  {status === NftCreateStatus.MINT_FAILED && "Try Again"}
                  {status > NftCreateStatus.MINT_FAILED && "Done"}
                </span>
              </Button>
              {status === NftCreateStatus.MINT_FAILED && (
                <B1NormalTextTitle className="mt-2 danger-color">
                  Failed
                </B1NormalTextTitle>
              )}
              <FlexAlignCenterDiv className="mt-3">
                <div>
                  {status === NftCreateStatus.APPROVE_PROGRESSING ? (
                    <Spinner animation="border" variant="primary" />
                  ) : (
                    <FaCheck className="fa-check"></FaCheck>
                  )}
                </div>

                <div className="ml-5">
                  <MidTextTitle>Approve</MidTextTitle>
                  <B2NormalTextTitle className="mt-2 grey-color">
                    This transaction is conducted only once per collection
                  </B2NormalTextTitle>
                </div>
              </FlexAlignCenterDiv>
              <Button
                variant={
                  status === NftCreateStatus.MINT_SUCCEED ||
                  status === NftCreateStatus.APPROVE_FAILED
                    ? "primary"
                    : "secondary"
                }
                disabled={
                  status === NftCreateStatus.MINT_SUCCEED ||
                  status === NftCreateStatus.APPROVE_FAILED
                    ? false
                    : true
                }
                className="start-progressing-btn mt-4 outline-btn"
                onClick={approveNft}
              >
                <span>
                  {status < NftCreateStatus.APPROVE_PROGRESSING && "Start"}
                  {status === NftCreateStatus.APPROVE_PROGRESSING &&
                    "Progressing..."}
                  {status === NftCreateStatus.APPROVE_FAILED && "Try Again"}
                  {status > NftCreateStatus.APPROVE_FAILED && "Done"}
                </span>
              </Button>
              {status === NftCreateStatus.APPROVE_FAILED && (
                <B1NormalTextTitle className="mt-2 danger-color">
                  Failed
                </B1NormalTextTitle>
              )}
              <FlexAlignCenterDiv className="mt-3">
                <div>
                  {status === NftCreateStatus.CREATEOFFER_PROGRESSING ? (
                    <Spinner animation="border" variant="primary" />
                  ) : (
                    <FaCheck className="fa-check"></FaCheck>
                  )}
                </div>
                <div className="ml-5">
                  <MidTextTitle>Create Offer</MidTextTitle>
                  <B2NormalTextTitle className="mt-2 grey-color">
                    Sign message to set offer price
                  </B2NormalTextTitle>
                </div>
              </FlexAlignCenterDiv>
              <Button
                variant={
                  status === NftCreateStatus.APPROVE_SUCCEED ||
                  status === NftCreateStatus.CREATEOFFER_FAILED
                    ? "primary"
                    : "secondary"
                }
                disabled={
                  status === NftCreateStatus.APPROVE_SUCCEED ||
                  status === NftCreateStatus.CREATEOFFER_FAILED
                    ? false
                    : true
                }
                className="start-progressing-btn mt-4 outline-btn"
                onClick={createOffer}
              >
                <span>
                  {status < NftCreateStatus.CREATEOFFER_PROGRESSING && "Start"}
                  {status === NftCreateStatus.CREATEOFFER_PROGRESSING &&
                    "Progressing..."}
                  {status === NftCreateStatus.CREATEOFFER_FAILED && "Try Again"}
                  {status === NftCreateStatus.CREATEOFFER_SUCCEED && "Done"}
                </span>
              </Button>
              {status === NftCreateStatus.CREATEOFFER_FAILED && (
                <B1NormalTextTitle className="mt-2 danger-color">
                  Failed
                </B1NormalTextTitle>
              )}
            </Col>
          </Row>
        ) : (
          <Row>
            <Col className="text-center mint-alone">
              <Spinner animation="border" variant="primary" />
              <MidTextTitle className="mt-2">Mint</MidTextTitle>
              <B2NormalTextTitle className="mt-2 grey-color">
                Send transaction to create your NFT
              </B2NormalTextTitle>
            </Col>
          </Row>
        )}
        <Button
          variant="outline-dark"
          className="cancel-nft-btn mt-4"
          onClick={onClose}
        >
          Cancel
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default CreateNftStatusModal;
