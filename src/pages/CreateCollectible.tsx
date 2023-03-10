/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { Button, Col, Container, Form, Row, Image } from "react-bootstrap";
import { NotificationManager } from "react-notifications";
import imgAvatar from "assets/imgs/avatar.png";
import PumlIcon from "assets/imgs/puml.png";
import verifyBadge from "assets/imgs/verify.svg";
import { toast } from "react-toastify";

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
  NftAvatar
} from "components/common/common.styles";
import Layout from "components/Layout";
import { FaPlus, FaTrash } from "react-icons/fa";
import FileUploader from "components/common/uploader/FileUploader";
import { Link } from "react-router-dom";

import ChooseCollectionItem from "components/collection/ChooseCollectionItem";
import CreateCollectionModal from "components/collection/CreateCollectionModal";
import { getMyInfo } from "store/User/user.selector";
import Utility from "service/utility";
import CollectionController from "controller/CollectionController";
import UserController from "controller/UserController";
import LoadingSpinner from "components/common/LoadingSpinner";
import configs from "configs";
import {
  loadMyCollections,
  connectUserWallet,
  getWalletBalance,
  switchNetwork
} from "store/User/user.slice";
import {
  getMyCollections,
  getWalletAddress,
  isAuthenticated
} from "store/User/user.selector";
import ConnectWalletBtn from "components/common/button/ConnectWalletBtn";
import NftController from "controller/NftController";
import SmartContract from "ethereum/Contract";
import DateTimeService from "service/dateTime";
import { getNftCategories, getNftServiceFee } from "store/Nft/nft.selector";
import CreateNftStatusModal from "components/token/CreateNftStatusModal";
import { NftCreateStatus } from "model/NftCreateStatus";
import OfferController from "controller/OfferController";
import EthUtil from "ethereum/EthUtil";

interface propertyInterface {
  trait_type: string;
  value: string;
}

interface CreateCollectibleProps {}

