import React from "react";
import { Modal } from "react-bootstrap";
import {
    MidTextTitle,
    SmallTextTitleGrey,
} from "components/common/common.styles";

import { Link } from "react-router-dom";
import { FaFacebook, FaMailBulk, FaTelegram, FaTwitter } from "react-icons/fa";

interface ShareNFTModalProps {
    handleClose?: any;
    show: boolean;
    item: any;
}

const ShareNFTModal: React.FC<ShareNFTModalProps> = ({
    show,
    handleClose,
    item
}) => {
    return (
        <Modal show={show} onHide={handleClose} className="buy-token-modal">
            <Modal.Header closeButton>
                <Modal.Title className="p-4">
                    <MidTextTitle>Share this NFT.</MidTextTitle>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex justify-content-around text-center pb-4">
                    <Link to="/" className="social-link-item text-center">
                        <div className="share-space mb-3">
                            <FaTwitter />
                        </div>
                        <SmallTextTitleGrey>Twitter</SmallTextTitleGrey>
                    </Link>
                    <Link to="/" className="social-link-item text-center">
                        <div className="share-space mb-3">
                            <FaFacebook />
                        </div>
                        <SmallTextTitleGrey>Facebook</SmallTextTitleGrey>
                    </Link>
                    <Link to="/" className="social-link-item text-center">
                        <div className="share-space mb-3">
                            <FaTelegram />
                        </div>
                        <SmallTextTitleGrey>Telegram</SmallTextTitleGrey>
                    </Link>
                    <Link to="/" className="social-link-item text-center">
                        <div className="share-space mb-3">
                            <FaMailBulk />
                        </div>
                        <SmallTextTitleGrey>E-mail</SmallTextTitleGrey>
                    </Link>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ShareNFTModal;
