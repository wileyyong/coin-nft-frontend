import { abi as engineABI } from './abis/Engine.json';
import { abi as PUML721ABI } from './abis/PUML721.json';
import { web3 } from './OnBoard';
import configs from 'configs';
import EthUtil from './EthUtil';

class Contract {

    async createNft(tokenURI: any , royalties: any , locked_content: string = '') {
        if(web3) {
            const PUMLContract = new web3.eth.Contract(PUML721ABI, configs.PUML721_ADDRESS);
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
        if(web3) {
            const PUMLContract = new web3.eth.Contract(PUML721ABI, configs.PUML721_ADDRESS);
            try {
                await PUMLContract.methods.approve(configs.ENGINE_ADDRESS, tokenId).send({
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
        if(web3) {
            const engineContract = new web3.eth.Contract(engineABI, configs.ENGINE_ADDRESS);
            try {
                await engineContract.methods.createOffer(configs.PUML721_ADDRESS,tokenId,isDirectSale,isAuction,web3.utils.toWei('' + price),web3.utils.toWei('' + minPrice),startTime,duration).send({
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
        if(web3) {
            const engineContract = new web3.eth.Contract(engineABI, configs.ENGINE_ADDRESS);
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
        if(web3) {
            let auctionId = await this.getAuctionId(tokenId);
            if(auctionId!==null) {
                const engineContract = new web3.eth.Contract(engineABI, configs.ENGINE_ADDRESS);
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
        if(web3) {
            const engineContract = new web3.eth.Contract(engineABI, configs.ENGINE_ADDRESS);
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