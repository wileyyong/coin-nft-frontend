/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Button, Modal } from "react-bootstrap";
import QRCode from "qrcode.react";


interface PumlScanModalProps {
  handleClose?: any;
  show: boolean;
  wallet: any;
}

const PumlScanModal: React.FC<PumlScanModalProps> = ({
  show,
  handleClose,
  wallet
}) => {  

  return (
    <Modal show={show} onHide={handleClose} className="puml-scan">
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div className="title">Connect Your PUML Wallet</div>
        <div className="qr-div">
          <QRCode value={wallet} size={200} />
          <div className="qr-div__alt">
            Open the app to connect your PUML Account
          </div>
        </div>
        <Button className="btn-primary">Learn More</Button>
      </Modal.Body>
    </Modal>
  );
};

export default PumlScanModal;
