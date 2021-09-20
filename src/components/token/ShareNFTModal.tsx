import React from "react";
import { Col, Modal, Row, Image } from "react-bootstrap";
import {
    BigTitle,
} from "../common/common.styles";
import imgTwitter from "assets/imgs/twitter.png";
import imgTelegram from "assets/imgs/telegram.png";
import imgEmail from "assets/imgs/email.png";
import imgFacebook from "assets/imgs/facebook.png";

interface ShareNFTModalProps {
    handleClose?: any;
    show: boolean;
}

const ShareNFTModal: React.FC<ShareNFTModalProps> = ({
    show,
    handleClose
}) => {
    return (
        <Modal show={show} onHide={handleClose} className="buy-token-modal">
            <Modal.Header>
                <Modal.Title className="p-4">
                    <BigTitle>Share this NFT.</BigTitle>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex justify-content-around text-center">
                    <div>
                        <div className="share-space">
                            <Image src={imgTwitter} className="img-share-icon"></Image>
                        </div>
                        <p>Twitter</p>
                    </div>
                    <div>
                        <div className="share-space">
                            <Image src={imgFacebook} className="img-share-icon"></Image>
                        </div>
                        <p>Facebook</p>
                    </div>
                    <div>
                        <div className="share-space">
                            <Image src={imgTelegram} className="img-share-icon"></Image>
                        </div>
                        <p>Telegram</p>
                    </div>
                    <div>
                        <div className="share-space">
                            <Image src={imgEmail} className="img-share-icon"></Image>
                        </div>
                        <p>E-mail</p>
                    </div>  
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ShareNFTModal;
