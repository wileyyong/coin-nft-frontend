/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { Button, Col, Form, Row } from "react-bootstrap";
import { NotificationManager } from "react-notifications";
import imgAvatar from "assets/imgs/avatar.svg";

import {
    B1NormalTextTitle,
    B2NormalTextTitle,
    B3NormalTextTitle,
    NormalTextTitle,
    BigTitle,
    FlexAlignCenterDiv,
    FlexJustifyBetweenDiv,
    MBigTitle,
    SubDescription,
    NftAvatar,
} from "components/common/common.styles";
import Layout from "components/Layout";
import { FaLongArrowAltLeft, FaPlus } from "react-icons/fa";
import FileUploader from "components/common/uploader/FileUploader";
import { Link, useLocation } from "react-router-dom";

import ChooseCollectionItem from "components/collection/ChooseCollectionItem";
import CreateCollectionModal from "components/collection/CreateCollectionModal";
import { getMyInfo } from "store/User/user.selector";
import Utility from "service/utility";
//import CollectionController from "controller/CollectionController";
import LoadingSpinner from "components/common/LoadingSpinner";
import configs from "configs";
import {
    //  loadMyCollections,
    connectUserWallet,
    getWalletBalance,
} from "store/User/user.slice";
import {
    //  getMyCollections,
    getWalletAddress,
    isAuthenticated,
} from "store/User/user.selector";
import ConnectWalletBtn from "components/common/button/ConnectWalletBtn";
//import NftController from "controller/NftController";
import SmartContract from "ethereum/Contract";
import DateTimeService from "service/dateTime";
//getNftCategories
import { getNftServiceFee } from "store/Nft/nft.selector";
import CreateNftStatusModal from "components/token/CreateNftStatusModal";
import { NftCreateStatus } from "model/NftCreateStatus";
//import OfferController from "controller/OfferController";

interface CreateCollectibleProps { }

