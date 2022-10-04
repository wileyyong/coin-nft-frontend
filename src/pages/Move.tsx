/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Layout from "components/Layout";
import Carousel from "react-bootstrap/Carousel";
import LoadingSpinner from "components/common/LoadingSpinner";
import MoveModal from "components/token/MoveModal";
import MoveSuccessModal from "components/token/MoveSuccessModal";
import PumlScanModal from "components/user/PumlScanModal";
import { NotificationManager } from "react-notifications";
import { toast } from "react-toastify";
import { cryptMD5 } from "service/number";
import { Button, Image } from "react-bootstrap";
import { switchNetwork } from "store/User/user.slice";
import EthUtil from "ethereum/EthUtil";
import SmartContract from "ethereum/Contract";
import configs from "configs";
import NftController from "controller/NftController";
import UserController from "controller/UserController";
import { useAppSelector } from "store/hooks";
import {
  getWalletAddress,
  isAuthenticated,
  getMyInfo
} from "store/User/user.selector";
import { setInterval, clearInterval } from "timers";

import puml from "assets/imgs/puml2.png";
import stakeImg from "assets/imgs/stake.png";
import puml1 from "assets/imgs/puml1.png";
import watchIcon from "assets/imgs/watch.png";
import nostakeIcon from "assets/imgs/nostake.png";

interface MoveProps {}

const MoveToEarn = (props: any) => {
  useEffect(() => {
    if (props.isAuth && props.walletAddress) {
      const qrConnect = async () => {
        const connect = await UserController.qrConnect({
          ethAddress: props.walletAddress
        });
        if (connect.success) {
          if (connect.user && connect.user.userId) {
            props.handleGetDailySteps(parseFloat(connect.user.userId));
          }
          props.handleIsConnect(true);
          props.handleLoadNft();
        }
      };
      qrConnect();
      const cons = setInterval(qrConnect, 3000);
      return () => {
        clearInterval(cons);
      };
    }
    props.handleLoadNft();
  }, []);
  return (
    <>
      <p className="intro-type intro-type--italy">Move to Earn</p>
      <p className="intro-title intro-title--bottom">
        Scan the QR code to connect your steps and earn PUMLx.
      </p>
      <div className="intro-btn-wallet intro-btn-wallet--connect">
        {!props.walletAddress && (
          <a href="https://pumlx.com" className="mr-2 mr-lg-4 buy-pumlx">
            Buy $PUMLx
          </a>
        )}
        <Button className="btn-primary" onClick={props.handleConnectPuml}>
          Connect your account
        </Button>
      </div>
    </>
  );
};

