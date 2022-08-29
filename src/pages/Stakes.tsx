/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Layout from "components/Layout";
import Carousel from "react-bootstrap/Carousel";
import { NotificationManager } from "react-notifications";
import LoadingSpinner from "components/common/LoadingSpinner";
import { NftCreateStatus } from "model/NftCreateStatus";
import StakeNftStatusModal from "components/token/StakeNftStatusModal";
import { toast } from "react-toastify";

import { Button, Image } from "react-bootstrap";

import puml from "assets/imgs/puml2.png";
import puml1 from "assets/imgs/puml1.png";
import maskIcon from "assets/imgs/mask.png";
import nostakeIcon from "assets/imgs/nostake.png";

import NftController from "controller/NftController";
import UserController from "controller/UserController";
import SmartContract from "ethereum/Contract";

import { switchNetwork } from "store/User/user.slice";
import EthUtil from "ethereum/EthUtil";
import configs from "configs";

import { useAppSelector } from "store/hooks";
import { getWalletPumlx } from "store/User/user.selector";

interface StakeProps {}

const Stakes: React.FC<StakeProps> = () => {
  const [stakeTab, setStakeTab] = useState("stake");
  const [stake, setStake] = useState<number>(0);
  const [unstake, setUnstake] = useState<number>(0);
  const [claims, setClaims] = useState<number>(0);
  const [shows, setShows] = useState(5);
  const [nftunstaked, setNftunstaked] = useState<any[]>([]);
  const [nftstaked, setNftstaked] = useState<any[]>([]);
  const [stakeArr, setStakeArr] = useState<any>({});
  const [unstakeArr, setUnstakeArr] = useState<any>({});
  const [stakeAmount, setStakeAmount] = useState<number>(0);
  const [unstakeAmount, setUnstakeAmount] = useState<number>(0);
  const [collect, setCollect] = useState<number>(0);
  const [feeCollect, setFeeCollect] = useState<number>(0);
  const [lastCollect, setLastCollect] = useState<number>(0);
  const [collectSum, setCollectSum] = useState<number>(0);
  const [claimCollect, setClaimCollect] = useState<number>(0);
  const [stakeValue, setStakeValue] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [resellNftStatus, setResellNftStatus] = useState(NftCreateStatus.NONE);
  const [apy, setApy] = useState(0);

  const pumlx = useAppSelector(getWalletPumlx);

  const getWidth = () =>
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  let [width, setWidth] = useState(getWidth());

  useEffect(() => {
    let timeoutId: any = null;
    const resizeListener = () => {
      // prevent execution of previous setTimeout
      clearTimeout(timeoutId);
      // change width from the state object after 150 milliseconds
      timeoutId = setTimeout(() => setWidth(getWidth()), 150);
    };
    // set resize listener
    window.addEventListener("resize", resizeListener);

    // clean up function
    return () => {
      // remove resize listener
      window.removeEventListener("resize", resizeListener);
    };
  }, []);

  useEffect(() => {
    const switchNet = async () => {
      const networkID = EthUtil.getNetwork();
      if (networkID !== configs.ONBOARD_NETWORK_ID) {
        await switchNetwork(configs.ONBOARD_NETWORK_ID);
        window.location.reload();
      }
    };
    switchNet();
    loadApy();
    loadNft();
  }, []);

  const loadNft = async () => {
    let nftstaked: any[] = [];
    let nftunstaked: any[] = [];

    const { tokens } = await NftController.getApprovedList();
    for (let token of tokens) {
      if (token.stake !== null) {
        if (token.stake) {
          nftstaked.push(token);
        } else {
          nftunstaked.push(token);
        }
      }
    }
    setNftstaked(nftstaked);
    setNftunstaked(nftunstaked);
    stakeData();
  };

  const loadApy = async () => {
    const { apy } = await UserController.getApy();
    if (apy) setApy(apy);
  };

  useEffect(() => {
    if (width > 1600) {
      setShows(5);
    }
    if (width < 1600) {
      setShows(4);
    }
    if (width < 1400) {
      setShows(3);
    }
    if (width < 1064) {
      setShows(2);
    }
    if (width < 670) {
      setShows(1);
    }
  }, [width]);

  const getGroup = (nfts: any) => {
    if (nfts && nfts.length > 0) {
      let groups = [];
      var i = 0;
      while (i < nfts.length) {
        groups.push(nfts.slice(i, (i += shows)));
      }
      return groups;
    }
    return [];
  };

  const getDollarPrice = (value: any) => {
    let dollarPrice: any = 0;
    if (value) {
      dollarPrice = (value * 0.05).toFixed(2);
    }
    return dollarPrice;
  };

  const handleChange = (e: any) => {
    if (e.target.value < 0) return;
    let fieldName = e.target.name;
    if (fieldName === "stake") {
      setStake(parseFloat(e.target.value));
    }
    if (fieldName === "unstake") {
      setUnstake(parseFloat(e.target.value));
    }
    if (fieldName === "claims") {
      setClaims(parseFloat(e.target.value));
    }
  };

  const selectStake = (stake: boolean, nft: any) => {
    let stakearr: any = {};
    let unstakearr: any = {};
    for (let key in stakeArr) {
      stakearr[key] = stakeArr[key];
    }
    for (let key in unstakeArr) {
      unstakearr[key] = unstakeArr[key];
    }

    const ikey =
      nft.contract_address !== null && nft.contract_address !== ""
        ? nft.contract_address
        : "0x0";
    switch (stake) {
      case true:
        if (ikey in stakearr) {
          // check if key in stake array
          if (!stakearr[ikey].includes(nft.chain_id)) {
            stakearr[ikey].push(nft.chain_id);
            setStakeAmount(stakeAmount + 1);
          } else {
            stakearr[ikey] = stakearr[ikey].filter(
              (value: any) => value !== nft.chain_id
            );
            setStakeAmount(stakeAmount - 1);
          }
        } else {
          stakearr[ikey] = [nft.chain_id];
          setStakeAmount(stakeAmount + 1);
        }
        setStakeArr(stakearr);
        break;
      default:
        if (ikey in unstakearr) {
          // check if key in stake array
          if (!unstakearr[ikey].includes(nft.chain_id)) {
            unstakearr[ikey].push(nft.chain_id);
            setUnstakeAmount(unstakeAmount + 1);
          } else {
            unstakearr[ikey] = unstakearr[ikey].filter(
              (value: any) => value !== nft.chain_id
            );
            setUnstakeAmount(unstakeAmount - 1);
          }
        } else {
          unstakearr[ikey] = [nft.chain_id];
          setUnstakeAmount(unstakeAmount + 1);
        }
        setUnstakeArr(unstakearr);
        break;
    }
  };

  const stakeNft = async () => {
    const ids = unstakeArr;

    try {
      setIsLoading(true);
      let stakeResult: any;
      stakeResult = await SmartContract.stakeNFT(ids, feeCollect);
      if (stakeResult.success) {
        const result = await NftController.stakeToken({
          chainIds: ids,
          stake: true
        });
        if (result.message) {
          loadNft();
          setUnstakeArr([]);
          setIsLoading(false);
          toast.success("Successfully done.");
          NotificationManager.success("Successfully done.", "Success");
        } else {
          setIsLoading(false);
          console.log(result.error);
          toast.warning("Failed");
          NotificationManager.error("Failed!", "Error");
        }
      } else {
        setIsLoading(false);
        toast.warning("Failed");
        NotificationManager.error("Failed!", "Error");
      }
      setIsLoading(false);
    } catch (err) {
      toast.warning("Failed");
      NotificationManager.error("Failed Try!", "Error");
      setIsLoading(false);
    }
  };

  const approveNft = async () => {
    const ids = stakeArr;
    try {
      setResellNftStatus(NftCreateStatus.CREATEOFFER_PROGRESSING);
      let approveResult: any;
      approveResult = await SmartContract.approveStakeNFT(ids);

      if (approveResult.success) {
        const result = await NftController.stakeToken({
          chainIds: ids,
          stake: false
        });
        if (result.message) {
          loadNft();
          setStakeArr([]);
          setResellNftStatus(NftCreateStatus.CREATEOFFER_SUCCEED);
          toast.success("Successfully approved NFTs.");
          NotificationManager.success("Successfully approved NFTs.", "Success");
          setShowStatusModal(false);
        } else {
          console.log(result.error);
          toast.warning("Failed");
          NotificationManager.error("Failed!", "Error");
          setResellNftStatus(NftCreateStatus.CREATEOFFER_FAILED);
        }
      } else {
        console.log(approveResult.error);
        setResellNftStatus(NftCreateStatus.CREATEOFFER_FAILED);
      }
    } catch (err) {
      toast.warning("Failed");
      NotificationManager.error("Failed!", "Error");
    }
  };

  const unstakeNft = async () => {
    const ids = stakeArr;

    try {
      setShowStatusModal(true);
      setResellNftStatus(NftCreateStatus.APPROVE_PROGRESSING);

      const approveResult = await NftController.approveToken({
        chainIds: ids
      });
      if (approveResult.success) {
        let stakeResult: any;
        stakeResult = await SmartContract.withdrawNFT(ids, feeCollect);
        if (stakeResult.success) {
          await NftController.stakeToken({
            chainIds: ids,
            stake: null
          });
          loadNft();
          toast.success("Successfully unstake NFTs.");
          NotificationManager.success("Successfully unstake NFTs.", "Success");
          setResellNftStatus(NftCreateStatus.APPROVE_SUCCEED);
        } else {
          toast.warning("Failed");
          NotificationManager.error("Failed!", "Error");
          setResellNftStatus(NftCreateStatus.APPROVE_FAILED);
        }
      } else {
        console.log(approveResult.error);
        toast.warning("Failed");
        NotificationManager.error("Failed!", "Error");
        setResellNftStatus(NftCreateStatus.APPROVE_FAILED);
      }
    } catch (err) {
      setShowStatusModal(false);
      toast.warning("Failed");
      NotificationManager.error("Failed!", "Error");
    }
  };

  const stakePumlx = async () => {
    if (stake === 0) return;

    try {
      setIsLoading(true);

      // const transferResult = await SmartContract.transferToken(configs.MAIN_ACCOUNT, stake);
      const transferResult = await SmartContract.stakePuml(stake, feeCollect);
      if (transferResult.success && transferResult.transactionHash) {
        // const stakeResult = await NftController.stakePuml(
        //   {
        //     amount: stake,
        //     collect: collect,
        //     feeward: feeCollect,
        //     staker: EthUtil.getAddress()
        //   });
        // if (stakeResult.success && stakeResult.transactionHash) {
        setStake(0);
        stakeData();
        toast.success("Successfully staken.");
        NotificationManager.success("Successfully staken.", "Success");
        // } else {
        //   toast.warning("Failed");
        //   NotificationManager.error("Failed!", "Error");
        // }
      } else {
        toast.warning("Failed");
        NotificationManager.error("Failed!", "Error");
      }
      setIsLoading(false);
    } catch (err) {
      toast.warning("Failed");
      NotificationManager.error("Failed!", "Error");
      setIsLoading(false);
    }
  };

  const unstakePumlx = async () => {
    if (unstake === 0) return;
    try {
      setIsLoading(true);
      if (unstake > stakeValue.balances) {
        toast.warning("Insufficient staked");
        NotificationManager.error("Insufficient staked", "Error");
        return;
      }

      // const transferResult = await NftController.unstakePuml({
      //   amount: unstake,
      //   staker: EthUtil.getAddress()
      // });
      // if (transferResult.success && transferResult.transactionHash) {
      const unstakeResult = await SmartContract.withdrawPuml(
        unstake,
        feeCollect
      );
      if (unstakeResult.success && unstakeResult.transactionHash) {
        setUnstake(0);
        stakeData();
        toast.success("Successfully unstaken.");
        NotificationManager.success("Successfully unstaken.", "Success");
        setIsLoading(false);
      } else {
        toast.warning("Failed!");
        NotificationManager.error("Failed!", "Error");
        setIsLoading(false);
      }
      // } else {
      //   toast.warning("Failed!");
      //   NotificationManager.error("Failed!", "Error");
      //   setIsLoading(false);
      // }
    } catch (err) {
      toast.warning("Failed!");
      NotificationManager.error("Failed!", "Error");
      setIsLoading(false);
    }
  };

  const stakeData = async () => {
    const data = await SmartContract.getUserData();
    if (data && data.length > 0) {
      setStakeValue(data);
    }
  };

  useEffect(() => {
    const getCollect = async () => {
      if (stakeValue && Object.keys(stakeValue).length > 0) {
        console.log(stakeValue);
        if (stakeValue.userLastUpdateTime === 0) return;

        const { tradingFee } = await NftController.getPumlTradingFee({
          user: EthUtil.getAddress(),
          startTime: stakeValue.userLastUpdateTime
        });
        setFeeCollect(tradingFee);
        setLastCollect(stakeValue.userLastCollect);
        const collected = await SmartContract.collectStored(tradingFee);
        setClaimCollect(collected / 1e18);
        setCollectSum((collected + stakeValue.userRewardStored) / 1e18);
      }
    };
    getCollect();
  }, [stakeValue]);

  const rewardCollect = async () => {
    if (claims === 0) return;

    if (claims > claimCollect) {
      toast.warning("Please collect less than Claim Rewards");
      NotificationManager.error(
        "Please collect less than Claim Rewards",
        "Error"
      );
      setClaims(0);
      return;
    }

    setIsLoading(true);
    try {
      const transResult = await SmartContract.collect(claims, feeCollect);
      if (transResult.success && transResult.transactionHash) {
        // const result = await NftController.pumlFeeCollect({
        //   collects: claims
        // });
        // if (result.success) {
        //   toast.success("Successfully collected.");
        //   NotificationManager.success("Successfully collected.", "Success");
        //   setClaims(0);
        //   stakeData();
        //   setIsLoading(false);
        // } else {
        //   toast.warning("Claim Collect Failed!");
        //   NotificationManager.error("Claim Collect Failed!", "Error");
        //   setIsLoading(false);
        // }
        toast.success("Successfully collected.");
        NotificationManager.success("Successfully collected.", "Success");
        setClaims(0);
        stakeData();
        setIsLoading(false);
      } else {
        toast.warning("Claim Collect Failed!");
        NotificationManager.error("Claim Collect Failed!", "Error");
        setIsLoading(false);
      }
    } catch (err) {
      toast.warning("Failed!");
      NotificationManager.error("Failed!", "Error");
      setIsLoading(false);
    }
  };

  return (
    <Layout className="stake-container">
      {isLoading && <LoadingSpinner></LoadingSpinner>}
      <StakeNftStatusModal
        show={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
        }}
        status={resellNftStatus}
        approveNft={approveNft}
        unstakeNft={unstakeNft}
      ></StakeNftStatusModal>
      <div className="section-intro">
        <div className="intro-content text-left">
          <p className="intro-title pb-0">Stake PUMLx & earn up to </p>
          <p className="intro-type">{apy} APY</p>
          <div className="intro-connect-btnGroup pt-4">
            <div className="intro-btn-wallet pb-3">
              <Button className="mr-2 mr-lg-4 btn-primary">
                <div className="d-flex flex-row align-items-center">
                  <span>Buy PUMLx</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
        <div className="intro-image"></div>
        <div className="intro-ticket">
          <Image className="ticket-img" src={puml} alt="ticket"></Image>
        </div>
      </div>
      <div className="stake-intro d-flex">
        <div>
          <Image className="stake-intro__img" src={maskIcon} alt="mask"></Image>
        </div>
        <div className="stake-intro__desc">
          <div className="stake-sen">
            <div className="stake-sen__title">
              Stake your PUMLx to earn rewards.
            </div>
            <div className="stake-sen__subtitle">
              How does staking PUMLx work?
            </div>
            <div className="stake-sen__description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Blandit
              est ac nulla faucibus proin nisl augue. Vestibulum sem scelerisque
              suspendisse praesent pretium non. At mattis bibendum ut sed
              praesent. Nam at id elementum gravida.Lorem ipsum dolor sit amet,
              consectetur adipiscing elit. Blandit est ac nulla faucibus proin
              nisl augue. Vestibulum sem scelerisque suspendisse praesent
              pretium non. At mattis bibendum ut sed praesent. Nam at id
              elementum gravida.
            </div>
          </div>
        </div>
      </div>
      <div className="stakes">
        <div className="stakes__title">
          <div className="item-title">Claim Rewards</div>
          <div className="item-price mt-3">{claimCollect.toFixed(5)} PUMLX</div>
          <div className="item-desc mt-3">
            Trading fees collected by our protocol are rewarded to PUMLx stakers
          </div>
        </div>
        <div className="stakes__contain">
          <div className="valupap">
            <div className="valupap__key">
              Rewards are calculated from the number staked PUMLX + staked NFT’s
              + Trading Fees
            </div>
          </div>
          <div className="inp">
            <div className="inp__input inp__input--prex col-md-8">
              <img className="mr-3" src={puml1} width={42} alt="ethIcon" />
              <input
                type="number"
                name="claims"
                value={claims}
                onChange={(e) => handleChange(e)}
              />
              <span className="ml-2">PUMLx</span>
              <i className="ml-3">(${getDollarPrice(claims)})</i>
            </div>
            <div className="inp__btn col-md-4 mt-1">
              <button
                disabled={claims === 0 ? true : false}
                className="btn btn-primary"
                onClick={rewardCollect}
              >
                <div className="d-flex flex-row align-items-center">
                  <span>Collect</span>
                </div>
              </button>
            </div>
          </div>
          <div className="valupap">
            <div className="valupap__key">Last collected</div>
            <div className="valupap__val">
              <span>
                {lastCollect} <b>PUMLx</b>
              </span>
              <i>(${getDollarPrice(lastCollect)})</i>
            </div>
          </div>
          <div className="valupap">
            <div className="valupap__key">Collected to date:</div>
            <div className="valupap__val">
              <span>
                {collectSum.toFixed(2)} <b>PUMLx</b>
              </span>
              <i>(${getDollarPrice(collectSum)})</i>
            </div>
          </div>
          <div className="devided"></div>
          <div className="valupap">
            <div className="valupap__key">
              PUMLx rewards are automatically compounded.
            </div>
          </div>
          <div className="valupap">
            <div className="valupap__key">
              <Image src={puml1} width={56} className="mr-2" />
              PUMLx
            </div>
            <div className="valupap__val valupap__val--gray">Compounding</div>
          </div>
          <div className="valupap">
            <div className="valupap__key">Earned to date:</div>
            <div className="valupap__val">
              <span>
                {stakeValue?.userRewardPaid / 1e18 || 0} <b>PUMLx</b>
              </span>
              <i>(${getDollarPrice(stakeValue?.userRewardPaid / 1e18 || 0)})</i>
            </div>
          </div>
        </div>
      </div>
      <div className="stakes">
        <div className="stakes__title">
          <div className="item-title">Stake PUMLx</div>
        </div>
        <div className="stakes__contain">
          <div className="tab">
            <div
              className={`tab__item ${
                stakeTab === "stake" ? "tab__item--active" : ""
              }`}
              onClick={() => setStakeTab("stake")}
            >
              Stake
            </div>
            <div
              className={`tab__item ${
                stakeTab === "unstake" ? "tab__item--active" : ""
              }`}
              onClick={() => setStakeTab("unstake")}
            >
              Unstake
            </div>
          </div>
          <div className="inp">
            <div className="inp__input col-md-8">
              {stakeTab === "stake" ? (
                <>
                  <input
                    type="number"
                    name="stake"
                    value={stake}
                    placeholder="Enter Quantity"
                    onChange={(e) => handleChange(e)}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setStake(pumlx);
                    }}
                  >
                    <div className="d-flex flex-row align-items-center">
                      <span>Max</span>
                    </div>
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="number"
                    name="unstake"
                    value={unstake}
                    placeholder="Enter Quantity"
                    onChange={(e) => handleChange(e)}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setUnstake(stakeValue?.balances || 0);
                    }}
                  >
                    <div className="d-flex flex-row align-items-center">
                      <span>Max</span>
                    </div>
                  </button>
                </>
              )}
            </div>
            <div className="inp__btn col-md-4 mt-1">
              {stakeTab === "stake" ? (
                <button
                  disabled={stake === 0 ? true : false}
                  className="btn btn-primary"
                  onClick={stakePumlx}
                >
                  <div className="d-flex flex-row align-items-center">
                    <span>Stake</span>
                  </div>
                </button>
              ) : (
                <button
                  disabled={unstake === 0 ? true : false}
                  className="btn btn-primary"
                  onClick={unstakePumlx}
                >
                  <div className="d-flex flex-row align-items-center">
                    <span>Unstake</span>
                  </div>
                </button>
              )}
            </div>
          </div>
          <div className="valupap">
            <div className="valupap__key">PUMLx in wallet:</div>
            <div className="valupap__val">
              <span>
                {pumlx} <b>PUMLx</b>
              </span>
            </div>
          </div>
          <div className="valupap">
            <div className="valupap__key">Your stake compounding:</div>
            <div className="valupap__val">
              <span>
                {stakeValue?.balances || 0} <b>PUMLx</b>
              </span>
              <i>(${getDollarPrice(stakeValue?.balances || 0)})</i>
            </div>
          </div>
        </div>
      </div>
      <div className="stakes">
        <div className="stakes__title">
          <div className="item-title">Staked NFT’s ({nftstaked.length})</div>
          <div className="item-desc mt-3">Stake NFT’s to earn PUMLx</div>
        </div>
        {nftstaked && nftstaked.length > 0 ? (
          <>
            <Carousel interval={null} className="w-100">
              {getGroup(nftstaked) &&
                getGroup(nftstaked).length > 0 &&
                getGroup(nftstaked).map((group, idx) => (
                  <Carousel.Item key={idx}>
                    <div className="w-100 d-flex">
                      {group.map((nft: any, index: number) => (
                        <div
                          className="myitem-card text-center p-2"
                          key={index}
                          style={{ width: `${100 / shows}%` }}
                          onClick={() => selectStake(true, nft)}
                        >
                          <div
                            className={`slide__item 
                          ${
                            (nft.contract_address !== null &&
                              nft.contract_address !== "" &&
                              stakeArr[nft.contract_address] &&
                              stakeArr[nft.contract_address].includes(
                                nft.chain_id
                              )) ||
                            (stakeArr["0x0"] &&
                              stakeArr["0x0"].includes(nft.chain_id))
                              ? "slide__item--active"
                              : ""
                          }`}
                          >
                            <div
                              style={{ backgroundImage: `url(${nft.media})` }}
                              className="card-image"
                            ></div>
                            <div className="card-info pt-3 pb-4">
                              <div className="card-title">{nft.name}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Carousel.Item>
                ))}
            </Carousel>
            {stakeAmount > 0 && (
              <button className="btn btn-primary" onClick={() => unstakeNft()}>
                <div className="d-flex flex-row align-items-center">
                  <span>Unstake</span>
                </div>
              </button>
            )}
          </>
        ) : (
          <div className="stakes__noitem mt-3">
            <Image src={nostakeIcon} />
            <div className="stakes__normal p-3">You have no staked NFT’s</div>
          </div>
        )}
      </div>
      <div className="stakes">
        <div className="stakes__title">
          <div className="item-title">
            Unstaked NFT’s ({nftunstaked.length})
          </div>
          <div className="item-desc mt-3">Earning 10 PUMLx per day</div>
        </div>
        {nftunstaked && nftunstaked.length > 0 ? (
          <>
            <Carousel interval={null} className="w-100">
              {getGroup(nftunstaked) &&
                getGroup(nftunstaked).length > 0 &&
                getGroup(nftunstaked).map((group, idx) => (
                  <Carousel.Item key={idx}>
                    <div className="w-100 d-flex">
                      {group.map((nft: any, index: number) => (
                        <div
                          className="myitem-card text-center p-2"
                          key={index}
                          style={{ width: `${100 / shows}%` }}
                          onClick={() => selectStake(false, nft)}
                        >
                          <div
                            className={`slide__item 
                          ${
                            (nft.contract_address !== null &&
                              nft.contract_address !== "" &&
                              unstakeArr[nft.contract_address] &&
                              unstakeArr[nft.contract_address].includes(
                                nft.chain_id
                              )) ||
                            (unstakeArr["0x0"] &&
                              unstakeArr["0x0"].includes(nft.chain_id))
                              ? "slide__item--active"
                              : ""
                          }`}
                          >
                            <div
                              style={{ backgroundImage: `url(${nft.media})` }}
                              className="card-image"
                            ></div>
                            <div className="card-info pt-3 pb-4">
                              <div className="card-title">{nft.name}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Carousel.Item>
                ))}
            </Carousel>
            {unstakeAmount > 0 && (
              <button className="btn btn-primary" onClick={() => stakeNft()}>
                <div className="d-flex flex-row align-items-center">
                  <span>Stake</span>
                </div>
              </button>
            )}
          </>
        ) : (
          <div className="stakes__noitem mt-3">
            <Image src={nostakeIcon} />
            <div className="stakes__normal p-3">
              You currently have no NFT’s
            </div>
          </div>
        )}
      </div>
      <div className="stakes">
        <div className="stakes__returnstake py-3">
          <div className="stakes__normal pb-2">Total NFT Stake Return:</div>
          <div className="valupap">
            <span>
              0 <b>PUMLx</b>
            </span>
            <i>(${getDollarPrice(0)})</i>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Stakes;
