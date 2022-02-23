import { abi as engineABI } from './abis/Engine.json';
import { abi as PUML721ABI } from './abis/PumlNFT.json';
import { web3 } from './OnBoard';
import configs from 'configs';
import EthUtil from './EthUtil';

class Contract {

    getPuml721Address(net: any) {
        if (net) {
          switch(net) {
            case configs.ONBOARD_POLYGON_ID:
              return configs.MATIC_PUML721_ADDRESS;
            case configs.ONBOARD_NETWORK_ID:
              return configs.PUML721_ADDRESS;
            default:
              return configs.PUML721_ADDRESS;
          }
        }
    }

    getEngine721Address (net: any) {
        if (net) {
          switch(net) {
            case configs.ONBOARD_POLYGON_ID:
              return configs.MATIC_ENGINE721_ADDRESS;
            case configs.ONBOARD_NETWORK_ID:
              return configs.ENGINE721_ADDRESS;
            default:
              return configs.ENGINE721_ADDRESS;
          }
        }
    }

    async createNft(tokenURI: any , royalties: any , locked_content: string = '') {
        if(web3) {
            const network = EthUtil.getNetwork();
            const PUML_721_ADDRESS = this.getPuml721Address(network);
            const PUMLContract = new web3.eth.Contract(PUML721ABI, PUML_721_ADDRESS);
            try{
                const result: any = await PUMLContract.methods.createItem(tokenURI, royalties , locked_content).send({
                    from: EthUtil.getAddress()
                });
                if(result.status === true) {
                    const { Transfer } = result.events;
                    if(Transfer && Transfer["returnValues"]) return { success: true , tokenId: Transfer["returnValues"]["tokenId"] };
                }
            }catch(err) {
                return { success: false, error: err }
            }
        }
        return { success: false, error: 'Failed to create NFT!' };
    }

    async approve(tokenId: any) {
        const network = EthUtil.getNetwork();
        const PUML_721_ADDRESS = this.getPuml721Address(network);
        const ENGINE_721_ADDRESS = this.getEngine721Address(network);
        if(web3) {
            // const bytecode = await new web3.eth.getCode(ENGINE_721_ADDRESS);
            const PUMLContract = new web3.eth.Contract(PUML721ABI, PUML_721_ADDRESS);
            try {
                await PUMLContract.methods.approve(ENGINE_721_ADDRESS, tokenId).send({
                    from: EthUtil.getAddress()
                });
                return true;
            }catch(err) {
                console.log(err);
            }
        }
        return false;
    }

    async createOffer(tokenId: any, isDirectSale: boolean , isAuction: boolean , price: any, minPrice: any, startTime: any, duration: any) {
        const network = EthUtil.getNetwork();
        const PUML_721_ADDRESS = this.getPuml721Address(network);
        const ENGINE_721_ADDRESS = this.getEngine721Address(network);
        if(web3) {
            const engineContract = new web3.eth.Contract(engineABI, ENGINE_721_ADDRESS);
            try {
                await engineContract.methods.createOffer(PUML_721_ADDRESS,tokenId,isDirectSale,isAuction,web3.utils.toWei('' + price),web3.utils.toWei('' + minPrice),startTime,duration).send({
                    from: EthUtil.getAddress()
                });
                return true;
            }catch(err) {
                console.log(err);
            }
        }
        return false;
    }

    async getAuctionId(tokenId: any) {
        const network = EthUtil.getNetwork();
        const ENGINE_721_ADDRESS = this.getEngine721Address(network);
        if(web3) {
            const engineContract = new web3.eth.Contract(engineABI, ENGINE_721_ADDRESS);
            try{
                let auctionId = await engineContract.methods.getAuctionId(tokenId).call();
                return auctionId;
            } catch(err) {
                return null;
            }
        }
        return null;
    }

    async bid(tokenId:any, price: any) {
        const network = EthUtil.getNetwork();
        const ENGINE_721_ADDRESS = this.getEngine721Address(network);
        if(web3) {
            let auctionId = await this.getAuctionId(tokenId);
            if(auctionId!==null) {
                const engineContract = new web3.eth.Contract(engineABI, ENGINE_721_ADDRESS);
                const result: any = await engineContract.methods.bid(auctionId).send({
                    from: EthUtil.getAddress(),
                    value: web3.utils.toWei('' + price)
                });
                if(result.status === true) {
                    return { success: true , transactionHash: result.transactionHash };
                }
            }
        }
        return { success: false, error: 'Failed to bid to this item!' };
    }

    async directBuy(tokenId: any, price: any) {
        const network = EthUtil.getNetwork();
        const ENGINE_721_ADDRESS = this.getEngine721Address(network);
        if(web3) {
            const engineContract = new web3.eth.Contract(engineABI, ENGINE_721_ADDRESS);
            // const bytecode = await new web3.eth.getCode(ENGINE_721_ADDRESS);
            const result: any = await engineContract.methods.buy(tokenId).send({
                from: EthUtil.getAddress(),
                value: web3.utils.toWei('' + price)
            })
            if(result.status === true) {
                return { success: true , transactionHash: result.transactionHash };
            }
        }
        return { success: false, error: 'Failed to buy this item directly!' };
    }
}

const smartContract = new Contract();

export default smartContract;