const Move: React.FC<MoveProps> = () => {
  const walletAddress = useAppSelector(getWalletAddress);
  const isAuth = useAppSelector(isAuthenticated);

  const [shows, setShows] = useState(5);
  const [nftstaked, setNftstaked] = useState<any[]>([]);
  const userInfo = useAppSelector(getMyInfo);
  const [claims, setClaims] = useState<number>(0);
  const [leftHours, setLeftHours] = useState<number>(0);

  const [isLoading, setIsLoading] = useState(false);
  const [rewardStored, setRewardStored] = useState<number>(0);
  const [collect, setCollect] = useState<number>(0);
  const [stakeValue, setStakeValue] = useState<any>();
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [status, setStatus] = useState<number>(0);
  const [showMoveSuccessModal, setShowMoveSuccessModal] = useState(false);
  const [feeCollect, setFeeCollect] = useState<number>(0);
  const [isConnectPuml, setIsConnectPuml] = useState<boolean>(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [steps, setSteps] = useState(0);

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
    if (isAuth && walletAddress) {
      const switchNet = async () => {
        const networkID = EthUtil.getNetwork();
        if (networkID && networkID !== configs.ONBOARD_NETWORK_ID) {
          await switchNetwork(configs.ONBOARD_NETWORK_ID);
          window.location.reload();
        }
      };
      switchNet();
    } else {
      setIsConnectPuml(false);
    }
  }, [isAuth, walletAddress]);

  window.onload = function () {
    if (isAuth && walletAddress) {
      const qrConnect = async () => {
        const connect = await UserController.qrConnect({
          ethAddress: walletAddress
        });
        if (connect.success) {
          if (connect.user && connect.user.userId) {
            dailySteps(parseFloat(connect.user.userId));
          }
          setIsConnectPuml(true);
          loadNft();
          clearInterval(cons);
        }
      };
      qrConnect();
      const cons = setInterval(qrConnect, 3000);
    }
  };

  const dailySteps = async (userId: number) => {
    const timeDate: string =
      new Date().getFullYear() +
      "-" +
      ("0" + (new Date().getMonth() + 1)).substr(-2) +
      "-" +
      ("0" + new Date().getDate()).substr(-2) +
      "'T'" +
      ("0" + new Date().getHours()).substr(-2) +
      ":" +
      ("0" + new Date().getMinutes()).substr(-2) +
      ":" +
      ("0" + new Date().getSeconds()).substr(-2) +
      ".SSSZ";
    const getDailySteps = await UserController.getDailySteps({
      pumlUserId: userId,
      timeUpdate: timeDate,
      updateKey: cryptMD5(
        timeDate +
          userId.toString() +
          "K0YHykvCmo3qlVd1jBFNU7jRdXREuDKo9d7OH5gzIyfF5JyRzCzdkv2QoOm8AKvB"
      )
    });
    if (getDailySteps && getDailySteps.nSteps) {
      setSteps(getDailySteps.nSteps);
    }
  };

  const loadNft = async () => {
    let nftstaked: any[] = [];
    let status: number = 0;

    const { tokens } = await NftController.getApprovedList();
    if (tokens.length > 0) status = 1;

    for (let token of tokens) {
      if (token.stake !== null) {
        if (token.stake) {
          nftstaked.push(token);
        }
      }
    }
    if (nftstaked.length > 0) status = 2;

    setNftstaked(nftstaked);
    setStatus(status);
    stakeData();
  };

  const stakeData = async () => {
    const data = await SmartContract.getUserData();
    console.log("stakedata", data);
    if (data && Object.keys(data).length > 0) {
      if (data.userLastUpdateTime > 0) {
        const leftHours =
          24 - (data.lastUpdateTime - data.userLastUpdateTime) / 3600;
        if (leftHours > 0) setLeftHours(Math.ceil(leftHours));
      }
      setRewardStored(data.userRewardStored / 1e18);
      setStakeValue(data);
    }
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

  const handleChange = (e: any) => {
    if (e.target.value < 0) return;
    setClaims(parseFloat(e.target.value));
  };

  const getDollarPrice = (value: any) => {
    let dollarPrice: any = 0;
    if (value) {
      dollarPrice = (value * 0.05).toFixed(2);
    }
    return dollarPrice;
  };

  const getClaim = async () => {
    if (claims === 0) return;

    const stored: number = rewardStored + collect;
    if (stored === 0) {
      setShowMoveModal(true);
    } else {
      if (leftHours > 0) {
        toast.warning("Be able to claim once per day");
        NotificationManager.error("Be able to claim once per day", "Error");
        setClaims(0);
        return;
      }
      if (claims > stored) {
        toast.warning("Please claim less than the reward stored");
        NotificationManager.error(
          "Please claim less than the reward stored",
          "Error"
        );
        setClaims(0);
        return;
      }

      setIsLoading(true);
      // try {
      //   const rewardResult = await SmartContract.claim(claims, feeCollect);
      //   if (rewardResult.success && rewardResult.transactionHash) {
      //     // const transferResult = await NftController.rewardPuml({
      //     //   amount: claims,
      //     //   staker: EthUtil.getAddress()
      //     // });
      //     // if (transferResult.success && transferResult.transactionHash) {
      //     setClaims(0);
      //     stakeData();
      //     setIsLoading(false);
      //     setShowMoveSuccessModal(true);

      //     // } else {
      //     //   toast.warning("Collect Failed!");
      //     //   NotificationManager.error("Collect Failed!", "Error");
      //     //   setIsLoading(false);
      //     // }
      //   } else {
      //     toast.warning("Claim Failed!");
      //     NotificationManager.error("Claim Failed!", "Error");
      //     setIsLoading(false);
      //   }
      // } catch (err) {
      //   toast.warning("Failed!");
      //   NotificationManager.error("Failed!", "Error");
      //   setIsLoading(false);
      // }
    }
  };

  useEffect(() => {
    const getCollect = async () => {
      if (stakeValue && Object.keys(stakeValue).length > 0) {
        if (stakeValue.userLastUpdateTime === 0) return;

        const { tradingFee } = await NftController.getPumlTradingFee({
          user: EthUtil.getAddress(),
          startTime: stakeValue.userLastUpdateTime
        });
        setFeeCollect(tradingFee);

        let collectRate = tradingFee;
        if (stakeValue.totalBalances > 0) {
          collectRate += stakeValue.balances / stakeValue.totalBalances;
        }
        if (stakeValue.totalBalancesNFT > 0) {
          collectRate += stakeValue.balancesNFT / stakeValue.totalBalancesNFT;
        }
        const balanceOfPumlx: any = await SmartContract.balanceOfPuml(
          configs.PUMLSTAKE_ADDRESS
        );
        const collected =
          (((collectRate * balanceOfPumlx.balance) / 2372500) *
            6500 *
            (new Date().getTime() / 1000 - stakeValue.userLastUpdateTime)) /
          86400;

        setCollect(collected / 1e18);
      }
    };
    getCollect();
  }, [stakeValue]);

  const connectPuml = () => {
    if (isAuth && walletAddress) {
      setShowScanModal(true);
    } else {
      toast.warning("Please connect metamask wallet.");
      NotificationManager.error("Please connect metamask wallet.", "Error");
    }
  };

  return (
    <Layout className="move-container">
      {isLoading && <LoadingSpinner></LoadingSpinner>}
      <div className={`section-intro ${isConnectPuml ? "welcome-claim" : ""}`}>
        <div className="intro-content text-left">
          {isConnectPuml ? (
            <>
              <p className="intro-title pb-0">Welcome back,</p>
              <p className="intro-type">{userInfo.name}</p>
              <p className="intro-title intro-title--bottom">
                Claim your PUML Steps
              </p>
              <p className="intro-steps">{steps.toFixed(2)} Steps</p>
              <div className="inp">
                <div className="inp__input inp__input--prex col-md-8">
                  <img className="mr-3" src={puml1} width={42} alt="ethIcon" />
                  <input
                    type="number"
                    name="claims"
                    value={claims}
                    onChange={(e) => handleChange(e)}
                  />
                  <i className="ml-3">(${getDollarPrice(claims)})</i>
                </div>
                <div className="inp__btn col-md-4 mt-1">
                  <button
                    disabled={claims === 0 ? true : false}
                    className="btn btn-primary"
                    onClick={getClaim}
                  >
                    <span>Claim</span>
                  </button>
                </div>
              </div>
              <div className="time">
                <span className="time__left">{leftHours} hours &nbsp;</span>
                remaining to claim today’s steps.
              </div>
            </>
          ) : (
            <MoveToEarn
              isAuth={isAuth}
              walletAddress={walletAddress}
              handleIsConnect={setIsConnectPuml}
              handleLoadNft={loadNft}
              handleConnectPuml={connectPuml}
              handleGetDailySteps={dailySteps}
            />
          )}
        </div>
        <div className="intro-ticket">
          <div className="blur-bg"></div>
          <Image className="ticket-img" src={stakeImg} alt="ticket"></Image>
        </div>
      </div>
      {isConnectPuml ? (
        <div className="moves">
          <div className="moves__title">
            <div className="item-title">Staked NFT’s ({nftstaked.length})</div>
            <div className="item-desc mt-3">Earning 10 PUMLx per day</div>
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
                          >
                            <div className="slide__item">
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
            </>
          ) : (
            <div className="moves__noitem mt-3">
              <Image src={nostakeIcon} />
              <div className="moves__normal p-3">You have no staked NFT’s</div>
            </div>
          )}
        </div>
      ) : (
        <div className="move-intro d-flex">
          <div className="col-md-6">
            <Image
              className="move-intro__img"
              src={watchIcon}
              alt="mask"
            ></Image>
          </div>
          <div className="move-intro__desc col-md-6">
            <div className="move-sen">
              <div className="move-sen__title">Get Started</div>
              <div className="move-sen__subtitle">How does PUMLx work?</div>
              <div className="move-sen__description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Blandit
                est ac nulla faucibus proin nisl augue. Vestibulum sem
                scelerisque suspendisse praesent pretium non. At mattis bibendum
                ut sed praesent.
              </div>
              <div className="step-div">
                <ul className="move-sen__step">
                  <li>Track your steps</li>
                  <li>Open the app to scan</li>
                  <li>Connect your Puml Wallet </li>
                  <li>Purchase NFT</li>
                  <li>Stake NFT</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      <MoveModal
        show={showMoveModal}
        handleClose={() => {
          setShowMoveModal(false);
        }}
        status={status}
      ></MoveModal>
      <MoveSuccessModal
        show={showMoveSuccessModal}
        handleClose={() => {
          setShowMoveSuccessModal(false);
        }}
        reward={claims}
        rewardDollar={getDollarPrice(claims)}
      ></MoveSuccessModal>
      <PumlScanModal
        show={showScanModal}
        handleClose={() => {
          setShowScanModal(false);
        }}
        wallet={walletAddress}
      ></PumlScanModal>
    </Layout>
  );
};

export default Move;
