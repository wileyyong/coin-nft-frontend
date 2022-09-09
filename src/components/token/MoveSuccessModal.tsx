/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Button, Image, Modal } from "react-bootstrap";
import puml from "assets/imgs/puml2.png";

interface MoveSuccessModalProps {
  handleClose?: any;
  show: boolean;
  reward: number;
  rewardDollar: number;
}

const MoveSuccessModal: React.FC<MoveSuccessModalProps> = ({
  show,
  handleClose,
  reward,
  rewardDollar
}) => {  

  return (
    <Modal show={show} onHide={handleClose} className="move-success">
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <Image src={puml} alt="pumlIcon"></Image>
        <div className="note">Success! You have claimed:</div>
        <div className="reward">{reward} PUMLx</div>
        <div className="reward-dollar">${rewardDollar} AUD</div>
        <Button className="btn-primary" onClick={handleClose}>Done</Button>
      </Modal.Body>
    </Modal>
  );
};

export default MoveSuccessModal;
