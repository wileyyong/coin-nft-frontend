/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Layout from "components/Layout";
import Carousel from 'react-bootstrap/Carousel';

import { Button, Image } from "react-bootstrap";


import puml from "assets/imgs/puml2.png";
import puml1 from "assets/imgs/puml1.png";
import maskIcon from "assets/imgs/mask.png";
import nostakeIcon from "assets/imgs/nostake.png";

import NftController from "controller/NftController";

interface StakeProps { }

const Stakes: React.FC<StakeProps> = () => {
  const [stakeTab, setStakeTab] = useState("stake");
  const [stake, setStake] = useState(0);
  const [unstake, setUnstake] = useState(0);
  const [collects, setCollects] = useState(0);
  const [shows, setShows] = useState(5);
  const [nftunstaked, setNftunstaked] = useState<any[]>([]);
  const [nftstaked, setNftstaked] = useState<any[]>([]);
  const [stakeArr, setStakeArr] = useState<any[]>([]);
  const [unstakeArr, setUnstakeArr] = useState<any[]>([]);

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
    let nftstaked: any[] = [];
    let nftunstaked: any[] = [];
    const loadNft = async () => {
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
    }
    loadNft();
  });

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

  const selectStake = (stake: boolean, nft: any) => {
    let stakearr: any[] = stakeArr;
    let unstakearr: any[] = unstakeArr;
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
        console.log("asdf", unstakearr);
        setUnstakeArr(unstakearr);
        break;
    }
  }

  return (
    <Layout className="stake-container">
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
          <div className="item-price mt-3">0.32423233 PUMLX</div>
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
              <i className="ml-3">($0.00)</i>
            </div>
            <div className="inp__btn col-md-4 mt-1">
              <button className={`btn btn-primary ${collects === 0 ? "btn-inactive" : ""}`}>
                <div className="d-flex flex-row align-items-center">
                  <span>Collect</span>
                </div>
              </button>
            </div>
          </div>
          <div className="valupap">
            <div className="valupap__key">Last collected</div>
            <div className="valupap__val">
              <span>800 <b>PUMLx</b></span>
              <i>($400.00)</i>
            </div>
          </div>
          <div className="valupap">
            <div className="valupap__key">Collected to date:</div>
            <div className="valupap__val">
              <span>800 <b>PUMLx</b></span>
              <i>($400.00)</i>
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
              <span>800 <b>PUMLx</b></span>
              <i>($400.00)</i>
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
                <button className={`btn btn-primary ${stake > 0 ? "btn-inactive" : ""}`}>
                  <div className="d-flex flex-row align-items-center">
                    <span>Stake</span>
                  </div>
                </button>
              ) : (
                <button className={`btn btn-primary ${unstake > 0 ? "btn-inactive" : ""}`}>
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
              <span>450 <b>PUMLx</b></span>
            </div>
          </div>
          <div className="valupap">
            <div className="valupap__key">Your stake compunding:</div>
            <div className="valupap__val">
              <span>0 <b>PUMLx</b></span>
              <i>($0.00)</i>
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
                        onClick={() => selectStake(true, nft._id)}
                      >
                        <div className={`slide__item ${stakeArr.includes(nft._id) ? "slide__item--active" : ""}`}>
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
            <button className="btn btn-primary">
              <div className="d-flex flex-row align-items-center">
                <span>Stake</span>
              </div>
            </button>
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
                        onClick={() => selectStake(false, nft._id)}
                      >
                        <div className={`slide__item ${unstakeArr.includes(nft._id) ? "slide__item--active" : ""}`}>
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
            <button className="btn btn-primary">
              <div className="d-flex flex-row align-items-center">
                <span>Stake</span>
              </div>
            </button>
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
            <span>800 <b>PUMLx</b></span>
            <i>($400.00)</i>
          </div>
        </div>
      </div>
    </Layout >
  );
};

export default Stakes;
