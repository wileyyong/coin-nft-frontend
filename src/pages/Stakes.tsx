/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import Layout from "components/Layout";

import { Button, Image } from "react-bootstrap";


import homeintroImage from "assets/imgs/home-intro.svg";
import puml from "assets/imgs/puml2.png";
import puml1 from "assets/imgs/puml1.png";
import plusSymbol from "assets/imgs/plus.png";
import amazeImg from "assets/imgs/amaze.png";
import lineImg from "assets/imgs/line.png";
import ethereumIcon from "assets/imgs/ethereum.svg"

interface HomeProps { }

const Stakes: React.FC<HomeProps> = () => {
  const [stakeTab, setStakeTab] = useState("stake");
  const [quantities, setQuantity] = useState("");
  const [collects, setCollects] = useState(0);
  const [rewards, setRewards] = useState(0);

  const handleChange = (e: any) => {
    let fieldName = e.target.name;
    if (fieldName === 'quantities') {
      setQuantity(e.target.value);
    }
    if (fieldName === 'collects') {
      setCollects(e.target.value);
    }
    if (fieldName === 'rewards') {
      setRewards(e.target.value);
    }
};

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
              <Button className="mr-2 mr-lg-4 btn-add-wallet">
                <div className="d-flex flex-row align-items-center">
                  <span>Add to wallet</span>
                  <Image className="ml-2" src={plusSymbol}></Image>
                </div>
              </Button>
            </div>
          </div>
        </div>
        <Image className="intro-image" src={homeintroImage}></Image>
        <div className="intro-ticket">
          <Image className="ticket-img" src={puml} alt="ticket"></Image>
        </div>
      </div>
      <div className="stake-intro d-flex">
        <div>
          <Image className="stake-intro__img" src={amazeImg} alt="amaze"></Image>
        </div>
        <div className="stake-intro__desc">
          <Image className="mb-2" src={lineImg} alt="line"></Image>
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
      <div className="title">
        PUMLx Staking
      </div>
      <div className="sub-title">
        180.55% APR
      </div>
      <div className="stakes">
        <div className="stakes__title">
          <div className="item-title">Your Stake</div>
          <div className="item-price">
            <span>0&nbsp;</span>PUMLx 
          </div>
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
              <input
                  type="number"
                  name="quantities"
                  value={quantities}
                  placeholder="Enter Quantity"
                  onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="inp__btn col-md-4 mt-1">
              <button className={`btn ${quantities !== '' ? "btn-primary" : "btn-inactive"}`}>
                <div className="d-flex flex-row align-items-center">
                  <span>Stake</span>
                </div>
              </button>
            </div>
          </div>
          <div className="valupap">
            <div className="valupap__key">PUMLx in wallet:</div>
            <div className="valupap__val">
              <span>450</span>
            </div>
          </div>
          <div className="valupap">
            <div className="valupap__key">Your stake compunding:</div>
            <div className="valupap__val">
              <span>0</span>
              <i>(0.00 AUD)</i>
            </div>
          </div>
        </div>
      </div>
      <div className="stakes">
        <div className="stakes__title">
          <div className="item-title">Rewards to collect</div>
          <div className="item-price">
            <span>0&nbsp;</span>
          </div>
        </div>
        <div className="stakes__contain">
          <div className="valupap">
            <div className="valupap__key">Rewards from the pool are distributed every block.</div>
          </div>
          <div className="inp">
            <div className="inp__input inp__input--prex col-md-8">
              <img className="mr-3" src={ethereumIcon} width={17} alt="ethIcon" />
              <input
                  type="number"
                  name="collects"
                  value={collects}
                  onChange={(e) => handleChange(e)}
              />
              <span className="ml-2">ETH</span>
              <i className="ml-3">(0.00 AUD)</i>
            </div>
            <div className="inp__btn col-md-4 mt-1">
              <button className={`btn ${collects > 0 ? "btn-primary" : "btn-inactive"}`}>
                <div className="d-flex flex-row align-items-center">
                  <span>Collect</span>
                </div>
              </button>
            </div>
          </div>
          <div className="valupap">
            <div className="valupap__key">Last collected</div>
            <div className="valupap__val">_</div>
          </div>
          <div className="valupap">
            <div className="valupap__key">Collected to date:</div>
            <div className="valupap__val">
              <span>800</span>
              <i>($400.00 AUD)</i>
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
              <span>800</span>
              <i>($400.00 AUD)</i>
            </div>
          </div>
        </div>
      </div>
      <div className="stakes">
        <div className="stakes__title">
          <div className="item-title">Rewards</div>
          <div className="item-price">
            <span>200&nbsp;</span>PUMLx
          </div>
        </div>
        <div className="stakes__contain">
          <div className="inp">
            <div className="inp__input inp__input--prex col-md-8">
              <img className="mr-3" src={puml1} width={32} alt="pumlIcon" />
              <input
                  type="number"
                  name="rewards"
                  value={rewards}
                  onChange={(e) => handleChange(e)}
              />
              <span className="ml-2">PUMLx</span>
              <i className="ml-3">(0.00 AUD)</i>
            </div>
            <div className="inp__btn col-md-4 mt-1">
              <button className={`btn ${rewards > 0 ? "btn-primary" : "btn-inactive"}`}>
                <div className="d-flex flex-row align-items-center">
                  <span>Collect</span>
                </div>
              </button>
            </div>
          </div>
          <div className="reward-des">
            You can collect rewards in the 22 hours between 21:00 and 19:00 every day. Don't worry, 
            your rewards won't disappear: they're just unavailable for those two hours.
          </div>
          <div className="valupap">
            <div className="valupap__key">Next distribution:</div>
            <div className="valupap__val">7 hours 14 minutes</div>
          </div>
          <div className="valupap">
            <div className="valupap__key">Next Pause</div>
            <div className="valupap__val">5 hours 14 minutes</div>
          </div>
          <div className="valupap">
            <div className="valupap__key">Last collected:</div>
            <div className="valupap__val">_</div>
          </div>
          <div className="valupap">
            <div className="valupap__key">Collected to date:</div>
            <div className="valupap__val">
              <span>0</span>
            </div>
          </div>
        </div>
      </div>
    </Layout >
  );
};

export default Stakes;