const CreateCollectible: React.FC<CreateCollectibleProps> = () => {
    const dispatch = useAppDispatch();
    const location: any = useLocation();
    const loggedInUserInfo = useAppSelector(getMyInfo);
    //   const collectionItems = useAppSelector(getMyCollections);
    //   const nftCategories = useAppSelector(getNftCategories);
    const serviceFee = useAppSelector(getNftServiceFee);
    const walletAddress = useAppSelector(getWalletAddress);
    const isAuth = useAppSelector(isAuthenticated);
    const [validated, setValidated] = useState(false);
    const [previewThumbnail, setPreviewThumbnail] = useState<any>(null);
    const [isNftImage, setIsNftImage] = useState(true);
    const [isInstantPrice, setIsInstantPrice] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [isSucceed, setIsSucceed] = useState(false);
    const [expiryOption, setExpiryOption] = useState("3");
    const [selectedCategories, setSelectedCategories] = useState<any[]>([]);

    const [collectible, setCollectible] = useState<any>({
        name: "",
        description: "",
        media: "",
        thumbnail: null,
        royalties: 0,
        min_bid_price: 0,
        categories: "",
        expiry_date: "",
        offer_price: 0,
        collection: null,
        is_auction: true,
        locked: "",
        offchain: true,
    });
    const [showCollectionDialog, setShowCollectionDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [createNftStatus, setCreateNftStatus] = useState(NftCreateStatus.NONE);
    const [createNftDialog, setCreateNftDialog] = useState(false);

    const [nftFromDB, setNftFromDB] = useState<any>(null);
    const [chainId, setChainId] = useState(null);

    const expiryDateOptions = [
        {
            value: "1",
            label: "1 Day",
        },
        {
            value: "3",
            label: "3 Days",
        },
        {
            value: "5",
            label: "5 Days",
        },
        {
            value: "7",
            label: "1 Week",
        },
        {
            value: "10",
            label: "10 Days",
        },
        {
            value: "14",
            label: "2 Weeks",
        },
    ];

    const categorySelected = (val: string) => {
        let updatedCategories: any[] =
            JSON.parse(JSON.stringify(selectedCategories)) || [];
        if (updatedCategories.includes(val)) {
            let index = updatedCategories.findIndex((elm: any) => elm === val);
            updatedCategories.splice(index, 1);
            setSelectedCategories(updatedCategories);
        } else {
            updatedCategories.push(val);
            setSelectedCategories(updatedCategories);
        }
    };

    const getCategoryClass = (val: string) => {
        if (selectedCategories.includes(val))
            return "nft-type-btn mr-4 nft-type-selected";
        return `nft-type-btn mr-4`;
    };

    const getLoggedInUserAvatar = () => {
        if (loggedInUserInfo) {
            if (loggedInUserInfo.avatar) {
                return `${configs.DEPLOY_URL}${loggedInUserInfo.avatar}`;
            }
        }
        return imgAvatar;
    }

    const setNftFile = (file: any) => {
        if (file) {
            setCollectible({ ...collectible, media: file });
            if (Utility.isFileImage(file)) {
                setIsNftImage(true);
            } else {
                setIsNftImage(false);
            }
        } else {
            setIsNftImage(true);
            setCollectible({ ...collectible, media: "" });
        }
    };

    const setPreview = (e: any) => {
        setPreviewThumbnail(e);
    };

    const instantReceiveAmount = () => {
        let remainPer = 100 - serviceFee;
        return (collectible.offer_price * remainPer) / 100;
    };

    const createCollection = async (collection: any) => {
        setIsLoading(true);
        let formData = Utility.getFormDataFromObject(collection);
        try {
            //await CollectionController.create(formData);
            loadCollections();
            setIsLoading(false);
            setShowCollectionDialog(false);
            NotificationManager.success(
                "Collection is created successfully.",
                "Success"
            );
        } catch (err) {
            setIsLoading(false);
            NotificationManager.error("Create Collection Failed!", "Error");
        }
    };

    const submitForm = async (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        if (!walletAddress) {
            dispatch(connectUserWallet());
            return;
        }

        setValidated(true);
        const form = e.currentTarget;
        if (form.checkValidity() !== false) {
            if (!collectible.media) {
                NotificationManager.error("No Media File!", "Error");
                return;
            }

            if (!selectedCategories.length) {
                NotificationManager.error(
                    "Please select at least one category!",
                    "Error"
                );
                return;
            }
            setCreateNftDialog(true);
            if (createNftStatus < NftCreateStatus.MINT_SUCCEED) {
                createNft();
            }
        }
    };

    const getPureNftObj = () => {
        return {
            name: collectible.name,
            description: collectible.description,
            media: collectible.media,
            thumbnail: collectible.thumbnail,
            royalties: collectible.royalties,
            categories: collectible.categories,
            collection: collectible.collection,
            locked: collectible.locked,
            offchain: collectible.offchain,
        };
    };

    const createNft = async () => {
        setCreateNftStatus(NftCreateStatus.MINT_PROGRESSING);
        let result: any = nftFromDB;
        if (!result) {
            try {
                let formData = Utility.getFormDataFromObject(getPureNftObj());
                //result = await NftController.create(formData);
                setNftFromDB(result);
            } catch (err) {
                setCreateNftStatus(NftCreateStatus.MINT_FAILED);
            }
        }
        if (result && result.link) {
            const tokenURI = `${configs.DEPLOY_URL}${result.link}`;
            const royalties = result.token.royalties || 0;
            const locked_content = result.token.locked || "";
            try {
                const contractResult = await SmartContract.createNft(
                    tokenURI,
                    royalties * 100,
                    locked_content
                );
                if (contractResult.success) {
                    dispatch(getWalletBalance());
                    setCreateNftStatus(NftCreateStatus.MINT_SUCCEED);
                    setChainId(contractResult.tokenId);
                    //   await NftController.setChainId(result.token._id, {
                    //     chain_id: contractResult.tokenId,
                    //   });
                    if (isPureNftCreation()) {
                        setCreateNftDialog(false);
                        setIsSucceed(true);
                        setTimeout(function () {
                            // @ts-ignore
                            document.getElementById("layout").scrollTo({
                                // @ts-ignore
                                top: 0,
                                behavior: "smooth",
                            });
                        }, 200);
                    }
                } else {
                    setCreateNftStatus(NftCreateStatus.MINT_FAILED);
                }
            } catch (err) {
                setCreateNftStatus(NftCreateStatus.MINT_FAILED);
            }
        }
    };

    const approveNft = async () => {
        setCreateNftStatus(NftCreateStatus.APPROVE_PROGRESSING);
        try {
            if (chainId) {
                let result: any = await SmartContract.approve(chainId);
                if (result) {
                    dispatch(getWalletBalance());
                    setCreateNftStatus(NftCreateStatus.APPROVE_SUCCEED);
                    return;
                }
            }
        } catch (err) {
            setCreateNftStatus(NftCreateStatus.APPROVE_FAILED);
        }
        setCreateNftStatus(NftCreateStatus.APPROVE_FAILED);
    };

    const createOffer = async () => {
        setCreateNftStatus(NftCreateStatus.CREATEOFFER_PROGRESSING);
        try {
            if (chainId && nftFromDB) {
                let auctionStart = Math.floor(
                    new Date(nftFromDB.token.date_create).getTime() / 1000
                );
                let duration = DateTimeService.getDurationSecondsWithTwoDates(
                    nftFromDB.date_create,
                    collectible.expiry_date
                );
                const isDirectSale = collectible.offer_price > 0 ? true : false;
                let result: any = await SmartContract.createOffer(
                    chainId,
                    isDirectSale,
                    collectible.is_auction,
                    collectible.offer_price,
                    collectible.min_bid_price,
                    auctionStart,
                    duration
                );
                if (result) {
                    dispatch(getWalletBalance());
                    let offerObj: any = {
                        token_id: nftFromDB.token._id,
                        expiry_date: collectible.expiry_date,
                    };

                    if (collectible.offer_price > 0)
                        offerObj["offer_price"] = collectible.offer_price;
                    if (collectible.is_auction)
                        offerObj["min_bid"] = collectible.min_bid_price;

                    //await OfferController.create(offerObj);

                    setCreateNftStatus(NftCreateStatus.CREATEOFFER_SUCCEED);
                    setCreateNftDialog(false);
                    setIsSucceed(true);
                    setTimeout(function () {
                        // @ts-ignore
                        document.getElementById("layout").scrollTo({
                            // @ts-ignore
                            top: 0,
                            behavior: "smooth",
                        });
                    }, 200);
                }
            }
        } catch (err) {
            setCreateNftStatus(NftCreateStatus.CREATEOFFER_FAILED);
        }
        setCreateNftStatus(NftCreateStatus.CREATEOFFER_FAILED);
    };

    const handleChange = (e: any) => {
        let fieldName = e.target.name;
        if (e.target.type === "checkbox") {
            let fieldVal = e.target.checked;
            setCollectible({ ...collectible, [fieldName]: fieldVal });
        } else {
            let fieldVal = e.target.value;
            setCollectible({ ...collectible, [fieldName]: fieldVal });
        }
    };

    const isPureNftCreation = () => {
        if (collectible.is_auction || collectible.offer_price > 0) return false;
        return true;
    };

    const loadCollections = () => {
        //dispatch(loadMyCollections());
    };

    useEffect(() => {
        loadCollections();
    }, []);

    useEffect(() => {
        setCollectible({
            ...collectible,
            categories: selectedCategories.join("|"),
        });
    }, [selectedCategories]);

    useEffect(() => {
        let date = DateTimeService.getIsoDateTimeWithDays(parseInt(expiryOption));
        setCollectible({ ...collectible, expiry_date: date });
    }, [expiryOption]);

    return (
        <Layout className="create-collectible-container">
            <Link to="/">
                <div className="d-flex flex-row align-items-center">
                    <FaLongArrowAltLeft />
                    <B2NormalTextTitle className="ml-2">
                        MANAGE COLLECTIBLE TYPE
                    </B2NormalTextTitle>
                </div>
            </Link>
            {isSucceed ? (
                <Row>
                    <Col>
                        <MBigTitle className="mt-4 faint-color"> Congratulations! NFT is successfully created! </MBigTitle>
                        <FlexAlignCenterDiv className="mt-5">
                            <Link to="/items">
                                <Button className="default-btn-size mr-4 fill-btn">
                                    <span>My Items</span>
                                </Button>
                            </Link>
                            <Link to="/explore">
                                <Button className="default-btn-size outline-btn">
                                    <span>Explore</span>
                                </Button>
                            </Link>
                        </FlexAlignCenterDiv>
                    </Col>
                </Row>
            ) : (
                <Row>
                    <Col>
                        <MBigTitle className="mt-4 text-black">
                            Create collectible
                        </MBigTitle>
                        <Form noValidate validated={validated} onSubmit={submitForm}>
                            <Row className="mt-4 row-reserve">
                                <Col xl="5" lg="6">
                                    <div className="upload-file">
                                        <div className="title mb-4">Upload file</div>
                                        <FileUploader
                                            title="PNG, JPEG, GIF, WEBP, MP4 or MP3. Max 30MB."
                                            accept={configs.NFT_FILE_ACCEPT}
                                            setFile={(e: any) => setNftFile(e)}
                                            setPreview={(e: any) => setPreview(e)}
                                        ></FileUploader>
                                        {!isNftImage && (
                                            <>
                                                <BigTitle className="mt-4 mb-4">Upload cover</BigTitle>
                                                <FileUploader
                                                    title="PNG, GIF. Max 30MB."
                                                    accept={configs.IMG_FILE_ACCEPT}
                                                    setFile={(e: any) =>
                                                        setCollectible({ ...collectible, thumbnail: e })
                                                    }
                                                    setPreview={(e: any) => setPreview(e)}
                                                ></FileUploader>
                                            </>
                                        )}
                                    </div>
                                    <FlexJustifyBetweenDiv className="mt-4">
                                        <BigTitle className="text-black">Put up for sale</BigTitle>
                                        <Form.Check
                                            type="switch"
                                            id="put-up-sale-switch"
                                            checked={collectible.is_auction}
                                            name="is_auction"
                                            onChange={(e) => handleChange(e)}
                                        />
                                    </FlexJustifyBetweenDiv>
                                    <B2NormalTextTitle className="text-gray mt-2">
                                        You will receive bids for this item.
                                    </B2NormalTextTitle>
                                    {collectible.is_auction && (
                                        <div>
                                            <B1NormalTextTitle className="text-black mt-3">
                                                Minimum bid price
                                            </B1NormalTextTitle>
                                            <Form.Row className="mt-1">
                                                <Form.Group as={Col} md="12">
                                                    <Form.Control
                                                        required
                                                        type="text"
                                                        placeholder="Enter Minimum Bid in ETH"
                                                        name="min_bid_price"
                                                        onChange={(e) => handleChange(e)}
                                                        pattern="^(0|[1-9]\d*)?(\.\d+)?(?<=\d)$"
                                                        maxLength={10}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        Please input valid minimum bid price.
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Form.Row>
                                            <B1NormalTextTitle className="text-black">Expiry Date</B1NormalTextTitle>
                                            <Form.Row className="mt-1">
                                                <Form.Group as={Col} md="6">
                                                    <Form.Control
                                                        as="select"
                                                        value={expiryOption}
                                                        onChange={(e) => {
                                                            setExpiryOption(e.target.value);
                                                        }}
                                                    >
                                                        {expiryDateOptions.map((eOpt, index) => {
                                                            return (
                                                                <option value={eOpt.value} key={index}>
                                                                    {eOpt.label}
                                                                </option>
                                                            );
                                                        })}
                                                    </Form.Control>
                                                </Form.Group>
                                            </Form.Row>
                                        </div>
                                    )}
                                    <FlexJustifyBetweenDiv className="mt-4">
                                        <BigTitle className="text-black">Instant Sell Price</BigTitle>
                                        <Form.Check
                                            type="switch"
                                            id="instant-sell-price-switch"
                                            checked={isInstantPrice}
                                            onChange={(e) => setIsInstantPrice(e.target.checked)}
                                        />
                                    </FlexJustifyBetweenDiv>
                                    <B2NormalTextTitle className="text-gray mt-2">
                                        Enter price to allow users instantly purchase your NFT
                                    </B2NormalTextTitle>
                                    {isInstantPrice && (
                                        <Form.Row className="mt-4">
                                            <Form.Group as={Col} md="12">
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    placeholder="Enter price for one piece"
                                                    name="offer_price"
                                                    pattern="^(0|[1-9]\d*)?(\.\d+)?(?<=\d)$"
                                                    maxLength={10}
                                                    onChange={(e) => handleChange(e)}
                                                />
                                                <B2NormalTextTitle className="mt-3 text-black">
                                                    <span className="text-gray">Service Fee</span>&nbsp;&nbsp;{serviceFee} %
                                                </B2NormalTextTitle>
                                                <B2NormalTextTitle className="mt-2 text-black">
                                                    <span className="text-gray">You will receive</span>&nbsp;&nbsp;{instantReceiveAmount()} ETH
                                                </B2NormalTextTitle>
                                            </Form.Group>
                                        </Form.Row>
                                    )}
                                    <FlexJustifyBetweenDiv className="mt-4">
                                        <BigTitle className="text-black">Unlock once purchased</BigTitle>
                                        <Form.Check
                                            type="switch"
                                            id="unlock-once-purchased-switch"
                                            checked={isLocked}
                                            onChange={(e) => setIsLocked(e.target.checked)}
                                        />
                                    </FlexJustifyBetweenDiv>
                                    <B2NormalTextTitle className="text-gray mt-2">
                                        Content will be unlocked after successful transaction
                                    </B2NormalTextTitle>
                                    {isLocked && (
                                        <Form.Row className="mt-4">
                                            <Form.Group as={Col} md="12">
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    placeholder="Digital key, code to redeem or link to a file..."
                                                    name="locked"
                                                    onChange={(e) => handleChange(e)}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Please input valid price.
                                                </Form.Control.Feedback>
                                                <B2NormalTextTitle className="text-gray mt-3">
                                                    Tip: Markdown syntax is supported
                                                </B2NormalTextTitle>
                                            </Form.Group>
                                        </Form.Row>
                                    )}
                                </Col>
                                <Col xl="7" lg="6" className="preview-area pt-4">
                                    <BigTitle className="text-black">PREVIEW</BigTitle>
                                    <div className="auction-item p-4">
                                        {/* {loggedInUserInfo && <NftAvatar imagePath={getLoggedInUserAvatar()} className="mb-3 auction-owner-avatar"></NftAvatar>} */}
                                        <div className="token-img-area">
                                            <div className="pre-token-img">
                                                {previewThumbnail ? (
                                                    <img src={previewThumbnail} alt="tokenImage" />
                                                ) : (
                                                    <div className="no-thumbnail"></div>
                                                )}
                                            </div>
                                        </div>

                                        <B1NormalTextTitle className="mt-3">
                                            {collectible.name}
                                        </B1NormalTextTitle>
                                        <NormalTextTitle className="text-black">
                                            {isInstantPrice ? (
                                                <>From {collectible.offer_price} ETH</>
                                            ) : (
                                                collectible.is_auction ? "Put up for sale" : "Not for Sale"
                                            )}
                                        </NormalTextTitle>
                                        <SubDescription className="mt-2"></SubDescription>
                                        <FlexAlignCenterDiv className="mt-2 text-black">
                                            {collectible.is_auction ? (
                                                <NormalTextTitle>
                                                    Bid ~ {collectible.min_bid_price} ETH
                                                </NormalTextTitle>
                                            ) : (
                                                <NormalTextTitle>Buy Now</NormalTextTitle>
                                            )}
                                        </FlexAlignCenterDiv>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <BigTitle className="mt-4 text-black">Choose collection</BigTitle>
                                    <div className="collection-types d-flex mt-4 text-black">
                                        <div
                                            className="choose-collection-item p-4 mr-4 text-center"
                                            onClick={() => {
                                                setShowCollectionDialog(true);
                                            }}
                                        >
                                            <div className="c-nft-avatar add-collection-btn">
                                                <FaPlus></FaPlus>
                                            </div>
                                            <B3NormalTextTitle className="faint-color mt-3">
                                                Create
                                            </B3NormalTextTitle>
                                            <B2NormalTextTitle className="mt-3">
                                                ERC - 721
                                            </B2NormalTextTitle>
                                        </div>
                                        {/* {collectionItems.map((cItem: any, index: number) => {
                                            return (
                                                <ChooseCollectionItem
                                                item={cItem}
                                                key={index}
                                                onSelected={() => {
                                                    setCollectible({
                                                    ...collectible,
                                                    collection: cItem._id,
                                                    });
                                                }}
                                                isSelected={collectible.collection === cItem._id}
                                                />
                                            );
                                            })} */}
                                    </div>
                                    <BigTitle className="mt-4 text-black">Choose categories</BigTitle>
                                    <FlexAlignCenterDiv className="category-list mt-4">
                                        {/* {nftCategories.map((eType, index) => {
                                            return (
                                                eType.value !== "all" && (
                                                <div
                                                    className={getCategoryClass(eType.value)}
                                                    key={index}
                                                    onClick={() => {
                                                    categorySelected(eType.value);
                                                    }}
                                                >
                                                    {eType.label}
                                                </div>
                                                )
                                            );
                                            })} */}
                                    </FlexAlignCenterDiv>
                                    <Row>
                                        <Col xl="5" lg="6">
                                            <Form.Row className="mt-4">
                                                <Form.Group as={Col} md="6">
                                                    <Form.Label>
                                                        <BigTitle className="text-black">Name</BigTitle>
                                                    </Form.Label>
                                                    <Form.Control
                                                        required
                                                        type="text"
                                                        placeholder="name"
                                                        name="name"
                                                        onChange={(e) => handleChange(e)}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        Please input valid name
                                                    </Form.Control.Feedback>
                                                    <B1NormalTextTitle className="mt-2 text-gray">
                                                        Example: Magik 23
                                                    </B1NormalTextTitle>
                                                </Form.Group>
                                                <Form.Group as={Col} md="6">
                                                    <Form.Label>
                                                        <BigTitle className="text-black">Royalties</BigTitle>
                                                    </Form.Label>
                                                    <Form.Control
                                                        required
                                                        type="number"
                                                        placeholder="Royalties"
                                                        name="royalties"
                                                        min="0"
                                                        max="50"
                                                        pattern="^\d+$"
                                                        onChange={(e) => handleChange(e)}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        Royalties should be in range from 0% - 50%.
                                                    </Form.Control.Feedback>
                                                    <B1NormalTextTitle className="mt-2 text-gray">
                                                        Suggested: 10%, 20%, 30%
                                                    </B1NormalTextTitle>
                                                </Form.Group>
                                            </Form.Row>
                                            <Form.Row className="mt-4">
                                                <Form.Group as={Col} md="12">
                                                    <Form.Label>
                                                        <BigTitle className="text-black">Description</BigTitle>
                                                    </Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        placeholder="Description"
                                                        name="description"
                                                        rows={1}
                                                        onChange={(e) => handleChange(e)}
                                                    />
                                                    <B1NormalTextTitle className="mt-2 text-gray">
                                                        With preserved line-breaks
                                                    </B1NormalTextTitle>
                                                </Form.Group>
                                            </Form.Row>
                                            <FlexAlignCenterDiv className="mt-4">
                                                {!isAuth && (
                                                    <div className="mr-4">
                                                        <ConnectWalletBtn />
                                                    </div>
                                                )}
                                                <Button
                                                    className="default-btn-size "
                                                    type="submit"
                                                >
                                                    <span>Create NFT</span>
                                                </Button>
                                            </FlexAlignCenterDiv>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Form>

                        <CreateCollectionModal
                            show={showCollectionDialog}
                            handleClose={() => {
                                setShowCollectionDialog(false);
                            }}
                            createCollection={(e: any) => {
                                createCollection(e);
                            }}
                        ></CreateCollectionModal>
                        {isLoading && <LoadingSpinner></LoadingSpinner>}
                        {createNftDialog && (
                            <CreateNftStatusModal
                                show={createNftDialog}
                                status={createNftStatus}
                                collectible={collectible}
                                onClose={() => {
                                    setCreateNftDialog(false);
                                }}
                                createNft={createNft}
                                approveNft={approveNft}
                                createOffer={createOffer}
                            ></CreateNftStatusModal>
                        )}
                    </Col>
                </Row>
            )}
        </Layout>
    );
};

export default CreateCollectible;
