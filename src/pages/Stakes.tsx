/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Layout from "components/Layout";
import Carousel from "react-bootstrap/Carousel";
import { NotificationManager } from "react-notifications";
import LoadingSpinner from "components/common/LoadingSpinner";
import { NftCreateStatus } from "model/NftCreateStatus";
import StakeNftStatusModal from "components/token/StakeNftStatusModal";
import UnstakeNftStatusModal from "components/token/UnstakeNftStatusModal";
import { toast } from "react-toastify";

import { Button, Image } from "react-bootstrap";

import puml from "assets/imgs/puml2.png";
import stakeImg from "assets/imgs/stake.png";
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
  const [stakePumlxAmount, setStakePumlxAmount] = useState<number>(0);
  const [unstakePumlxAmount, setUnstakePumlxAmount] = useState<number>(0);
  const [collectPumlx, setCollectPumlx] = useState<number>(0);
  const [stakeNftAmount, setStakeNftAmount] = useState<number>(0);
  const [unstakeNftAmount, setUnstakeNftAmount] = useState<number>(0);
  const [stakedNfts, setStakedNfts] = useState<any[]>([]);
  const [unstakedNfts, setUnstakedNfts] = useState<any[]>([]);
  const [stakeNftArr, setStakeNftArr] = useState<any>({});
  const [unstakeNftArr, setUnstakeNftArr] = useState<any>({});

  const [lastUpdateTime, setLastUpdateTime] = useState(0);
  const [lastUpdateTimeNFT, setLastUpdateTimeNFT] = useState(0);
  const [reward, setReward] = useState(0);
  const [lastReward, setLastReward] = useState(0);
  const [collect, setCollect] = useState<number>(0);
  const [lastCollect, setLastCollect] = useState<number>(0);
  const [stakedPumlxBalance, setStakedPumlxBalance] = useState<number>(0);
  const [totalStakedPumlxBalance, setTotalStakedPumlxBalance] =
    useState<number>(0);
  const [stakedNftBalance, setStakedNftBalance] = useState<number>(0);
  const [totalStakedNftBalance, setTotalStakedNftBalance] = useState<number>(0);
  const [compoundingPumlxReward, setCompoudingPumlxReward] = useState(0);
  const [compoundingNftReward, setCompoudingNftReward] = useState(0);

  const [shows, setShows] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [showStatusStakeModal, setShowStatusStakeModal] = useState(false);
  const [showStatusUnstakeModal, setShowStatusUnstakeModal] = useState(false);
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

    const stakeDetailData = async () => {
      const data = await SmartContract.getUserData();
      if (data && data.length > 0) {
        setLastUpdateTime(parseFloat(data.userLastUpdateTime));
        setLastUpdateTimeNFT(parseFloat(data.userLastUpdateTimeNFT));
        setStakedPumlxBalance(parseFloat(data.balances));
        setTotalStakedPumlxBalance(parseFloat(data.totalBalances));
        setStakedNftBalance(parseFloat(data.balancesNFT));
        setTotalStakedNftBalance(parseFloat(data.totalBalancesNFT));
        setReward(parseFloat(data.userReward) / 1e18);
        setLastReward(parseFloat(data.userLastReward) / 1e18);
        setCollect(parseFloat(data.userCollect) / 1e18);
        setLastCollect(parseFloat(data.userLastCollect) / 1e18);
      }
      console.log(data);
    };

    switchNet();
    loadApy();
    loadNft();
    stakeDetailData();
  }, []);

  useEffect(() => {
    const setCompound = async () => {
      const compoundingPumlx = await compound(
        "pumlx",
        stakedPumlxBalance,
        totalStakedPumlxBalance
      );
      const compoundingNft = await compound(
        "nft",
        stakedNftBalance,
        totalStakedNftBalance
      );
      setCompoudingPumlxReward(compoundingPumlx);
      setCompoudingNftReward(compoundingNft);
    };
    setCompound();
  }, [
    lastUpdateTime,
    stakedPumlxBalance,
    stakedNftBalance,
    totalStakedPumlxBalance,
    totalStakedNftBalance
  ]);

  const compound = async (
    token: string,
    amount: number,
    totalAmount: number
  ) => {
    const poolPumlx: any = await SmartContract.balanceOfPuml(
      configs.PUML_POOL_ADDRESS
    );
    console.log("poolPuml", poolPumlx);
    const startRewardPumlx =
      (configs.PUML_ETH_FIRST_POOL / 2372500) * 6500 * 30;
    const rewardPumlxRate =
      startRewardPumlx +
      (configs.PUML_ETH_POOL - parseFloat(poolPumlx.balance) / 1e18);

    const poolNft: any = await SmartContract.balanceOfPuml(
      configs.NFT_POOL_ADDRESS
    );
    console.log("poolNft", poolNft);
    const startRewardNft = (configs.NFT_ETH_FIRST_POOL / 2372500) * 6500 * 30;
    const rewardNftRate =
      startRewardNft +
      (configs.NFT_ETH_POOL - parseFloat(poolNft.balance) / 1e18);

    console.log(rewardPumlxRate);
    console.log(rewardNftRate);

    let collected = 0;

    if (token === "pumlx") {
      if (totalAmount > 0) {
        collected =
          (((((amount / totalAmount) * rewardPumlxRate) / 6500 / 30) * 6500) /
            86400) *
          (new Date().getTime() / 1000 - lastUpdateTime);
      }
    } else {
      if (totalAmount > 0) {
        collected =
          (((((amount / totalAmount) * rewardNftRate) / 6500 / 30) * 6500) /
            86400) *
          (new Date().getTime() / 1000 - lastUpdateTime);
      }
    }

    return collected;
  };

  const loadNft = async () => {
    let nftstaked: any[] = [];
    let nftunstaked: any[] = [];

    const { tokens } = await NftController.getApprovedList();
    for (let token of tokens) {
      if (token.stake) {
        nftstaked.push(token);
      } else {
        nftunstaked.push(token);
      }
    }
    setStakedNfts(nftstaked);
    setUnstakedNfts(nftunstaked);
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
      setStakePumlxAmount(parseFloat(e.target.value));
    }
    if (fieldName === "unstake") {
      setUnstakePumlxAmount(parseFloat(e.target.value));
    }
    if (fieldName === "claims") {
      setCollectPumlx(parseFloat(e.target.value));
    }
  };

  const selectStake = (stake: boolean, nft: any) => {
    let stakearr: any = {};
    let unstakearr: any = {};
    for (let key in stakeNftArr) {
      stakearr[key] = stakeNftArr[key];
    }
    for (let key in unstakeNftArr) {
      unstakearr[key] = unstakeNftArr[key];
    }

    const ikey =
      nft.contract_address !== null && nft.contract_address !== ""
        ? nft.contract_address
        : "0x0";
    switch (stake) {
      case false:
        if (ikey in stakearr) {
          // check if key in stake array
          if (!stakearr[ikey].includes(nft.chain_id)) {
            stakearr[ikey].push(nft.chain_id);
            setStakeNftAmount(stakeNftAmount + 1);
          } else {
            stakearr[ikey] = stakearr[ikey].filter(
              (value: any) => value !== nft.chain_id
            );
            setStakeNftAmount(stakeNftAmount - 1);
          }
        } else {
          stakearr[ikey] = [nft.chain_id];
          setStakeNftAmount(stakeNftAmount + 1);
        }
        setStakeNftArr(stakearr);
        break;
      default:
        if (ikey in unstakearr) {
          // check if key in stake array
          if (!unstakearr[ikey].includes(nft.chain_id)) {
            unstakearr[ikey].push(nft.chain_id);
            setUnstakeNftAmount(unstakeNftAmount + 1);
          } else {
            unstakearr[ikey] = unstakearr[ikey].filter(
              (value: any) => value !== nft.chain_id
            );
            setUnstakeNftAmount(unstakeNftAmount - 1);
          }
        } else {
          unstakearr[ikey] = [nft.chain_id];
          setUnstakeNftAmount(unstakeNftAmount + 1);
        }
        setUnstakeNftArr(unstakearr);
        break;
    }
  };

  const stakeNft = async () => {
    const ids = stakeNftArr;

    try {
      setIsLoading(true);
      let stakeResult: any;
      stakeResult = await SmartContract.stakeNFT(ids);
      if (stakeResult.success) {
        const result = await NftController.stakeToken({
          chainIds: ids,
          stake: true
        });
        if (result.message) {
          setStakeNftArr([]);
          setStakeNftAmount(0);
          setIsLoading(false);
          toast.success("Stake NFTs Successful.");
          NotificationManager.success("Stake NFTs Successful.", "Success");
          loadNft();
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
    } catch (err) {
      toast.warning("Failed");
      NotificationManager.error("Failed Try!", "Error");
      setIsLoading(false);
    }
  };

  const unstakeNft = async () => {
    const ids = unstakeNftArr;

    try {
      setIsLoading(true);
      const unstakeResult = await SmartContract.withdrawNFT(ids);
      if (unstakeResult.success) {
        const result = await NftController.stakeToken({
          chainIds: ids,
          stake: false
        });
        if (result.message) {
          loadNft();
          setUnstakeNftArr([]);
          setIsLoading(false);
          toast.success("Unstake NFTs Successful.");
          NotificationManager.success("Unstake NFTs Successful.", "Success");
        } else {
          console.log(result.error);
          toast.warning("Failed");
          NotificationManager.error("Failed!", "Error");
          setIsLoading(false);
        }
      } else {
        toast.warning("Failed");
        NotificationManager.error("Failed!", "Error");
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      toast.warning("Failed");
      NotificationManager.error("Failed!", "Error");
    }
  };

  const stakePumlx = async () => {
    if (stakePumlxAmount > 1000) {
      toast.warning("Max stake value is 1000");
      return;
    }
    try {
      const { user } = await UserController.userStats(EthUtil.getAddress());
      const pumlxApproved = user && user.pumlxApproved ? 1 : 0;

      setIsLoading(true);
      const transferResult = await SmartContract.stakePuml(
        stakePumlxAmount,
        pumlxApproved
      );
      if (transferResult.success && transferResult.transactionHash) {
        setStakePumlxAmount(0);
        const result = await UserController.pumlxApproved(EthUtil.getAddress());
        console.log(result);
        toast.success("Stake Successful.");
        NotificationManager.success("Stake Successful.", "Success");
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
    try {
      setIsLoading(true);
      if (unstakePumlxAmount > stakedPumlxBalance) {
        toast.warning("Insufficient staked");
        NotificationManager.error("Insufficient staked", "Error");
        setIsLoading(false);
        return;
      }

      const claimAmount = await compound(
        "pumlx",
        unstakePumlxAmount,
        totalStakedPumlxBalance
      );

      const unstakeResult = await SmartContract.withdrawPuml(
        unstakePumlxAmount,
        claimAmount
      );
      if (unstakeResult.success && unstakeResult.transactionHash) {
        setUnstakePumlxAmount(0);
        toast.success("Unstake Successful.");
        NotificationManager.success("Unstake Successful.", "Success");
        setIsLoading(false);
      } else {
        toast.warning("Failed!");
        NotificationManager.error("Failed!", "Error");
        setIsLoading(false);
      }
    } catch (err) {
      toast.warning("Failed!");
      NotificationManager.error("Failed!", "Error");
      setIsLoading(false);
    }
  };

  const collectNftReward = async () => {
    try {
      setIsLoading(true);
      if (collectPumlx > compoundingNftReward) {
        toast.success("Insufficient compounding reward amount");
      }
      const collectResult = await SmartContract.collectNftReward(collectPumlx);
      if (collectResult.success && collectResult.transactionHash) {
        setCollectPumlx(0);
        toast.success("Collect Successful.");
        NotificationManager.success("Collect Successful.", "Success");
        setIsLoading(false);
      } else {
        toast.warning("Failed!");
        NotificationManager.error("Failed!", "Error");
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

      <div className="section-intro">
        <div className="intro-content text-left">
          <div className="intro-content__content">
            <p className="intro-title pb-0">Stake PUMLx & earn up to </p>
            <p className="intro-type">{apy} APY</p>
            <div className="intro-connect-btnGroup pt-4">
              <div className="intro-btn-wallet pb-3">
                <a href="https://pumlx.com" className="mr-2 mr-lg-4 buy-pumlx">
                  Buy $PUMLx
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="intro-ticket">
          <div className="blur-bg"></div>
          <Image className="ticket-img" src={stakeImg} alt="ticket" />
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
          <div className="item-price mt-3">
            {(compoundingPumlxReward + compoundingNftReward).toFixed(3)} PUMLX
          </div>
          <div className="item-desc mt-3">
            Trading fees collected by our protocol are rewarded to PUMLx stakers
          </div>
        </div>
        <div className="stakes__contain">
          <div className="valupap">
            <div className="valupap__key">
              Rewards are calculated from the number staked NFTs
            </div>
          </div>
          <div className="inp">
            <div className="inp__input inp__input--prex col-md-8">
              <img className="mr-3" src={puml1} width={42} alt="ethIcon" />
              <input
                type="number"
                name="claims"
                value={collectPumlx}
                onChange={(e) => handleChange(e)}
              />
              <span className="ml-2">PUMLx</span>
              <i className="ml-3">(${getDollarPrice(collectPumlx)})</i>
            </div>
            <div className="inp__btn col-md-4 mt-1">
              <button
                disabled={collectPumlx === 0 ? true : false}
                className="btn btn-primary"
                onClick={collectNftReward}
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
                {lastCollect.toFixed(3)} <b>PUMLx</b>
              </span>
              <i>(${getDollarPrice(lastCollect)})</i>
            </div>
          </div>
          <div className="valupap">
            <div className="valupap__key">Collected to date:</div>
            <div className="valupap__val">
              <span>
                {collect.toFixed(3)} <b>PUMLx</b>
              </span>
              <i>(${getDollarPrice(collect)})</i>
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
                {compoundingNftReward.toFixed(3)} <b>PUMLx</b>
              </span>
              <i>(${getDollarPrice(compoundingNftReward)})</i>
            </div>
          </div>
        </div>
      </div>
      <div className="stakes">
        <div className="stakes__title mb-2">
          <div className="item-title">Stake PUMLx</div>
        </div>
        <div className="valupap">
          <div className="valupap__key">
            Rewards are calculated from the number staked PUMLx
          </div>
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
                    value={stakePumlxAmount}
                    placeholder="Enter Quantity"
                    onChange={(e) => handleChange(e)}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setStakePumlxAmount(1000);
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
                    value={unstakePumlxAmount}
                    placeholder="Enter Quantity"
                    onChange={(e) => handleChange(e)}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setUnstakePumlxAmount(stakedPumlxBalance);
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
                  disabled={stakePumlxAmount === 0 ? true : false}
                  className="btn btn-primary"
                  onClick={stakePumlx}
                >
                  <div className="d-flex flex-row align-items-center">
                    <span>Stake</span>
                  </div>
                </button>
              ) : (
                <button
                  disabled={unstakePumlxAmount === 0 ? true : false}
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
            <div className="valupap__key">Staked pumlx:</div>
            <div className="valupap__val">
              <span>
                {stakedPumlxBalance} <b>PUMLx</b>
              </span>
            </div>
          </div>
          <div className="valupap">
            <div className="valupap__key">Last reward:</div>
            <div className="valupap__val">
              <span>
                {lastReward.toFixed(3)} <b>PUMLx</b>
              </span>
            </div>
          </div>
          <div className="valupap">
            <div className="valupap__key">Reward to date:</div>
            <div className="valupap__val">
              <span>
                {reward.toFixed(3)} <b>PUMLx</b>
              </span>
              <i>(${getDollarPrice(reward)})</i>
            </div>
          </div>
          <div className="valupap">
            <div className="valupap__key">Your stake compounding:</div>
            <div className="valupap__val">
              <span>
                {compoundingPumlxReward.toFixed(3)} <b>PUMLx</b>
              </span>
              <i>(${getDollarPrice(compoundingPumlxReward)})</i>
            </div>
          </div>
        </div>
      </div>
      <div className="stakes">
        <div className="stakes__title">
          <div className="item-title">Staked NFT’s ({stakedNftBalance})</div>
        </div>
        {stakedNfts && stakedNfts.length > 0 ? (
          <>
            <Carousel interval={null} className="w-100">
              {getGroup(stakedNfts) &&
                getGroup(stakedNfts).length > 0 &&
                getGroup(stakedNfts).map((group, idx) => (
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
                              unstakeNftArr[nft.contract_address] &&
                              unstakeNftArr[nft.contract_address].includes(
                                nft.chain_id
                              )) ||
                            (unstakeNftArr["0x0"] &&
                              unstakeNftArr["0x0"].includes(nft.chain_id))
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
            {unstakeNftAmount > 0 && (
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
            Unstaked NFT’s ({unstakedNfts.length})
          </div>
        </div>
        {unstakedNfts && unstakedNfts.length > 0 ? (
          <>
            <Carousel interval={null} className="w-100">
              {getGroup(unstakedNfts) &&
                getGroup(unstakedNfts).length > 0 &&
                getGroup(unstakedNfts).map((group, idx) => (
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
                              stakeNftArr[nft.contract_address] &&
                              stakeNftArr[nft.contract_address].includes(
                                nft.chain_id
                              )) ||
                            (stakeNftArr["0x0"] &&
                              stakeNftArr["0x0"].includes(nft.chain_id))
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
            {stakeNftAmount > 0 && (
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
    </Layout>
  );
};

export default Stakes;
