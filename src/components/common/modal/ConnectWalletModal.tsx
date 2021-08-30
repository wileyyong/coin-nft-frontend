/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { Button, Modal, Image } from "react-bootstrap";
import logo from "assets/imgs/PUML-Logo.png";
import puml_img from "assets/imgs/puml.png";
import eth_img from "assets/imgs/eth.png";
import deposit_img from "assets/imgs/deposit_auth.png";
import copy_img from "assets/imgs/copy.png";

interface ConnectWalletProps {
  handleClose?: any;
  show: boolean;
}

const ConnectWalletModal: React.FC<ConnectWalletProps> = ({
  show,
  handleClose,
}) => {
  const [styleCSS, setStyleCSS] = useState(true);
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Body>
        <div className="connectwalletmodal">
          {styleCSS ? (
            <div className="your-wallet">
              <div className="d-flex pb-2">
                <button type="button" className="close" aria-label="Close" onClick={handleClose}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-title pb-3">Total Balance</div>
              <div className="modal-balance d-flex flex-row justify-content-between mb-3">
                <div>
                  <div className="balance-title pb-2">Total Balance</div>
                  <div className="pb-3">
                    <span className="balance-amount-usd">$40.0000</span>
                    <span className="balance-unit">USD</span>
                  </div>
                  <div className="balance-amount-puml">
                    0.19ETH • 30.0000PUML
                  </div>
                </div>
                <div className="d-flex align-items-end">
                  <div></div>
                  <Image src={logo}></Image>
                </div>
              </div>
              <div className="modal-content">
                <div className="d-flex flex-row align-items-center p-3" onClick={() => setStyleCSS(false)}>
                  <Image src={puml_img} className="pr-2"></Image>
                  <div className="flex-fill d-flex flex-column pr-2">
                    <div className="d-flex flex-row align-items-center justify-content-between currency-content pb-2">
                      <div>PUML</div>
                      <div>40,000.0000</div>
                    </div>
                    <div className="d-flex flex-row align-items-center justify-content-between coin-content">
                      <div>Puml Coin</div>
                      <div>$40.00USD</div>
                    </div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currency-content" className="bi bi-chevron-right" viewBox="0 0 16 16">
                    <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                  </svg>
                </div>
                <hr></hr>
                <div className="d-flex flex-row align-items-center p-3" onClick={() => setStyleCSS(false)}>
                  <Image src={eth_img} className="pr-2"></Image>
                  <div className="flex-fill d-flex flex-column pr-2">
                    <div className="d-flex flex-row align-items-center justify-content-between currency-content pb-2">
                      <div>ETH</div>
                      <div>0.23ETH</div>
                    </div>
                    <div className="d-flex flex-row align-items-center justify-content-between coin-content">
                      <div>Ethereum</div>
                      <div>$395.79 USD</div>
                    </div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currency-content" className="bi bi-chevron-right" viewBox="0 0 16 16">
                    <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                  </svg>
                </div>
              </div>
              <Button className="btn-primary">Deposit AUD</Button>
            </div>
          ) : (
            <div className="deposit-currency">
              <div className="d-flex">
                <button type="button" className="close" onClick={() => setStyleCSS(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                    <path d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                  </svg>
                </button>
              </div>
              <div className="modal-header">
                <div className="modal-title">Deposit ETH</div>
                <Image src={eth_img}></Image>
              </div>
              <div className="modal-content">
                <div className="auth-data d-flex flex-row justify-content-center">
                  <Image src={deposit_img}></Image>
                </div>
                <div className="address d-flex flex-row align-items-center justify-content-between p-4">
                  <div>0x5b61cEA479a23D391022f5…</div>
                  <Image src={copy_img}></Image>
                </div>
              </div>
            </div>
          )}
        </div>
        <div>

        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConnectWalletModal;