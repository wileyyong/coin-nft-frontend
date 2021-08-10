/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

interface ConnectWalletProps {
  handleClose?: any;
  show: boolean;
}

const ConnectWalletModal: React.FC<ConnectWalletProps> = ({
  show,
  handleClose,
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Connect your wallet</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          By connecting your wallet, you agree to our <Link to="/terms">Terms of Service</Link> and our
          <Link to="/privacy">Privacy Policy</Link>.
        </p>
        <Button variant="primary">Metamask</Button>
        <Button variant="link">Sign in without metamask</Button>
        <div>
            New to Ethereum?
            <br></br>
            <a href="#">Learn more about wallets</a>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConnectWalletModal;
