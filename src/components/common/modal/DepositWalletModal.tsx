/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { Modal, Image } from "react-bootstrap";
import logo from "assets/imgs/puml-logo-footer.png";
import deposit_img from "assets/imgs/deposit_auth.png";
import download_img from "assets/imgs/download.png";
import getit_img from "assets/imgs/getit.png";

interface DepositWalletProps {
  handleClose?: any;
  show: boolean;
}

const DepositWalletModal: React.FC<DepositWalletProps> = ({
  show,
  handleClose,
}) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Body>
        <div className="depositwalletmodal">
          <div className="d-flex justify-content-center">
            <Image src={logo}></Image>
          </div>
          <div className="modal-title text-center pb-2">Login with the PUML App</div>
          <div className="modal-content">
            <div className="auth-title text-center">Scan this code to Connect</div>
            <div className="d-flex flex-row justify-content-center">
              <Image src={deposit_img}></Image>
            </div>
          </div>
          <div className="modal-footer d-flex justify-content-center">
            <div className="pb-2">Dont have the PUML App?</div>
            <div className="d-flex flex-row align-items-center">
              <Image src={download_img} className="pr-4"></Image>
              <Image src={getit_img}></Image>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DepositWalletModal;