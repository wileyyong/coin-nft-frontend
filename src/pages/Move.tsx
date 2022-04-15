/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Layout from "components/Layout";
import Carousel from 'react-bootstrap/Carousel';
import LoadingSpinner from "components/common/LoadingSpinner";
import MoveModal from 'components/token/MoveModal';
import MoveSuccessModal from 'components/token/MoveSuccessModal';
import PumlScanModal from 'components/user/PumlScanModal';
import { NotificationManager } from "react-notifications";
import { toast } from 'react-toastify';

import { Button, Image } from "react-bootstrap";


import puml from "assets/imgs/puml2.png";
import puml1 from "assets/imgs/puml1.png";
import watchIcon from "assets/imgs/watch.png";
import nostakeIcon from "assets/imgs/nostake.png";

import NftController from "controller/NftController";
import UserController from "controller/UserController";
import SmartContract from "ethereum/Contract";

import { switchNetwork } from "store/User/user.slice";
import EthUtil from 'ethereum/EthUtil';
import configs from 'configs';

import { useAppSelector } from "store/hooks";
import { getWalletAddress, isAuthenticated, getMyInfo } from "store/User/user.selector";
import { setInterval } from 'timers';

interface MoveProps { }


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

  const getWidth = () => window.innerWidth 
  || document.documentElement.clientWidth 
  || document.body.clientWidth;

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
    window.addEventListener('resize', resizeListener);

    // clean up function
    return () => {
      // remove resize listener
      window.removeEventListener('resize', resizeListener);
    }
  }, []);

  useEffect(() => {
    if (isAuth && walletAddress){
      const switchNet = async () => {
        const networkID = EthUtil.getNetwork();
        if (networkID && networkID !== configs.ONBOARD_NETWORK_ID) {
            await switchNetwork(configs.ONBOARD_NETWORK_ID);
            window.location.reload();
        }
      }
      switchNet();
      const qrConnect = async () => {
        const connect = await UserController.qrConnect({ethAddress: walletAddress});
        if (connect.success) {
          setIsConnectPuml(true);
          loadNft();
        }
      }
      qrConnect();
    } else {
      setIsConnectPuml(false);
    }
  }, [isAuth, walletAddress]); 

  window.onload = function() {
    if (isAuth && walletAddress && isConnectPuml){
      loadNft();
    }
  }

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
  }

  const stakeData = async () => {
    const data = await SmartContract.getStakeData();
    console.log("stakedata", data);
    if (data && Object.keys(data).length > 0) {
      const leftHours = 24 - (data.lastUpdateTime - data.userLastUpdateTime) / 3600;
      if (data.userLastUpdateTime > 0) setLeftHours(Math.ceil(leftHours));

      setRewardStored(data.userRewardStored / 1e18);
      setStakeValue(data);
    }
  }

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
        groups.push(nfts.slice(i, i += shows));
      }
      return groups;
    }
    return [];
  }

  const handleChange = (e: any) => {
    if (e.target.value < 0) return;
    setClaims(parseFloat(e.target.value));
  };

  const getDollarPrice = (value: any) => {
    let dollarPrice:any = 0;
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
        NotificationManager.error("Please claim less than the reward stored", "Error");
        setClaims(0);
        return;
      }
  
      setIsLoading(true);
      try {
        const rewardResult = await SmartContract.getReward(claims, collect, feeCollect);
        if (rewardResult.success && rewardResult.transactionHash) {
          const transferResult = await NftController.rewardPuml({
            amount: claims,
            staker: EthUtil.getAddress()
          });
          if (transferResult.success && transferResult.transactionHash) {
            setClaims(0);
            stakeData();
            setIsLoading(false);
            setShowMoveSuccessModal(true);
  
          } else {
            toast.warning("Collect Failed!");
            NotificationManager.error("Collect Failed!", "Error");
            setIsLoading(false);
          }
        }
      } catch (err) {
        toast.warning("Failed!");
        NotificationManager.error("Failed!", "Error");
        setIsLoading(false);
      }
    }
  }

  const getPumlTransFee = async (startTime: number) => {

    if (startTime > 0) {
      const trFee = await NftController.getPumlTransFee({
        startTime: startTime
      });
      return trFee.sum * 0.37;
    }
    return 0;
  }

  useEffect(() => {
    const getCollect = async () => {
      let collect: number = 0;
      if (stakeValue && Object.keys(stakeValue).length > 0) {
        if (stakeValue.userLastUpdateTime === 0) return;

        collect = (stakeValue.lastUpdateTime - parseFloat(stakeValue.userLastUpdateTime)) * configs.REWARD_RATE * (parseFloat(stakeValue.balances) + parseFloat(stakeValue.balancesNFT)) / 86440;
        if (!isNaN(collect)) setCollect(collect);

        if (stakeValue.balances > 0 && stakeValue.totalBalances > 0) {
          const startTime: number = stakeValue.userLastUpdateTimeFeeward;
          const transFee: number = await getPumlTransFee(startTime);
          if (!isNaN(transFee)) { 
            const feeCollect: number = transFee * stakeValue.balances / stakeValue.totalBalances;
            setFeeCollect(feeCollect);
          }
        }
      }
    }
    getCollect();
  }, [stakeValue])

  const connectPuml = () => {
    if (isAuth && walletAddress) {
      setShowScanModal(true);
    } else {
      toast.warning("Please connect metamask wallet.");
      NotificationManager.error("Please connect metamask wallet.", "Error");
    }
  }

  return (
    <Layout className="move-container">
      {isLoading && <LoadingSpinner></LoadingSpinner>}
      <div className="section-intro">
        <div className="intro-content text-left">
          {isConnectPuml ? (
            <>
              <p className="intro-title pb-0">Welcome back,</p>
              <p className="intro-type">{userInfo.name}</p>
              <p className="intro-title intro-title--bottom">
                Claim your PUML Steps
              </p>
              <p className="intro-steps">{(rewardStored + collect).toFixed(5)} Steps</p>
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
                remaining  to claim today’s steps.
              </div>
            </>
          ) : (
            <>
              <p className="intro-type intro-type--italy">Move to Earn</p>
              <p className="intro-title intro-title--bottom">
                Scan the QR code to connect your steps and earn PUMLx.
              </p>
              <div className="intro-btn-wallet intro-btn-wallet--connect">
                <Button className="btn-primary" onClick={connectPuml}>
                  <div className="d-flex flex-row align-items-center">
                    <span>Connect PUML Wallet</span>
                  </div>
                </Button>
              </div>
            </>
          )}
        </div>
        <div className="intro-image"></div>
        <div className="intro-ticket">
          <Image className="ticket-img" src={puml} alt="ticket"></Image>
        </div>
      </div>
      {isConnectPuml ? (
        <div className="moves">
          <div className="moves__title">
            <div className="item-title">Staked  NFT’s ({nftstaked.length})</div>
            <div className="item-desc mt-3">
              Earning 10 PUMLx per day
            </div>
          </div>
          {nftstaked && nftstaked.length > 0 ? (
            <>
              <Carousel interval={null} className="w-100">
                {getGroup(nftstaked) && getGroup(nftstaked).length > 0 && getGroup(nftstaked).map((group, idx) => (
                  <Carousel.Item key={idx}>
                    <div className="w-100 d-flex">
                      {group.map((nft: any, index: number) => (
                        <div 
                          className="myitem-card text-center p-2" 
                          key={index} 
                          style={{width: `${100 / shows}%`}}
                        >
                          <div className="slide__item">
                            <div style={{ backgroundImage: `url(${nft.media})` }} className="card-image">
                            </div>
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
              <div className="moves__normal p-3">
                You  have no staked NFT’s
              </div>
            </div>
          )}
        </div>
      ): (
        <div className="move-intro d-flex">
          <div className="col-md-6">
            <Image className="move-intro__img" src={watchIcon} alt="mask"></Image>
          </div>
          <div className="move-intro__desc col-md-6">
            <div className="move-sen">
              <div className="move-sen__title">
                Get Started
              </div>
              <div className="move-sen__subtitle">
                How does PUMLx work? 
              </div>
              <div className="move-sen__description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Blandit est ac nulla faucibus proin nisl augue. Vestibulum sem scelerisque suspendisse praesent pretium non. At mattis bibendum ut sed praesent. 
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
    </Layout >
  );
};

export default Move;