const CreateCollectible: React.FC<CreateCollectibleProps> = () => {
  const dispatch = useAppDispatch();
  const loggedInUserInfo = useAppSelector(getMyInfo);
  const walletAddress = useAppSelector(getWalletAddress);
  const isAuth = useAppSelector(isAuthenticated);
  const [validated, setValidated] = useState(false);
  const serviceFee = useAppSelector(getNftServiceFee);
  const [previewThumbnail, setPreviewThumbnail] = useState<any>(null);
  const [isInstantPrice, setIsInstantPrice] = useState(false);
  const [isNftImage, setIsNftImage] = useState(true);
  const [isSucceed, setIsSucceed] = useState(false);
  const [expiryOption, setExpiryOption] = useState("3");
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  const nftCategories = useAppSelector(getNftCategories);
  const collectionItems = useAppSelector(getMyCollections);
  const [propertyKey, setPropertyKey] = useState("");
  const [propertyValue, setPropertyValue] = useState("");

  const [collectible, setCollectible] = useState<any>({
    name: "",
    description: "",
    media: "",
    media_type: "",
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
    attributes: ""
  });
  const [showCollectionDialog, setShowCollectionDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [createNftStatus, setCreateNftStatus] = useState(NftCreateStatus.NONE);
  const [createNftDialog, setCreateNftDialog] = useState(false);

  const [nftFromDB, setNftFromDB] = useState<any>(null);
  const [approvedNftFromDB, setApprovedNftFromDB] = useState<any>(null);
  const [chainId, setChainId] = useState(null);

  const [propertyList, setPropertyList] = useState<propertyInterface[] | []>(
    []
  );

  const [network, setNetwork] = useState<any>({
    name: "Ethereum",
    value: "ETH",
    key: configs.ONBOARD_NETWORK_ID
  });

  const [contractAddress, setContractAddress] = useState<string>("");

  const expiryDateOptions = [
    {
      value: "1",
      label: "1 Day"
    },
    {
      value: "3",
      label: "3 Days"
    },
    {
      value: "5",
      label: "5 Days"
    },
    {
      value: "7",
      label: "1 Week"
    },
    {
      value: "10",
      label: "10 Days"
    },
    {
      value: "14",
      label: "2 Weeks"
    }
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
  };

  const setNftFile = (file: any) => {
    setCollectible({
      ...collectible,
      media: file ? file.url : "",
      media_type: file ? file.type : ""
    });
    //if (file) {
    //setCollectible({ ...collectible, media: file });
    //if (Utility.isFileImage(file)) {
    //setIsNftImage(true);
    //} else {
    //setIsNftImage(false);
    //}
    //} else {
    //setIsNftImage(true);
    //setCollectible({ ...collectible, media: "" });
    //}
  };

  const setPreview = (e: any) => {
    setPreviewThumbnail(e);
  };

  const instantReceiveAmount = () => {
    if (serviceFee) {
      let remainPer = 100 - serviceFee;
      return (collectible.offer_price * remainPer) / 100;
    }
    return collectible.offer_price;
  };

  const getPureCollectionObj = (collection: any, contract_address: string) => {
    return {
      name: collection.name,
      symbol: collection.symbol,
      description: collection.description,
      short: collection.short,
      image: collection.image,
      network: network.key,
      contract_address: contract_address
    };
  };

  const createCollection = async (collection: any) => {
    const networkID = EthUtil.getNetwork();
    if (networkID !== network.key) {
      await switchNetwork(network.key);
    }

    setIsLoading(true);
    let {
      success,
      contractAddress,
      engineAddress,
      stakeAddress,
      pumlPoolAddress,
      nftPoolAddress
    } = await SmartContract.createCollection(
      collection.name,
      collection.symbol
    );
    // console.log("contractAddress", contractAddress);
    // console.log("engineAddress", engineAddress);
    // console.log("stakeAddress", stakeAddress);
    // console.log("pumlPoolAddress", pumlPoolAddress);
    // console.log("nftPoolAddress", nftPoolAddress);
    if (contractAddress === "") {
      window.location.reload();
    }
    if (success) {
      let formData = Utility.getFormDataFromObject(
        getPureCollectionObj(collection, contractAddress)
      );
      try {
        await CollectionController.create(formData);
        loadCollections();
        setIsLoading(false);
        setShowCollectionDialog(false);
        setContractAddress(contractAddress);
        toast.success("Collection is created successfully.");
        NotificationManager.success(
          "Collection is created successfully.",
          "Success"
        );
      } catch (err) {
        setIsLoading(false);
        console.log(err);
        toast.warning("Create Collection Failed!");
        NotificationManager.error("Create Collection Failed!", "Error");
      }
    }
    window.location.reload();
  };

  const collectionSubmit = async () => {
    if (network.value !== "ETH") return;

    setShowCollectionDialog(true);
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
        toast.warning("No Media File!");
        NotificationManager.error("No Media File!", "Error");
        return;
      }

      if (!selectedCategories.length) {
        toast.warning("Please select at least one category!");
        NotificationManager.error(
          "Please select at least one category!",
          "Error"
        );
        return;
      }
      const networkID = EthUtil.getNetwork();
      if (networkID !== network.key) {
        await switchNetwork(network.key);
        await dispatch(getWalletBalance());
        if (network.value === "PUMLx") {
          await SmartContract.addCustomToken(
            configs.PUML20_ADDRESS,
            "PUML",
            18
          );
        }
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
      media_type: collectible.media_type,
      thumbnail: collectible.thumbnail,
      royalties: collectible.royalties,
      categories: collectible.categories,
      collection: collectible.collection,
      locked: collectible.locked,
      offchain: collectible.offchain,
      attributes: propertyList.length > 0 ? JSON.stringify(propertyList) : "",
      blockchain: network.value
    };
  };

  const createNft = async () => {
    setCreateNftStatus(NftCreateStatus.MINT_PROGRESSING);
    let result: any = nftFromDB;
    if (!result) {
      try {
        let formData = Utility.getFormDataFromObject(getPureNftObj());
        result = await NftController.create(formData);
        setNftFromDB(result);
      } catch (err) {
        setCreateNftStatus(NftCreateStatus.MINT_FAILED);
      }
    }
    if (result && result.link && result.token) {
      const tokenURI = `${configs.DEPLOY_URL}${result.link}`;
      const royalties = result.token.royalties || 0;
      const locked_content = result.token.locked || "";
      try {
        const contractResult = await SmartContract.createNft(
          tokenURI,
          royalties * 100,
          locked_content,
          contractAddress
        );
        if (contractResult.success) {
          dispatch(getWalletBalance());
          setCreateNftStatus(NftCreateStatus.MINT_SUCCEED);
          setChainId(contractResult.tokenId);
          await NftController.setChainId(result.token._id, {
            chain_id: contractResult.tokenId
          });
          if (isPureNftCreation()) {
            setCreateNftDialog(false);
            setIsSucceed(true);
            setTimeout(function () {
              // @ts-ignore
              document.getElementById("layout").scrollTo({
                // @ts-ignore
                top: 0,
                behavior: "smooth"
              });
            }, 200);
          }
        } else {
          setCreateNftStatus(NftCreateStatus.MINT_FAILED);
          const res = await NftController.delete(
            result.token._id,
            loggedInUserInfo._id
          );
          console.log(contractResult.error);
          console.log(res);
        }
      } catch (err) {
        setCreateNftStatus(NftCreateStatus.MINT_FAILED);
      }
    }
  };

  const approveNft = async () => {
    setCreateNftStatus(NftCreateStatus.APPROVE_PROGRESSING);
    let result: any = approvedNftFromDB;
    if (!result) {
      try {
        let approveObj: any = getPureNftObj();
        if (nftFromDB.token && nftFromDB.token._id) {
          approveObj["tokenId"] = nftFromDB.token._id;
          approveObj["chain_id"] = chainId;
          approveObj["contract_address"] = contractAddress;
          approveObj["stake"] = false;
        }
        let formData = Utility.getFormDataFromObject(approveObj);
        result = await NftController.createApprovedNFT(formData);
        setApprovedNftFromDB(result);
      } catch (err) {
        setCreateNftStatus(NftCreateStatus.MINT_FAILED);
      }
    }
    if (result && result.link && result.token) {
      try {
        if (chainId) {
          let contractResult: any = await SmartContract.approve(
            chainId,
            contractAddress
          );
          if (contractResult) {
            dispatch(getWalletBalance());
            setCreateNftStatus(NftCreateStatus.APPROVE_SUCCEED);
            return;
          } else {
            const res = await NftController.deleteApprovedNFT(
              result.token._id,
              loggedInUserInfo._id
            );
            console.log(contractResult.error);
            console.log(res);
          }
        }
      } catch (err) {
        setCreateNftStatus(NftCreateStatus.APPROVE_FAILED);
      }
      setCreateNftStatus(NftCreateStatus.APPROVE_FAILED);
    }
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
          duration,
          network.value,
          contractAddress
        );
        if (result) {
          dispatch(getWalletBalance());
          let offerObj: any = {
            token_id: nftFromDB.token._id,
            expiry_date: collectible.expiry_date
          };

          if (collectible.offer_price > 0)
            offerObj["offer_price"] = collectible.offer_price;
          if (collectible.is_auction)
            offerObj["min_bid"] = collectible.min_bid_price;

          await OfferController.create(offerObj);

          const approvedresult = await UserController.pumlxApproved(
            EthUtil.getAddress()
          );
          console.log(approvedresult);

          setCreateNftStatus(NftCreateStatus.CREATEOFFER_SUCCEED);
          setCreateNftDialog(false);
          setIsSucceed(true);
          setTimeout(function () {
            // @ts-ignore
            document.getElementById("layout").scrollTo({
              // @ts-ignore
              top: 0,
              behavior: "smooth"
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
    if (
      fieldName === "offer_price" ||
      fieldName === "min_bid_price" ||
      fieldName === "royalties"
    ) {
      const regex = /^[0-9]\d*(?:[.]\d*)?$/;
      if (e.target.value !== "" && !regex.test(e.target.value)) {
        e.preventDefault();
        return;
      }
    }

    if (e.target.type === "checkbox") {
      let fieldVal = e.target.checked;
      setCollectible({ ...collectible, [fieldName]: fieldVal });
    } else {
      let fieldVal = e.target.value;
      if (fieldVal.length > 1 && fieldVal[0] === "0" && fieldVal[1] !== ".") {
        fieldVal = fieldVal.substring(1);
      }
      setCollectible({ ...collectible, [fieldName]: fieldVal });
    }
  };

  const isPureNftCreation = () => {
    if (collectible.is_auction || collectible.offer_price > 0) return false;
    return true;
  };

  const loadCollections = () => {
    dispatch(loadMyCollections());
  };

  const chooseCollection = (cItem: any) => {
    setCollectible({
      ...collectible,
      collection: cItem._id
    });
    if (cItem.name !== "PUML" && cItem.contract_address) {
      setContractAddress(cItem.contract_address);
    }
  };

  useEffect(() => {
    loadCollections();
  }, []);

  useEffect(() => {
    setCollectible({
      ...collectible,
      categories: selectedCategories.join("|")
    });
  }, [selectedCategories]);

  const onAddProperty = () => {
    if (!propertyKey || !propertyValue) {
      toast.warning("Please input property key and value!");
      NotificationManager.error(
        "Please input property key and value!",
        "Error"
      );
      return;
    }
    const property = { trait_type: propertyKey, value: propertyValue };
    let proList = [...propertyList];
    proList.push(property);
    setPropertyList(proList);
    setPropertyKey("");
    setPropertyValue("");
  };

  const onRemoveItem = (idx: number) => {
    let list = [];
    if (propertyList.length > 0) {
      for (let i = 0; i < propertyList.length; i++) {
        const property = propertyList[i];
        if (idx !== i) {
          list.push(property);
        }
      }
    }
    setPropertyList(list);
    setCollectible({ ...collectible, attributes: list });
  };

  useEffect(() => {
    let date = DateTimeService.getIsoDateTimeWithDays(parseInt(expiryOption));
    setCollectible({ ...collectible, expiry_date: date });
  }, [expiryOption]);

  const changeBlockchain = (net: any) => {
    setNetwork(net);
  };

  return (
    <Layout className="create-collectible-container">
      <Container className="container">
        {isSucceed ? (
          <Row>
            <Col>
              <MBigTitle className="mt-4 faint-color">
                {" "}
                Congratulations! NFT is successfully created!{" "}
              </MBigTitle>
              <FlexAlignCenterDiv className="mt-5">
                <Link to="/">
                  <Button className="default-btn-size outline-btn mr-3">
                    Home
                  </Button>
                </Link>
                <Link to="/items">
                  <Button className="default-btn-size mr-4 fill-btn">
                    My Items
                  </Button>
                </Link>
              </FlexAlignCenterDiv>
            </Col>
          </Row>
        ) : (
          <Row>
            <Col>
              <MBigTitle className="mt-4">Create collectible</MBigTitle>
              <Form noValidate validated={validated} onSubmit={submitForm}>
                <Row className="mt-4 row-reserve">
                  <Col md="6">
                    <div className="change-blockchain mb-4">
                      <BigTitle className="mt-4 mb-3">Blockchain</BigTitle>
                      <div className="blockchain-list">
                        <div
                          className={`col-3 ${
                            network.name === "Ethereum"
                              ? "blockchain-item selected"
                              : "blockchain-item"
                          }`}
                          onClick={() =>
                            changeBlockchain({
                              name: "Ethereum",
                              value: "ETH",
                              key: configs.ONBOARD_NETWORK_ID
                            })
                          }
                        >
                          <div className="blockchain-icon"></div>
                          <div className="blockchain-name">Ethereum</div>
                        </div>
                        <div
                          className={`col-3 ${
                            network.name === "Polygon"
                              ? "blockchain-item selected"
                              : "blockchain-item"
                          }`}
                          onClick={() =>
                            changeBlockchain({
                              name: "Polygon",
                              value: "MATIC",
                              key: configs.ONBOARD_POLYGON_ID
                            })
                          }
                        >
                          <div className="blockchain-icon"></div>
                          <div className="blockchain-name">Polygon (MATIC)</div>
                        </div>
                        <div
                          className={`col-3 ${
                            network.name === "PUMLx"
                              ? "blockchain-item selected"
                              : "blockchain-item"
                          }`}
                          onClick={() =>
                            changeBlockchain({
                              name: "PUMLx",
                              value: "PUMLx",
                              key: configs.ONBOARD_NETWORK_ID
                            })
                          }
                        >
                          <div className="blockchain-icon">
                            <Image src={PumlIcon} />
                          </div>
                          <div className="blockchain-name">PUMLx</div>
                        </div>
                      </div>
                    </div>
                    <div className="upload-file">
                      <div className="title mb-4">Upload file</div>
                      <FileUploader
                        title="PNG, JPEG, GIF, WEBP, MP4 or MP3. Max 30MB. WIDTH BETWEEN 320 AND 1080PIXELS, WIDTH/HEIGHT BETWEEN 1.91:1 AND 4:5"
                        accept={configs.NFT_FILE_ACCEPT}
                        setFile={(e: any) => setNftFile(e)}
                        setPreview={(e: any) => setPreview(e)}
                      ></FileUploader>
                      {!isNftImage && (
                        <>
                          <BigTitle className="mt-4 mb-4">
                            Upload cover
                          </BigTitle>
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
                      <BigTitle className="">Put up for sale</BigTitle>
                      <Form.Check
                        type="switch"
                        id="put-up-sale-switch"
                        checked={collectible.is_auction}
                        name="is_auction"
                        onChange={(e) => handleChange(e)}
                      />
                    </FlexJustifyBetweenDiv>
                    <B2NormalTextTitle className="grey-color mt-2">
                      You will receive bids for this item.
                    </B2NormalTextTitle>
                    {collectible.is_auction && (
                      <div>
                        <B1NormalTextTitle className=" mt-3">
                          Minimum bid price
                        </B1NormalTextTitle>
                        <Form.Row className="mt-1">
                          <Form.Group as={Col} md="12">
                            <Form.Control
                              required
                              type="text"
                              placeholder={`Enter Minimum Bid in ${network.value}`}
                              name="min_bid_price"
                              value={collectible.min_bid_price || ""}
                              onChange={(e) => handleChange(e)}
                              pattern="^(0|[1-9]\d*)?(\.\d+)?(?<=\d)$"
                              maxLength={7}
                            />
                            <Form.Control.Feedback type="invalid">
                              Please input valid minimum bid price.
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Form.Row>
                        <B1NormalTextTitle className="">
                          Expiry Date
                        </B1NormalTextTitle>
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
                      <BigTitle>Instant Sell Price</BigTitle>
                      <Form.Check
                        type="switch"
                        id="instant-sell-price-switch"
                        checked={isInstantPrice}
                        onChange={(e) => setIsInstantPrice(e.target.checked)}
                      />
                    </FlexJustifyBetweenDiv>
                    <B2NormalTextTitle className="grey-color mt-2">
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
                            value={collectible.offer_price || ""}
                            pattern="^(0|[1-9]\d*)?(\.\d+)?(?<=\d)$"
                            maxLength={10}
                            onChange={(e) => handleChange(e)}
                          />
                          <B2NormalTextTitle className="mt-3">
                            <span className="o-5">Service Fee</span>&nbsp;&nbsp;
                            {serviceFee} %
                          </B2NormalTextTitle>
                          <B2NormalTextTitle className="mt-2">
                            <span className="o-5">You will receive</span>
                            &nbsp;&nbsp;
                            {instantReceiveAmount()
                              ? `${instantReceiveAmount()} ${network.value}`
                              : ""}
                          </B2NormalTextTitle>
                        </Form.Group>
                      </Form.Row>
                    )}
                  </Col>
                  <Col md="6" className="preview-area">
                    <BigTitle className=" pb-3">PREVIEW</BigTitle>
                    <div className="auction-item p-4">
                      {loggedInUserInfo && (
                        <NftAvatar
                          imagePath={getLoggedInUserAvatar()}
                          className="mb-3 auction-owner-avatar"
                        >
                          {loggedInUserInfo.verified && (
                            <Image
                              style={{ width: 12, height: 12 }}
                              src={verifyBadge}
                            />
                          )}
                        </NftAvatar>
                      )}
                      <div className="token-img-area">
                        <div className="pre-token-img">
                          {previewThumbnail ? (
                            <img src={previewThumbnail} alt="tokenImage" />
                          ) : (
                            <div className="no-thumbnail"></div>
                          )}
                        </div>
                      </div>

                      <B1NormalTextTitle className="mt-3 ">
                        {collectible.name}
                      </B1NormalTextTitle>
                      <NormalTextTitle className="">
                        Put up for sale
                      </NormalTextTitle>
                      <SubDescription className="mt-2"></SubDescription>
                      <FlexAlignCenterDiv className="mt-2 ">
                        {collectible.is_auction ? (
                          <NormalTextTitle>
                            Bid ~ {collectible.min_bid_price} {network.value}
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
                    <BigTitle className="mt-4 ">Choose collection</BigTitle>
                    <div className="collection-types d-flex mt-4 ">
                      <div
                        className="choose-collection-item p-4 mr-4 text-center"
                        onClick={() => collectionSubmit()}
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
                      {collectionItems.map((cItem: any, index: number) => {
                        return (
                          ((cItem.network && cItem.network === network.key) ||
                            cItem.name === "PUML") && (
                            <ChooseCollectionItem
                              item={cItem}
                              key={index}
                              onSelected={() => chooseCollection(cItem)}
                              isSelected={collectible.collection === cItem._id}
                            />
                          )
                        );
                      })}
                    </div>
                    <BigTitle className="mt-4 ">Choose categories</BigTitle>
                    <FlexAlignCenterDiv className="category-list mt-4">
                      {nftCategories.map((eType, index) => {
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
                      })}
                    </FlexAlignCenterDiv>
                    <Row>
                      <Col xl="6" lg="8">
                        <Form.Row className="mt-4">
                          <Form.Group as={Col} md="6">
                            <Form.Label>
                              <BigTitle className="">Name</BigTitle>
                            </Form.Label>
                            <Form.Control
                              required
                              type="text"
                              placeholder="Name"
                              name="name"
                              value={collectible.name}
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
                              <BigTitle className="">Royalties</BigTitle>
                            </Form.Label>
                            <Form.Control
                              required
                              type="text"
                              placeholder="Royalties"
                              name="royalties"
                              value={collectible.royalties || ""}
                              min="0"
                              max="50"
                              maxLength={2}
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
                              <BigTitle className="">Description</BigTitle>
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
                        <Form.Row className="mt-4">
                          <Form.Group as={Col} md="12">
                            <Form.Label>
                              <BigTitle className="">Properties</BigTitle>
                            </Form.Label>
                            <div className="property">
                              <div className="property-body row">
                                {propertyList &&
                                  propertyList.length > 0 &&
                                  propertyList.map((it, index) => (
                                    <div
                                      className="flex-fill col-12 col-md-4 pt-2"
                                      key={index}
                                    >
                                      <div className="property-item mb-2">
                                        <div className="field pb-2">
                                          {it["trait_type"]}
                                        </div>
                                        <div className="value">
                                          {it && it["value"]}
                                        </div>
                                        <div
                                          className="trash text-danger"
                                          onClick={() => onRemoveItem(index)}
                                        >
                                          <FaTrash />
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                            <Row>
                              <Col sm="5" className="my-1">
                                <Form.Control
                                  type="text"
                                  placeholder="Key"
                                  name="key"
                                  value={propertyKey}
                                  onChange={(e) =>
                                    setPropertyKey(e.target.value)
                                  }
                                />
                              </Col>
                              <Col sm="5" className="my-1">
                                <Form.Control
                                  type="text"
                                  placeholder="Value"
                                  name="value"
                                  value={propertyValue}
                                  onChange={(e) =>
                                    setPropertyValue(e.target.value)
                                  }
                                />
                              </Col>
                              <Col sm="2" className="text-right my-1">
                                <Button
                                  variant="primary"
                                  onClick={() => onAddProperty()}
                                >
                                  Add
                                </Button>
                              </Col>
                            </Row>
                            {/* {
                                                            propertyList.map((item, index) => (
                                                                <Form.Control
                                                                    key={index}
                                                                    as="textarea"
                                                                    placeholder={item.field}
                                                                    name={item.field}
                                                                    rows={1}
                                                                    onChange={(e) => handleChange(e)}
                                                                    className="mb-2"
                                                                />
                                                            ))
                                                        } */}
                          </Form.Group>
                        </Form.Row>
                        <FlexAlignCenterDiv className="mt-4">
                          {!isAuth && (
                            <div className="mr-4">
                              <ConnectWalletBtn />
                            </div>
                          )}
                          <Button className="default-btn-size " type="submit">
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
      </Container>
    </Layout>
  );
};

export default CreateCollectible;
