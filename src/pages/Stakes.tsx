/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Layout from "components/Layout";
import Carousel from 'react-bootstrap/Carousel';
import { NotificationManager } from "react-notifications";
import LoadingSpinner from "components/common/LoadingSpinner";
import { NftCreateStatus } from "model/NftCreateStatus";
import StakeNftStatusModal from "components/token/StakeNftStatusModal"

import { Button, Image } from "react-bootstrap";


import puml from "assets/imgs/puml2.png";
import puml1 from "assets/imgs/puml1.png";
import maskIcon from "assets/imgs/mask.png";
import nostakeIcon from "assets/imgs/nostake.png";

import NftController from "controller/NftController";
import SmartContract from "ethereum/Contract";

import { switchNetwork } from "store/User/user.slice";
import EthUtil from 'ethereum/EthUtil';
import configs from 'configs';

import { useAppSelector } from "store/hooks";
import { getWalletPumlx } from "store/User/user.selector";

interface StakeProps { }

const Stakes: React.FC<StakeProps> = () => {
  const [stakeTab, setStakeTab] = useState("stake");
  const [stake, setStake] = useState<any>('');
  const [unstake, setUnstake] = useState<any>('');
  const [collects, setCollects] = useState<any>('');
  const [shows, setShows] = useState(5);
  const [nftunstaked, setNftunstaked] = useState<any[]>([]);
  const [nftstaked, setNftstaked] = useState<any[]>([]);
  const [stakeArr, setStakeArr] = useState<string[]>([]);
  const [unstakeArr, setUnstakeArr] = useState<string[]>([]);
  const [transFee, setTransFee] = useState<number>(0);
  const [lastUpdateTime, setLastUpdateTime] = useState(0);
  const [rewardStored, setRewardStored] = useState(0);
  const [lastCollect, setLastCollect] = useState(0);
  const [collectSum, setCollectSum] = useState(0);
  const [balancePumlx, setBalancePumlx] = useState(0);
  const [balanceNft, setBalanceNft] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [resellNftStatus, setResellNftStatus] = useState(NftCreateStatus.NONE)
  
  const pumlx = useAppSelector(getWalletPumlx);

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
    const switchNet = async () => {
      const networkID = EthUtil.getNetwork();
      if (networkID !== configs.ONBOARD_NETWORK_ID) {
          await switchNetwork(configs.ONBOARD_NETWORK_ID);
          window.location.reload();
      }
    }
    switchNet();
    loadNft();
  }, []);  

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
    setNftstaked(nftstaked);
    setNftunstaked(nftunstaked);
    stakeData();
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

  const getDollarPrice = (value: any) => {
    let dollarPrice:any = 0;
    if (value) {
      dollarPrice = (value * 0.05).toFixed(2);
    }
    return dollarPrice;
  };

  const handleChange = (e: any) => {
    let fieldName = e.target.name;
    if (fieldName === 'stake') {
      setStake(e.target.value);
    }
    if (fieldName === 'unstake') {
      setUnstake(e.target.value);
    }
    if (fieldName === 'collects') {
      setCollects(e.target.value);
    }
  };

  const selectStake = (stake: boolean, nft: string) => {
    let stakearr: string[] = [];
    let unstakearr: string[] = [];
    for (let i = 0; i < stakeArr.length; i++) {
      stakearr.push(stakeArr[i]);
    }
    for (let i = 0; i < unstakeArr.length; i++) {
      unstakearr.push(unstakeArr[i]);
    }
    switch (stake) {
      case true:
        if (!stakearr.includes(nft)) {
          stakearr.push(nft);
        } else {
          stakearr = stakearr.filter(value => value !== nft);
        }
        setStakeArr(stakearr);
        break;
      default:
        if (!unstakearr.includes(nft)) {
          unstakearr.push(nft);
        } else {
          unstakearr = unstakearr.filter(value => value !== nft);
        }
        setUnstakeArr(unstakearr);
        break;
    }
  }

  const stakeNft = async () => {
    const ids = unstakeArr;
    if (ids.length === 0) return;

    setResellNftStatus(NftCreateStatus.CREATEOFFER_PROGRESSING);
    
    const result = await NftController.stakeToken({
      contract_address: configs.PUML721_ADDRESS,
      chainIds: ids,
      stake: true
    });
    if (result.message) {
      let stakeResult: any;
      stakeResult = await SmartContract.stakeNFT(ids);
      if (stakeResult.success && stakeResult.transactionHash) {
        loadNft();
        setStakeArr([]);
        setUnstakeArr([]);
        NotificationManager.success(
          "Successfully done.",
          "Success"
        );
        setResellNftStatus(NftCreateStatus.CREATEOFFER_SUCCEED);
        setShowStatusModal(false);
      } else {
        console.log(result.error);
        NotificationManager.error("Failed!", "Error");
        setResellNftStatus(NftCreateStatus.CREATEOFFER_FAILED);
      }
    }
  }

  const approveNft = async () => {
    setShowStatusModal(true);
    setResellNftStatus(NftCreateStatus.APPROVE_PROGRESSING);

    const ids = unstakeArr;
    let approveResult: any;
    approveResult = await SmartContract.approveStakeNFT(ids);

    if (approveResult.success) {
      setResellNftStatus(NftCreateStatus.APPROVE_SUCCEED);
    } else {
      setResellNftStatus(NftCreateStatus.APPROVE_FAILED);
    }
  }

  const unstakeNft = async () => {
    const ids = stakeArr;
    if (ids.length === 0) return;

    setIsLoading(true);
    
    const result = await NftController.stakeToken({
      contract_address: configs.PUML721_ADDRESS,
      chainIds: ids,
      stake: false
    });
    if (result.message) {
      let stakeResult: any;
      stakeResult = await SmartContract.withdrawNFT(ids);
      if (stakeResult.success && stakeResult.transactionHash) {
        loadNft();
        setStakeArr([]);
        setUnstakeArr([]);
        NotificationManager.success(
          "Successfully done.",
          "Success"
        );
        setIsLoading(false);
      } else {
        console.log(result.error);
        NotificationManager.error("Failed!", "Error");
        setIsLoading(false);
      }
    }
  }


  const stakePumlx = async () => {
    if (stake <= 0 || stake === '') return;

    setIsLoading(true);
    const stakeResult = await NftController.stakePuml({
      amount: stake, 
      transFee: transFee,
      staker: EthUtil.getAddress()
    });
    if (stakeResult.success && stakeResult.transactionHash) {
      const transferResult = await SmartContract.transferToken(configs.MAIN_ACCOUNT, stake);
      if (transferResult.success && transferResult.transactionHash) {
        setStake(0);
        stakeData();
        NotificationManager.success(
          "Successfully staken.",
          "Success"
        );
        setIsLoading(false);
      } else {
        NotificationManager.error("Failed!", "Error");
        setIsLoading(false);
      }
    }
  }

  const unstakePumlx = async () => {
    if (unstake <= 0 || unstake === '') return;

    setIsLoading(true);
    if (parseFloat(unstake) > balancePumlx) {
      NotificationManager.error("Insufficient staked", "Error");
      return;
    }

    const unstakeResult = await SmartContract.withdrawPuml(unstake, transFee);
    if (unstakeResult.success && unstakeResult.transactionHash) {
      const transferResult = await NftController.unstakePuml({
        amount: unstake,
        staker: EthUtil.getAddress()
      });
      if (transferResult.success && transferResult.transactionHash) {
        setUnstake(0);
        stakeData();
        NotificationManager.success(
          "Successfully unstaken.",
          "Success"
        );
        setIsLoading(false);
      }
    } else {
      NotificationManager.error("Failed!", "Error");
      setIsLoading(false);
    }
  }

  const getReward = async () => {
    if (collects <= 0 || collects === '') return;
    if (collects > rewardStored) {
      NotificationManager.error("Collect much than store", "Error");
      return;
    }

    setIsLoading(true);
    const rewardResult = await SmartContract.getReward(collects, transFee);
    if (rewardResult.success && rewardResult.transactionHash) {
      const transferResult = await NftController.rewardPuml({
        amount: collects,
        staker: EthUtil.getAddress()
      });
      if (transferResult.success && transferResult.transactionHash) {
        NotificationManager.success(
          "Successfully collected.",
          "Success"
        );
        setCollects(0);
        stakeData();
        setIsLoading(false);
      } else {
        NotificationManager.error("Collect Failed!", "Error");
        setIsLoading(false);
      }
    }
  }

  const getPumlTransFee = async () => {
    if (lastUpdateTime > 0) {
      const trFee = await NftController.getPumlTransFee({
        updatetime: lastUpdateTime
      });
      setTransFee(trFee.sum * 0.37);
    }
  }

  const stakeData = async () => {
    const data = await SmartContract.getStakeData();
    console.log("stakedata", data);
    if (data && data.length > 0) {
      setLastUpdateTime(data[0]);
      setRewardStored(data[1]);
      setLastCollect(data[2]);
      setCollectSum(data[3]);
      setBalancePumlx(data[4]);
      setBalanceNft(data[5]);
    }
  }

  useEffect(() => {
    getPumlTransFee();
  }, [lastUpdateTime])

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
        stakeNft={stakeNft}
      ></StakeNftStatusModal>
      <div className="section-intro">
        <div className="intro-content text-left">
          <p className="intro-title pb-0">Stake PUMLx & earn up to </p>
          <p className="intro-type">180.55% APR</p>
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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Blandit est ac nulla faucibus 
              proin nisl augue. Vestibulum sem scelerisque suspendisse praesent pretium non. At 
              mattis bibendum ut sed praesent. Nam at id elementum gravida.Lorem ipsum dolor sit amet, 
              consectetur adipiscing elit. Blandit est ac nulla faucibus proin nisl augue. Vestibulum 
              sem scelerisque suspendisse praesent pretium non. At mattis bibendum ut sed praesent. 
              Nam at id elementum gravida.
            </div>
          </div>
        </div>
      </div>
      <div className="stakes">
        <div className="stakes__title">
          <div className="item-title">Claim Rewards</div>
          <div className="item-price mt-3">0 PUMLX</div>
          <div className="item-desc mt-3">
            Trading fees collected by our protocol are rewarded to PUMLx stakers
          </div>
        </div>
        <div className="stakes__contain">
          <div className="valupap">
            <div className="valupap__key">
              Rewards are calculated from the number staked PUMLX + staked NFT’s + Trading Fees
            </div>
          </div>
          <div className="inp">
            <div className="inp__input inp__input--prex col-md-8">
              <img className="mr-3" src={puml1} width={42} alt="ethIcon" />
              <input
                  type="number"
                  name="collects"
                  value={collects}
                  onChange={(e) => handleChange(e)}
              />
              <span className="ml-2">PUMLx</span>
              <i className="ml-3">(${getDollarPrice(collects)})</i>
            </div>
            <div className="inp__btn col-md-4 mt-1">
              <button 
                className={`btn btn-primary ${collects === 0 || collects === '' ? "btn-inactive" : ""}`}
                onClick={getReward}
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
              <span>{lastCollect} <b>PUMLx</b></span>
              <i>(${getDollarPrice(lastCollect)})</i>
            </div>
          </div>
          <div className="valupap">
            <div className="valupap__key">Collected to date:</div>
            <div className="valupap__val">
              <span>{rewardStored} <b>PUMLx</b></span>
              <i>(${getDollarPrice(rewardStored)})</i>
            </div>
          </div>
          <div className="devided"></div>
          <div className="valupap">
            <div className="valupap__key">PUMLx rewards are automatically compounded.</div>
          </div>
          <div className="valupap">
            <div className="valupap__key">
              <Image src={puml1} width={56} className="mr-2" />
              PUMLx
            </div>
            <div className="valupap__val valupap__val--gray">Compounding</div>
          </div>
          <div className="valupap">
            <div className="valupap__key">
              Earned to date:
            </div>
            <div className="valupap__val">
              <span>{collectSum} <b>PUMLx</b></span>
              <i>(${getDollarPrice(collectSum)})</i>
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
              className={`tab__item ${stakeTab === 'stake' ? "tab__item--active" : ""}`}
              onClick = {() => setStakeTab("stake")}
            >Stake</div>
            <div 
              className={`tab__item ${stakeTab === 'unstake' ? "tab__item--active" : ""}`}
              onClick = {() => setStakeTab("unstake")}
            >Unstake</div>
          </div>
          <div className="inp">
            <div className="inp__input col-md-8">
              {stakeTab === 'stake' ? (
                <>
                  <input
                    type="number"
                    name="stake"
                    value={stake}
                    placeholder="Enter Quantity"
                    onChange={(e) => handleChange(e)}
                  />
                  <button className="btn btn-primary">
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
                  <button className="btn btn-primary">
                    <div className="d-flex flex-row align-items-center">
                      <span>Max</span>
                    </div>
                  </button>
                </>
              )}
            </div>
            <div className="inp__btn col-md-4 mt-1">
              {stakeTab === 'stake' ? (
                <button 
                  className={`btn btn-primary ${stake === 0 || stake === '' ? "btn-inactive" : ""}`}
                  onClick={stakePumlx}
                >
                  <div className="d-flex flex-row align-items-center">
                    <span>Stake</span>
                  </div>
                </button>
              ) : (
                <button 
                  className={`btn btn-primary ${unstake === 0 || unstake === '' ? "btn-inactive" : ""}`}
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
              <span>{pumlx} <b>PUMLx</b></span>
            </div>
          </div>
          <div className="valupap">
            <div className="valupap__key">Your stake compunding:</div>
            <div className="valupap__val">
              <span>{balancePumlx} <b>PUMLx</b></span>
              <i>(${getDollarPrice(balancePumlx)})</i>
            </div>
          </div>
        </div>
      </div>
      <div className="stakes">
        <div className="stakes__title">
          <div className="item-title">Staked  NFT’s ({nftstaked.length})</div>
          <div className="item-desc mt-3">
            Stake NFT’s to earn PUMLx 
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
                        onClick={() => selectStake(true, nft.chain_id)}
                      >
                        <div className={`slide__item ${stakeArr.includes(nft.chain_id) ? "slide__item--active" : ""}`}>
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
            {stakeArr.length > 0 && (
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
            <div className="stakes__normal p-3">
              Currently no NFT’s staked
            </div>
          </div>
        )}
      </div>
      <div className="stakes">
        <div className="stakes__title">
          <div className="item-title">Unstaked  NFT’s ({nftunstaked.length})</div>
          <div className="item-desc mt-3">
            Earning 0 PUMLx per day
          </div>
        </div>
        {nftunstaked && nftunstaked.length > 0 ? (
          <>
            <Carousel interval={null} className="w-100">
              {getGroup(nftunstaked) && getGroup(nftunstaked).length > 0 && getGroup(nftunstaked).map((group, idx) => (
                <Carousel.Item key={idx}>
                  <div className="w-100 d-flex">
                    {group.map((nft: any, index: number) => (
                      <div 
                        className="myitem-card text-center p-2" 
                        key={index} 
                        style={{width: `${100 / shows}%`}}
                        onClick={() => selectStake(false, nft.chain_id)}
                      >
                        <div className={`slide__item ${unstakeArr.includes(nft.chain_id) ? "slide__item--active" : ""}`}>
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
            {unstakeArr.length > 0 && (
              <button className="btn btn-primary" onClick={() => approveNft()}>
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
              Currently no NFT’s staked
            </div>
          </div>
        )}
      </div>
      <div className="stakes">
        <div className="stakes__returnstake py-3">
          <div className="stakes__normal pb-2">
            Total NFT Stake Return:
          </div>
          <div className="valupap">
            <span>0 <b>PUMLx</b></span>
            <i>(${getDollarPrice(0)})</i>
          </div>
        </div>
      </div>
    </Layout >
  );
};

export default Stakes;
