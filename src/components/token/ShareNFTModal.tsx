import React from "react";
import { Modal } from "react-bootstrap";
import {
    MidTextTitle,
    SmallTextTitleGrey,
} from "components/common/common.styles";

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
                    <a href={`https://twitter.com?puml_nft=${item._id}`} target="_blank" className="social-link-item text-center" rel="noreferrer">
                        <div className="share-space mb-3">
                            <FaTwitter />
                        </div>
                        <SmallTextTitleGrey>Twitter</SmallTextTitleGrey>
                    </a>
                    <a href={`https://facebook.com?puml_nft=${item._id}`} target="_blank" className="social-link-item text-center" rel="noreferrer">
                        <div className="share-space mb-3">
                            <FaFacebook />
                        </div>
                        <SmallTextTitleGrey>Facebook</SmallTextTitleGrey>
                    </a>
                    <a href={`https://t.me/pumlofficial?puml_nft=${item._id}`} target="_blank" className="social-link-item text-center" rel="noreferrer">
                        <div className="share-space mb-3">
                            <FaTelegram />
                        </div>
                        <SmallTextTitleGrey>Telegram</SmallTextTitleGrey>
                    </a>
                    <a href={`https://mail.com/?puml_nft=${item._id}`} target="_blank" className="social-link-item text-center" rel="noreferrer">
                        <div className="share-space mb-3">
                            <FaMailBulk />
                        </div>
                        <SmallTextTitleGrey>E-mail</SmallTextTitleGrey>
                    </a>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ShareNFTModal;
