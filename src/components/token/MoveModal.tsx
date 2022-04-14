/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Button, Image, Modal } from "react-bootstrap";
import { Link } from 'react-router-dom';
import nftIcon from "assets/imgs/nft-image4.png";

interface MoveModalProps {
  handleClose?: any;
  show: boolean;
  status: number
}

const MoveModal: React.FC<MoveModalProps> = ({
  show,
  handleClose,
  status
}) => {  

  return (
    <Modal show={show} onHide={handleClose} className="move-modal">
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        {status ? (
          <>
            <div className="title">Just one more step! Stake your NFT to claim rewards.</div>
            <div className="desc">
              To claim rewards from your hard earned steps, you must first  stake one or more of your PUML NFT’s. 
              Head over to the <Link to="/stake">Stake & Earn</Link> page to stake your NFT’s.
            </div>
          </>
        ) : (
          <>
            <div className="title">Purchase & Stake NFT to claim rewards.</div>
            <div className="desc">
              To claim rewards from your hard earned steps, you must first purchase and stake your PUML NFT’s.
            </div>
          </>
        )}
        <Image src={nftIcon} alt="nftIcon"></Image>
        <p className="nft-name">APE C9037289EB</p>
        {status ? (
          <>
            <Link to="/stake">
              <Button className="btn-primary">
                Stake & Earn
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/buy">
              <Button className="btn-primary">
                Buy PUML NFT’s
              </Button>
            </Link>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default MoveModal;
